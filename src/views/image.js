import React from "react"
import { Link } from "gatsby"
import { Image as ImageIcon, MapPin as MapIcon } from "react-feather"
import slugify from '@sindresorhus/slugify';

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

const Image = ({ id, slug, title, image, staticImage }) => {
  let assets = [];
  if (image) {
    const { id: imageId, handle } = image;
    assets.push({
      key: imageId,
      id: slugify(`${id}-${handle}`),
      src: `${assetBaseUrl}/resize=w:320,h:240,fit:crop/auto_image/compress/${handle}`,
    });
  }
  if (staticImage) {
    const { id: imageId, handle} = staticImage;
    assets.push({
      key: imageId,
      id: slugify(`${id}-${handle}`),
      src: `${assetBaseUrl}/resize=w:320,h:240,fit:crop/auto_image/compress/${handle}`,
    });
  }
  return (
    assets.length > 1 ? (
      <div className="carousel">
        {assets.map((asset, index) => {
          const { key, src, id } = asset;
          let button = (
            <a href={`#${assets[1].id}`} className="btn btn-circle">
              <MapIcon className="w-5 h-5"/>
            </a>
          );
          if (index === 1) {
            button = (
              <a href={`#${assets[0].id}`} className="btn btn-circle">
                <ImageIcon className="w-5 h-5"/>
              </a>
            );
          }
          return (
            <div key={key} id={id} className="relative w-full carousel-item">
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
    )
  );
}

export default Image
