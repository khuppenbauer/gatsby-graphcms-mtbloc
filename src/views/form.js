import React from "react"
import ReactMarkdown from "react-markdown"
import { Formik, Form } from "formik"

import Input from "./forms/input"
import Checkbox from "./forms/checkbox"
import Textarea from "./forms/textarea"
import Button from "./forms/button"

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

const FormView = ({ form }) => {
	const { id, name, remoteFields: fields, successText } = form
	const initialValues = fields.reduce((acc, field) => {
		const { remoteTypeName, name } = field;
		if (remoteTypeName === 'FormInput' || remoteTypeName === 'FormTextarea') {
			acc[name] = "";
		} else if(remoteTypeName === 'FormCheckbox') {
			acc[name] = false;
		}
		return acc;
	}, {})

	return (
		<Formik
			key={`formik-${id}`}
			initialValues={initialValues}
			onSubmit={(values, actions) => {
				fetch("/", {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: encode({ "form-name": name, ...values }),
				})
				.then(() => {
					actions.resetForm()
					actions.setStatus({
						sent: true,
						values,
					})
				})
				.catch((error) => {
					actions.setStatus({
						sent: false,
						error,
					})
				})
				.finally(() => actions.setSubmitting(false))
			}}
			validate={values => {
				const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
				const errors = {}
				fields.map(field => {
					const { name, required, error } = field
					if (required && !values[name]) {
						errors[name] = error
					}
					if (name === 'email' && values.email && !emailRegex.test(values.email)) {
						errors.email = "E-Mail ist keine gültige E-Mail Adresse"
					}
					return null
				})
				return errors
			}}
		>
		
		{({ status }) => {
			if (status && status.sent === true) {
				return (
					<>
					  <div className="flex flex-wrap w-full mb-10">
							<ReactMarkdown className="leading-relaxed text-base">
								{successText.markdown}
							</ReactMarkdown>
            </div>
						<div className="w-full overflow-auto">
							<table className="table-auto text-left whitespace-no-wrap">
								<tbody>
									{
										fields.map(field => {
											const { id, name, label } = field
											const value = status.values[name]
											if (value) {
												return (
													<tr key={id}>
														<td className="py-3">{label}</td>
														<td className="px-4 py-3">{value}</td>
													</tr>
												)
											}
											return null
										})
									}
								</tbody>
							</table>
						</div>
					</>
				)
			} else {
				return (
					<div className="flex flex-wrap w-full mb-10">
						<Form name={name} key={`form-${id}`} data-netlify={true}>
							{
								fields.map(field => {
									const { id, name, label, placeholder, required: mandatory, remoteTypeName, type } = field;
									switch(remoteTypeName) {
										case 'FormInput':
											return <Input key={id} name={name} label={label} mandatory={mandatory} placeholder={placeholder} type={type} /> 
										case 'FormCheckbox':
											return <Checkbox key={id} name={name} label={label} mandatory={mandatory} />
										case 'FormTextarea':
											return <Textarea key={id} name={name} label={label} mandatory={mandatory} placeholder={placeholder} />
										case 'FormButton':
											return <Button key={id} label={label} />
										default:
											return null;
									}
								})
							}
						</Form>
					</div>
				)
			}
		}}
		</Formik>
	)
};

export default FormView
