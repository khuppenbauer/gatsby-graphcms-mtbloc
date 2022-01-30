import React from "react"

const Headline = ({ title, description }) => (
  <div className="flex flex-wrap w-full mb-6">
    <div className="w-full">
      <h2 className="text-xl font-medium title-font mb-2 text-white">
        {title}
      </h2>
      <div className="h-1 w-20 bg-blue-500 rounded"></div>
    </div>
    {description ? (
      <>
        <div 
          className="w-full mb-t lg:mt-0 mb-6 leading-relaxed text-gray-400 text-opacity-90 pt-4"
          dangerouslySetInnerHTML={{__html: description.html}} 
        />
        <div className="w-full">
          <h2 className="text-xl font-medium title-font mb-2 text-white">
            Übersicht
          </h2>
          <div className="h-1 w-20 bg-blue-500 rounded"></div>
        </div>
      </>
    ) : null}
  </div>
)

export default Headline
