import * as React from "react"
import { Formik, Form } from "formik"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Headline from "../../views/headline"
import Input from "../../views/forms/input"
import Textarea from "../../views/forms/textarea"
import Button from "../../views/forms/button"

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

const ContactPage = () => {
  return (
    <Layout>
      <Seo title="Contact" />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-12 mx-auto">
          <Headline title="Kontakt" />
          <Formik
            initialValues={{
              name: "",
              email: "",
              message: "",
            }}
            onSubmit={(values, actions) => {
              fetch("/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: encode({ "form-name": "contact", ...values }),
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
              if (!values.name) {
                errors.name = "Name Required"
              }
              if (!values.email || !emailRegex.test(values.email)) {
                errors.email = "Valid Email Required"
              }
              if (!values.message) {
                errors.message = "Message Required"
              }
              return errors
            }}
          >
            
            {({ status }) => {
              if (status && status.sent === true) {
                const { name, email, message } = status.values;
                return (
                  <>
                    <div className="flex flex-wrap w-full mb-10">
                      Vielen Dank für Ihre Nachricht
                    </div>
                    <div className="w-full overflow-auto">
                      <table className="table-auto text-left whitespace-no-wrap">
                        <tbody>
                          <tr>
                            <td className="py-3">Name</td>
                            <td className="px-4 py-3">{name}</td>
                          </tr>
                          <tr>
                            <td className="py-3">E-Mail</td>
                            <td className="px-4 py-3">{email}</td>
                          </tr>
                          <tr>
                            <td className="py-3">Nachricht</td>
                            <td className="px-4 py-3">{message}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )
              } else {
                return (
                  <div className="flex flex-wrap w-full mb-20">
                    <Form name="contact" data-netlify={true}>
                      <Input name="name" label="Name" mandatory />
                      <Input name="email" label="E-Mail" mandatory />
                      <Textarea name="message" label="Nachricht" mandatory />
                      <Button label="Senden" />
                    </Form>
                  </div>
                )
              }
            }}
          </Formik>
        </div>
      </section>
    </Layout>
  )
}

export default ContactPage
