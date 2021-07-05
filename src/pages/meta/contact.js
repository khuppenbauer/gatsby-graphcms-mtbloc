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
          <div className="flex flex-wrap w-full mb-20">
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
                  })
                  .catch(() => {
                    console.log("Error")
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
              {() => (
                <Form name="contact" data-netlify={true}>
                  <Input name="name" label="Name" />
                  <Input name="email" label="E-Mail" />
                  <Textarea name="message" label="Nachricht" />
                  <Button label="Senden" />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default ContactPage
