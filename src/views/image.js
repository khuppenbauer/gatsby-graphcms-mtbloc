import React, { useState } from "react"
import { Link } from "gatsby"
import { Image as ImageIcon, MapPin as MapPinIcon, Map as MapIcon } from "react-feather"


const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);

  const slide = () => {
    setIndex((index + 1) % images.length);
  };

  return (
    <div key={images[index].key} id={images[index].id} className="relative w-full carousel-item">
      <img className="w-full object-cover object-center" src={images[index].src} alt={images[index].title} width="320" height="240" />
      <div className="absolute flex justify-between transform right-2 bottom-2">
        <button className="rounded-full h-10 w-10 bg-gray-900 flex items-center justify-center" onClick={slide}>
          {
            {
              'image': <ImageIcon className="w-5 h-5"/>,
              'map': <MapIcon className="w-5 h-5"/>,
              'map-pin': <MapPinIcon className="w-5 h-5"/>
            }[images[index].button]
          }
        </button>
      </div>
    </div> 
  )
};

const Image = ({ slug, title, assets }) => {
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
