import React from "react"

const Button = ({ label }) => (
  <button
    type="submit"
    className="text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg"
  >
    {label}
  </button>
)

export default Button
