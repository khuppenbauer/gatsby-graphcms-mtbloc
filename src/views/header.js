import React from "react"
import { Link } from "gatsby"

const Header = ({ title, description, additionalLink }) => (
  <div className="flex flex-wrap mb-6">
    <div className="w-full">
      {additionalLink ? (
        <Link to={additionalLink.to}>
          <h2 className="text-blue-400 tracking-widest font-medium title-font mb-1">{additionalLink.title}</h2>
        </Link>
      ) : null}
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
