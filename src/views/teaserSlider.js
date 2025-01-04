import React, { useState } from "react"
import { Link } from "gatsby"
import { ChevronLeft, ChevronRight } from "react-feather"

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

const TeaserSlider = ({ items }) => {
  const [index, setIndex] = useState(0);

  const slideRight = () => {
    setIndex((index + 1) % items.length);
  };

  const slideLeft = () => {
    const nextIndex = index - 1;
    if (nextIndex < 0) {
      setIndex(items.length - 1);
    } else {
      setIndex(nextIndex);
    }
  };

  const body = (item) => {
    const { category, title, text } = item;
    return (
      <>
        {category ? (
          <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">{category}</h2>
        ) : null}
        {title ?  (
          <h1 className="title-font text-lg font-medium text-white mb-3">{title}</h1>
        ) : null}
        {text ? (
          <div className="flex items-center flex-wrap my-4" dangerouslySetInnerHTML={{__html: text }} />
        ) : null}
      </>
    );
  };

  return (
    <div key={items[index].key} id={items[index].id} className="relative md:w-1/2 lg:w-full w-full flex justify-center">
      {items.length > 1 ? (
        <div className="absolute flex justify-between items-center transform left-6 bottom-6">
          <button className="rounded-full h-6 w-6 bg-gray-800 flex items-center justify-center" onClick={slideLeft}>
            <ChevronLeft className="w-8 h-8"/>
          </button>
        </div>
      ) : null}
      <div className="p-4" key={items[index].key}>
        <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
          {items[index].img ? (
            <div className="bg-gray-800">
              <img className={items[index].imgClassName} src={items[index].img.replace('undefined', assetBaseUrl)} alt={items[index].title} />
            </div>
          ) : null}
          <div className="p-6">
            {items[index].url && items[index].urlType === 'external' ? (
              <a href={items[index].url} target="_blank" rel="noreferrer">{body(items[index])}</a>
            ) : null}
            {items[index].url && items[index].urlType === 'internal' ? (
              <Link to={items[index].url}>{body(items[index])}</Link>
            ) : null}
            {!items[index].url ? (
              <>{body(items[index])}</>
            ) : null}
          </div>
        </div>
      </div>
      {items.length > 1 ? (
        <>
          <div className="absolute flex justify-between items-center transform bottom-6">
            <span className="text-gray-500 inline-flex leading-none text-sm py-1">{index+1} / {items.length}</span>
          </div>
          <div className="absolute flex justify-between items-center transform-y right-6 bottom-6">
            <button className="rounded-full h-6 w-6 bg-gray-800 flex items-center justify-center" onClick={slideRight}>
              <ChevronRight className="w-8 h-8"/>
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
};

export default TeaserSlider
