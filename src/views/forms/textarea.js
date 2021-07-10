import React from "react"
import { Field, ErrorMessage } from "formik"

const Textarea = ({ name, label, placeholder, mandatory }) => (
  <div className="relative mb-4">
    <Field
      name={name}
      component="textarea"
      placeholder={`${placeholder}${mandatory ? ' * ' : ''}`}
      className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
    />
    <div className="text-red-400">
      <ErrorMessage name={name} />
    </div>
  </div>
)

export default Textarea
