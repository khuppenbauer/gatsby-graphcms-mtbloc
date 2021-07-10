import React from "react"
import { Field, ErrorMessage } from "formik"

const Input = ({ name, label, placeholder, mandatory, type }) => (
  <div className="relative mb-4">
    <Field
      name={name}
      type={type}
      placeholder={`${placeholder}${mandatory ? ' * ' : ''}`}
      className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
    />
    <div className="text-red-400">
      <ErrorMessage name={name} />
    </div>
  </div>
)

export default Input
