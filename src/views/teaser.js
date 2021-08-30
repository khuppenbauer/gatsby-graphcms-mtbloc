import React from "react"
import { Link } from "gatsby"

import Image from "./image"

const Teaser = ({ id, slug, title, image, staticImage }) => {
  return (
    <div className="p-4 md:w-1/3 xl:w-1/5 w-full">
      <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
        <Image id={id} slug={slug} title={title} image={image} staticImage={staticImage} />
        <div className="p-6">
          <Link to={slug}>
            <h1 className="title-font text-lg font-medium text-white mb-3">
              {title}
            </h1>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Teaser
