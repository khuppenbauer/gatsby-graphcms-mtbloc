import * as React from "react"
import { graphql } from "gatsby"
import slugify from '@sindresorhus/slugify';
import { Tab } from '@headlessui/react'
import { Grid, Map, Menu } from 'react-feather';

import Layout from "../components/layout"
import Seo from "../components/seo"
import Mapbox from "../components/mapbox/collection"
import Section from "../components/section"
import Teaser from "../views/teaser"
import Header from "../views/header"
import Headline from "../views/headline"
import { getCollectionsGeoJson } from "../helpers/geoJson"

const buttonClass = 'relative inline-flex items-center px-2 py-2 border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800';

const MapboxComponent = ({ collectionType }) => {
  const { geoJson, minCoords, maxCoords } = getCollectionsGeoJson(collectionType);
  return (
    <Mapbox
      data={geoJson}
      minCoords={minCoords}
      maxCoords={maxCoords}
      subCollections={true}
      width="100%"
      height="50vH"
    />
  )
}

const CollectionTypePage = ({ data: { collectionType }}) => {
  const { name, slug, collections } = collectionType;
  const res = [];
  let tracksCount = 0;

  collections.map(collection => {
    const { tracks } = collection;
    if (collection.private === true) {
      return null;
    }
    if (tracks.length === 0) {
      return null;
    }
    tracksCount += tracks.length;
    if (collections.length > 10) {
      tracks.map(track => {
        const { startCountry, endCountry } = track;
        if (!res[startCountry]) {
          res[startCountry] = [];
        }
        if (!res[endCountry]) {
          res[endCountry] = [];
        }
        if (!res[startCountry].includes(collection)) {
          res[startCountry].push(collection);
        }
        if (!res[endCountry].includes(collection)) {
          res[endCountry].push(collection);
        }
        return null;
      })
    }
    return null;
  });

  const items = [];
  Object.keys(res).forEach(function(key) {
    items.push({
      name: key,
      collections: res[key].sort((a, b) => (a.name > b.name && 1) || -1)
    });
  }, res)
  items.sort((a, b) => (a.name > b.name && 1) || -1)

  return (
    <Layout>
      <Seo title={name} />
      <Section>
        <Header title={name} />
        {tracksCount > 0 ? (
          <Tab.Group>
            <div className="flex justify-end">
              <Tab.List>
                <Tab
                  className={({ selected }) =>
                    selected ? `bg-gray-800 ${buttonClass}` : `border ${buttonClass}`
                  }
                >
                  <Grid className="h-5 w-5" />
                </Tab>                        
                <Tab
                  className={({ selected }) =>
                    selected ? `bg-gray-800 ${buttonClass}` : `border ${buttonClass}`
                  }
                >
                  <Map className="h-5 w-5" />
                </Tab>
              </Tab.List>
            </div>
            <Tab.Panels>
              <Tab.Panel>
                {items.length > 0 ? (
                  items.map(item => {
                    const { name: country, collections } = item;
                    return collections.length > 0 ? (
                      <React.Fragment key={country}>
                        <Headline title={country} />
                        <div className="flex flex-wrap -m-4 mb-10">
                          {collections.map(collection => {
                            const { id, name, slug: collectionSlug, tracks, image, staticImage } = collection
                            const tracksCount = tracks.length;
                            return tracksCount > 0 ? (
                              <Teaser key={id} id={country} slug={`/${slug}/${collectionSlug ? collectionSlug : slugify(name)}`} title={`${name} (${tracksCount})`} image={image} staticImage={staticImage} />
                            ) : null
                          })}
                        </div>
                      </React.Fragment>
                    ) : null 
                  })
                ) : (
                  <div className="flex flex-wrap -m-4 mb-10">
                    <>
                      {collections.map(collection => {
                        const { id, name, slug: collectionSlug, image, staticImage } = collection
                        return (
                          <Teaser key={id} id={id} slug={`/${slug}/${collectionSlug ? collectionSlug : slugify(name)}`} title={`${name}`} image={image} staticImage={staticImage} />
                        )
                      })}
                    </>
                  </div>
                )}
              </Tab.Panel>
              <Tab.Panel>
                <MapboxComponent collectionType={collectionType} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        ) : (
          <div className="flex flex-wrap -m-4 mb-10">
            {collections.map(collection => {
              const { id, name, slug: collectionSlug, image, staticImage } = collection
              return (
                <Teaser key={id} id={id} slug={`/${slug}/${collectionSlug ? collectionSlug : slugify(name)}`} title={`${name}`} image={image} staticImage={staticImage} />
              )
            })}
          </div>
        )}
      </Section>
    </Layout>
  )
}

export const pageQuery = graphql`
  query CollectionTypePageQuery($slug: String!) {
    collectionType: graphCmsCollectionType(slug: {eq: $slug }) {
      name
      slug
      collections {
        id
        name
        slug
        private
        tracks {
          id
          startCountry
          endCountry
        }
        image {
          id
          handle
        }
        staticImage {
          id
          handle
        }
        minCoords {
          latitude
          longitude
        }
        maxCoords {
          latitude
          longitude
        }
      }
    }
  }
`

export default CollectionTypePage
