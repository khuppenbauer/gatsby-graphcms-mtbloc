import React, { useState } from "react"
import { Link } from "gatsby"
import { Image as ImageIcon, MapPin as MapIcon } from "react-feather"
import slugify from '@sindresorhus/slugify';

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);

  const slide = () => {
    setIndex((index + 1) % images.length);
  };

  let button = (
    <button className="rounded-full h-10 w-10 bg-gray-900 flex items-center justify-center" onClick={slide}>
      <MapIcon className="w-5 h-5"/>
    </button>
  );
  if (index === 1) {
    button = (
      <button className="rounded-full h-10 w-10 bg-gray-900 flex items-center justify-center" onClick={slide}>
        <ImageIcon className="w-5 h-5"/>
      </button>
    );
  }
  return (
    <div key={images[index].key} id={images[index].id} className="relative w-full carousel-item">
      <img className="w-full object-cover object-center" src={images[index].src} alt={images[index].title} width="320" height="240" />
      <div className="absolute flex justify-between transform right-2 bottom-2">
        {button}
      </div>
    </div> 
  )
};

const Image = ({ id, slug, title, image, staticImage }) => {
  let assets = [];
  if (image) {
    const { id: imageId, handle } = image;
    assets.push({
      key: imageId,
      id: slugify(`${id}-${handle}`),
      src: `${assetBaseUrl}/resize=w:320,h:240,fit:crop/auto_image/compress/${handle}`,
      title,
    });
  }
  if (staticImage) {
    const { id: imageId, handle} = staticImage;
    assets.push({
      key: imageId,
      id: slugify(`${id}-${handle}`),
      src: `${assetBaseUrl}/resize=w:320,h:240,fit:crop/auto_image/compress/${handle}`,
      title,
    });
  }
  if (assets.length === 0) {
    return null;
  }

  return (
    assets.length > 1 ? (
      <ImageSlider images={assets} />
    ) : (
      <Link to={slug}>
        <img className="w-full object-cover object-center" src={assets[0].src} alt={title} width="320" height="240" />
      </Link>
    )
  );
}

export default Image
