import React from "react"
import { Link } from "gatsby"
import slugify from '@sindresorhus/slugify';

import Image from "./image"

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

const Teaser = ({ id, slug, title, image, staticImage }) => {
  let assets = [];
  if (image) {
    const { id: imageId, handle } = image;
    assets.push({
      key: imageId,
      id: slugify(`${id}-${handle}`),
      src: `${assetBaseUrl}/resize=w:320,h:240,fit:crop/auto_image/compress/${handle}`,
      title,
      button: 'map-pin',
    });
  }
  if (staticImage) {
    const { id: imageId, handle} = staticImage;
    assets.push({
      key: imageId,
      id: slugify(`${id}-${handle}`),
      src: `${assetBaseUrl}/resize=w:320,h:240,fit:crop/auto_image/compress/${handle}`,
      title,
      button: 'image',
    });
  }
  return (
    <div className="p-4 md:w-1/3 w-full">
      <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
        {assets.length > 0 ? (
          <Image id={id} assets={assets} slug={slug} />
        ) : null}
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
