import React from "react"

const Header = ({ title, description }) => (
  <div className="flex flex-wrap mb-6">
    <div className="w-full">
      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-white">{title}</h1>
    </div>
    {description ? (
      <>
        <div 
          className="w-full mb-t lg:mt-0 leading-relaxed text-gray-400 text-opacity-90 pt-4"
          dangerouslySetInnerHTML={{__html: description.html}} 
        />
      </>
    ) : null}
  </div>
)

export default Header
