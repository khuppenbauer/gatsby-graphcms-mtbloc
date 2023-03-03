import React from "react"
import { renderToString } from 'react-dom/server';

import TeaserSlider from "./teaserSlider"
import { renderMetaData } from "../helpers/track"

const cloudinaryBaseUrl = process.env.GATSBY_CLOUDINARY_BASE_URL
const cloudinaryAppId = process.env.GATSBY_CLOUDINARY_APP_ID

const getMapItems = (data) => data
  .filter(item => item.type === 'map')
  .map(mapItem => {
    const { _id: id, foreignKey: key, meta } = mapItem;
    const { name, article, url, img, scale, type } = meta;
    return {
      id,
      key,
      text: `${article}<br />${name}<br />1:${scale} `,
      category: 'Karten',
      title: type,
      url,
      urlType: 'external',
      img,
      imgClassName: 'w-1/3 m-auto object-cover object-center'
    };
  });

const getBookItems = (data) => data
  .filter(item => item.type === 'book')
  .map(bookItem => {
    const { _id: id, foreignKey: key, meta } = bookItem;
    const { title, subtitle, url, image } = meta;
    return {
      id,
      key,
      text: subtitle,
      category: 'Bücher',
      title,
      url,
      urlType: 'external',
      img: image,
      imgClassName: 'w-full object-cover object-center'
    };
  });

const getTrackItems = (data, tracks) => data
  .filter(item => {
    const existingTracks = tracks.filter(track => track.name === item.name);
    return item.type === 'track' && existingTracks.length === 0
  })
  .map(trackItem => {
    const { _id: id, foreignKey: key, meta } = trackItem;
    const { title, slug, previewImageUrl: img, distance, totalElevationGain, totalElevationLoss } = meta;
    const text = renderMetaData({ distance, totalElevationGain, totalElevationLoss });
    let previewImage = '';
    if (img) {
      const preview = img.split('/preview/');
      previewImage = img;
      if(preview[1]) {
        previewImage = `${cloudinaryBaseUrl}/q_auto:eco/${cloudinaryAppId}/preview/${preview[1].replace(/.jpg/g, '.webp')}`;
      }
    }
    return {
      id,
      key,
      text: renderToString(text),
      category: 'Touren in der Nähe',
      title,
      url: `/tracks/${slug}`,
      urlType: 'internal',
      img: previewImage,
      imgClassName: 'w-full object-cover object-center'
    };
  });

const getImageItems = (data, images = []) => data
  .filter(item => {
    const existingImages = images.filter(image => image.title === item.name);
    return item.type === 'image' && existingImages.length === 0
  })
  .map(imageItem => {
    const { _id: id, foreignKey: key, meta } = imageItem;
    const { url: img } = meta;
    return {
      id,
      key,
      img,
      imgClassName: 'w-full object-cover object-center'
    };
  }); 

const Features = ({ type, data, tracks, images }) => {
  switch (type) {
    case 'image':
      const imageItems = getImageItems(data, images);
      return imageItems.length > 0 ? (
        <TeaserSlider items={imageItems} />
      ) : null
    case 'track':
      const trackItems = getTrackItems(data, tracks);
      return trackItems.length > 0 ? (
        <TeaserSlider items={trackItems} />
      ) : null
    case 'map':
      const mapItems = getMapItems(data);
      return mapItems.length > 0 ? (
        <TeaserSlider items={mapItems} />
      ) : null
    case 'book':
      const bookItems = getBookItems(data);
      return bookItems.length > 0 ? (
        <TeaserSlider items={bookItems} />
      ) : null
    default:
      return (
        <></>
      )  
  }
}

export default Features
