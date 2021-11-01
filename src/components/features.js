import React from "react";
import axios from "axios";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import slugify from "@sindresorhus/slugify";
import convert from "convert-units"
import { ArrowUpCircle, ArrowDownCircle, ArrowRightCircle } from "react-feather"
import { renderToString } from 'react-dom/server';

import TeaserSlider from "../views/teaserSlider";

const queryClient = new QueryClient();

const getMapItems = (data) => {
  return (
    data
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
  })
  )};

const getTrackItems = (data, name) => data
  .filter(item => item.type === 'track' && item.name !== name)
  .map(trackItem => {
    const { _id: id, foreignKey: key, name: trackName, meta } = trackItem;
    const { previewImageUrl: img } = meta;
    const distance = convert(meta.distance).from("m").toBest()
    const number = new Intl.NumberFormat("de-DE").format(distance.val.toFixed(2))
    const unit = distance.unit
    const totalElevationGain = new Intl.NumberFormat("de-DE").format(
      meta.totalElevationGain.toFixed(2)
    )
    const totalElevationLoss = new Intl.NumberFormat("de-DE").format(
      meta.totalElevationLoss.toFixed(2)
    )
    const text = (
      <div className="flex items-center flex-col my-4">
        <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm py-1">
          <ArrowRightCircle className="w-4 h-4 mr-1" />
          {number} {unit}
        </span>
        <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm py-1">
          <ArrowUpCircle className="w-4 h-4 mr-1" />
          {totalElevationGain} m
        </span>
        <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm py-1">
          <ArrowDownCircle className="w-4 h-4 mr-1" />
          {totalElevationLoss} m
        </span>
      </div>
    );
    return {
      id,
      key,
      text: renderToString(text),
      category: 'Touren in der Nähe',
      title: trackName,
      url: `/tracks/${slugify(trackName)}`,
      urlType: 'internal',
      img,
      imgClassName: 'w-full object-cover object-center'
    };
  });

const getImageItems = (data, photos) => data
  .filter(item => {
    const existingPhotos = photos.filter(photo => photo.fileName === item.name);
    return item.type === 'image' && existingPhotos.length === 0
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

const AdditionalFeatures = ({ minCoords, maxCoords, name, photos, types }) => {
  const { status, data } = useFeatures(minCoords, maxCoords);
  if (status === 'success') {
    const mapItems = getMapItems(data);
    const trackItems = getTrackItems(data, name);
    const imageItems = getImageItems(data, photos);
    return (
      <>    
        {mapItems.length > 0 && types.includes('map') ? (
          <TeaserSlider items={mapItems} />
        ) : null}
        {trackItems.length > 0 && types.includes('track') ? (
          <TeaserSlider items={trackItems} />
          ) : null}
        {imageItems.length > 0 && types.includes('image') ? (
          <TeaserSlider items={imageItems} />
          ) : null}
      </>
    )
  }
  return (
    <div></div>
  )
}

const useFeatures = (minCoords, maxCoords) => {
  const url = '/api/feature-geo-intersect';

  const { latitude: minLat, longitude: minLng } = minCoords;
  const { latitude: maxLat, longitude: maxLng } = maxCoords;

  const body = {
    "collection": "features",
    "query": {
      "geoJson.features.0.geometry": {
        "$geoIntersects": {
          "$geometry": {
            type: 'Polygon',
            coordinates: [
              [
                [minLng, minLat],
                [maxLng, minLat],
                [maxLng, maxLat],
                [minLng, maxLat],
                [minLng, minLat],
              ],
            ],
          }
        }
      }
    }
  };

  return useQuery('features', async () => {
    const { data } = await axios({
      url,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(body),
    });
    return data;
  });
}

const Features = ({ minCoords, maxCoords, name, photos, types }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-wrap -m-4 mb-10">
        <AdditionalFeatures 
          minCoords={minCoords}
          maxCoords={maxCoords}
          name={name}
          photos={photos}
          types={types}
        />
      </div>
    </QueryClientProvider>
  )
}

export default Features;
