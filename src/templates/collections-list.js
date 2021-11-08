import * as React from "react"
import slugify from '@sindresorhus/slugify';

import Layout from "../components/layout"
import Seo from "../components/seo"
import Features from "../components/features"
import Mapbox from "../components/mapbox/collection"
import Headline from "../views/headline"
import Tracks from "../views/tracks"
import Teaser from "../views/teaser"

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

export default class CollectionsList extends React.Component {
  render() {
    const { pageContext } = this.props
    const { name, description, tracks, geoJson, minCoords, maxCoords, staticImage, subCollections } = pageContext;
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
                    <Mapbox data={geoJson} minCoords={minCoords} maxCoords={maxCoords} />
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
              <Features 
                minCoords={minCoords}
                maxCoords={maxCoords}
                name={name}
                photos={[]}
                types={['map', 'image']}
              />
          </div>
          </div>
        </section>
      </Layout>
    )
  }
}
