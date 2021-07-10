import React from "react"
import { Field, ErrorMessage } from "formik"

const Checkbox = ({ name, label, mandatory }) => (
  <div className="relative mb-4">
    <Field
      name={name}
      type="checkbox"
      className="bg-gray-800 bg-opacity-40 text-gray-100 py-1 px-3 mr-2"
    />
    <label htmlFor={name} className="leading-7 text-sm text-gray-400">
      {label}{mandatory ? ' * ' : ' '}
    </label>
    <div className="text-red-400">
      <ErrorMessage name={name} />
    </div>
  </div>
)

export default Checkbox
