import React from "react"

const Headline = ({ title }) => (
  <div className="flex flex-wrap mb-6">
    <div className="w-full">
      <h2 className="text-xl font-medium title-font mb-2 text-white">
        {title}
      </h2>
      <div className="h-1 w-20 bg-blue-500 rounded"></div>
    </div>
  </div>
)

export default Headline
