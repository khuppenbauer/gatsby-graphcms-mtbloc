import React from "react"
import { Link } from "gatsby"

const Teaser = ({ slug, title }) => (
  <div className="p-4 md:w-1/3">
    <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
      <Link to={slug}>
        <div className="p-6">
          <h1 className="title-font text-lg font-medium text-white mb-3">
            {title}
          </h1>
        </div>
      </Link>
    </div>
  </div>
)

export default Teaser
