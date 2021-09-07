import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "react-feather"

const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);

  const slideRight = () => {
    setIndex((index + 1) % images.length);
  };

  const slideLeft = () => {
    const nextIndex = index - 1;
    if (nextIndex < 0) {
      setIndex(images.length - 1);
    } else {
      setIndex(nextIndex);
    }
  };

  return (
    <div key={images[index].key} id={images[index].id} className="relative w-full bg-gray-800 flex justify-center h-80 w-80">
      {images.length > 1 ? (
        <div className="absolute flex justify-between items-center transform left-2 top-1/2">
          <button className="rounded-full h-12 w-12 bg-gray-900 flex items-center justify-center" onClick={slideLeft}>
            <ChevronLeft className="w-8 h-8"/>
          </button>
        </div>
      ) : null}
      <img className="object-cover object-center" src={images[index].src} alt={images[index].title} />
      {images.length > 1 ? (
        <div className="absolute flex justify-between items-center transform-y right-2 top-1/2">
          <button className="rounded-full h-12 w-12 bg-gray-900 flex items-center justify-center" onClick={slideRight}>
            <ChevronRight className="w-8 h-8"/>
          </button>
        </div>
      ) : null}
    </div> 
  )
};

export default ImageSlider
