import React from "react"
import { Link } from "gatsby"
import Image from "@graphcms/react-image";

const Teaser = ({ slug, title, image, asset }) => (
  <div className="p-4 md:w-1/3 xl:w-1/5 w-full">
    <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
      <Link to={slug}>
        {image ? <Image image={image} className="w-full object-cover object-center" /> : null}
        {asset ? <img className="w-full object-cover object-center" src={asset} alt={title} width="320" height="240" /> : null}
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
