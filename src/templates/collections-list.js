import * as React from "react"
import slugify from '@sindresorhus/slugify';
import { QueryClient, QueryClientProvider } from "react-query";


import Layout from "../components/layout"
import Seo from "../components/seo"
import Mapbox from "../components/mapbox/collection"
import Headline from "../views/headline"
import Tracks from "../views/tracks"
import Teaser from "../views/teaser"
import Features from "../views/features"
import useFeatures from "../hooks/useFeatures"

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL
const queryClient = new QueryClient();

const FeatureTeaser = ({ 
  id, types, minCoords, maxCoords, tracks, teaser,
}) => {
  const res = useFeatures(id, minCoords, maxCoords, types);
  const isLoading = res.some(res => res.isLoading)
  if (!isLoading) {
    return res.map((item) => {
      const { data } = item;
      if (data.length > 0) {
        const { type } = data[0];
        if (teaser.includes(type)) {
          return (
            <Features key={type} type={type} data={data} tracks={tracks} />
          )
        } else {
          return null;
        }
      } else {
        return null;
      }
    });
  } else {
    return null;
  }
};

const FeatureMap = ({ 
  id, types, minCoords, maxCoords, mapLayer, geoJson, 
}) => {
  const res = useFeatures(id, minCoords, maxCoords, types);
  const isLoading = res.some(res => res.isLoading)
  if (!isLoading) {
    res.forEach((item) => {
      const { data } = item;
      if (data.length > 0) {
        const { type } = data[0];
        if (mapLayer.includes(type)) {
          const features = data.map((item) => {
            const { geoJson } = item;
            geoJson.features[0].properties.type = type;
            return geoJson.features[0];
          });
          if (geoJson && features.length > 0) {
            geoJson.features.push(...features);
          }
        }
      }
    });
    return (
      <Mapbox
        data={geoJson}
        minCoords={minCoords}
        maxCoords={maxCoords}
      />
    );
  } else {
    return null;
  }
};

const CollectionsListTemplate = (props) => {
  const { pageContext } = props
  const { 
    id, name, description, tracks, geoJson, minCoords, maxCoords, 
    staticImage, subCollections, mapLayer, teaser, 
  } = pageContext;
  geoJson.features.map((geoJsonFeature) => {
    const { geometry, properties } = geoJsonFeature;
    const { type, coordinates } = geometry;
    if (type === 'LineString') {
      const index = Math.round(coordinates.length / 2);
      const trackPoint = {
        type: "Point",
        coordinates: coordinates[index],
      };
      const trackPointFeature = {
        type: 'Feature',
        properties: {
          ...properties,
          type: 'trackPoint',
        },
        geometry: trackPoint,
      };
      geoJson.features.push(trackPointFeature);
    }
    return geoJsonFeature;
  });
  const features = [...new Set([...teaser, ...mapLayer])];
  const staticImageUrl = staticImage ? `${assetBaseUrl}/${staticImage.handle}` : '';
  return (
    <Layout>
      <Seo title={name} image={staticImageUrl} />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container lg:flex lg:flex-wrap px-5 py-5 mx-auto">
          <div className="lg:w-2/3 lg:pr-6 lg:border-r lg:border-b-0 lg:mb-0 mb-10 pb-10 border-b border-gray-800">
            {geoJson && minCoords && maxCoords ? (
              <>
                <Headline title={name} description={description} />
                <div className="mb-10 w-full">
                  <QueryClientProvider client={queryClient}>
                    <FeatureMap
                      id={id}
                      types={features}
                      minCoords={minCoords}
                      maxCoords={maxCoords}
                      mapLayer={mapLayer}
                      geoJson={geoJson}
                    />
                  </QueryClientProvider>
                </div>
                {tracks.length > 0 ? (
                  <Tracks name="Touren" tracks={tracks} className="p-4 lg:w-1/2" />
                ) : (
                  subCollections.length > 0 ? (
                    <>
                      <Headline title="Sammlungen" />
                      <div className="flex flex-wrap -m-4 mb-10">
                        {subCollections.map(collectionItem => {
                          const { 
                            id: collectionId, 
                            name: collectionName, 
                            staticImage,
                            image,
                            tracks,
                            collectionType,
                          } = collectionItem;
                          const { slug } = collectionType;
                          const tracksCount = tracks.length;
                          return <Teaser key={collectionId} id={collectionName} slug={`/${slug}/${slugify(collectionName)}`} title={`${collectionName} (${tracksCount})`} image={image} staticImage={staticImage} className="p-4 md:w-1/2 w-full" />
                        })}
                      </div>
                    </>
                  ) : null
                )}
              </>
            ) :
              <Tracks name={name} description={description} tracks={tracks} className="p-4 lg:w-1/2" />
            }
          </div>
          <div className="lg:flex lg:flex-col lg:w-1/3 lg:pl-6">
            <QueryClientProvider client={queryClient}>
              <FeatureTeaser
                id={id}
                types={features}
                minCoords={minCoords}
                maxCoords={maxCoords}
                tracks={tracks}
                teaser={teaser}
              />
            </QueryClientProvider>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default CollectionsListTemplate;
