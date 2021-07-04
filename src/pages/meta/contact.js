import * as React from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"

import Layout from "../../components/layout"
import Seo from "../../components/seo"

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&")
}

const ContactPage = () => {
  return (
    <Layout>
      <Seo title="Contact" />
      <section className="text-gray-400 body-font bg-gray-900">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap w-full mb-10">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-white">
                Kontakt
              </h1>
              <div className="h-1 w-20 bg-blue-500 rounded"></div>
            </div>
          </div>
          <div className="flex flex-wrap flex flex-wrap w-full mb-20">
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
                  body: encode({ "form-name": "contact-demo", ...values }),
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
                  <div className="relative mb-4">
                    <label
                      htmlFor="name"
                      className="leading-7 text-sm text-gray-400"
                    >
                      Name:{" "}
                    </label>
                    <Field
                      name="name"
                      className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <ErrorMessage name="name" />
                  </div>
                  <div className="relative mb-4">
                    <label
                      htmlFor="email"
                      className="leading-7 text-sm text-gray-400"
                    >
                      E-Mail:{" "}
                    </label>
                    <Field
                      name="email"
                      className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    <ErrorMessage name="email" />
                  </div>
                  <div className="relative mb-4">
                    <label
                      htmlFor="message"
                      className="leading-7 text-sm text-gray-400"
                    >
                      Nachricht:{" "}
                    </label>
                    <Field
                      name="message"
                      component="textarea"
                      className="w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    />
                    <ErrorMessage name="message" />
                  </div>
                  <button
                    type="submit"
                    className="text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg"
                  >
                    Senden
                  </button>
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
