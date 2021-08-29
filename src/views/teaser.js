import React from "react"
import { Link } from "gatsby"
import { Image, MapPin } from "react-feather"

const Teaser = ({ slug, title, assets }) => {
  return (
    <div className="p-4 md:w-1/3 xl:w-1/5 w-full">
      <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
        {assets.length > 1 ? (
          <div className="carousel">
            {assets.map((asset, index) => {
              const { id, src, handle } = asset;
              let button = (
                <a href={`#${assets[1].handle}`} className="btn btn-circle">
                  <MapPin className="w-5 h-5"/>
                </a>
              );
              if (index === 1) {
                button = (
                  <a href={`#${assets[0].handle}`} className="btn btn-circle">
                    <Image className="w-5 h-5"/>
                  </a>
                );
              }
              return (
                <div key={id} id={handle} className="relative w-full carousel-item">
                  <img className="w-full object-cover object-center" src={src} alt={title} width="320" height="240" />
                  <div className="absolute flex justify-between transform right-2 bottom-2">
                    {button}
                  </div>
                </div> 
              )
            })}
          </div>
        ) : (
          <Link to={slug}>
            <img className="w-full object-cover object-center" src={assets[0].src} alt={title} width="320" height="240" />
          </Link>
        )}
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
