import React from "react"

const Headline = ({ title, description }) => (
  <div className="flex flex-wrap w-full mb-10">
    <div className="w-full mb-6 lg:mb-0">
      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-white">
        {title}
      </h1>
      <div className="h-1 w-20 bg-blue-500 rounded"></div>
    </div>
    {description ? (
      <p className="w-full leading-relaxed text-gray-400 text-opacity-90">
        {description}
      </p>
    ) : null}
  </div>
)

export default Headline
