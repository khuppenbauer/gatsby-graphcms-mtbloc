import * as React from "react"
import { graphql } from "gatsby"
import slugify from '@sindresorhus/slugify';

import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/section"
import Teaser from "../views/teaser"
import Headline from "../views/headline"

const CollectionTypePage = ({ data: { collectionType }}) => {
  const { name, slug, collections } = collectionType;
  const res = [];
  collections.map(collection => {
    const { tracks } = collection;
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
        {items.map(item => {
          const { name: country, collections } = item;
          return collections.length > 0 ? (
            <React.Fragment key={country}>
              <Headline title={country} />
              <div className="flex flex-wrap -m-4 mb-10">
                {collections.map(collection => {
                  const { id, name, tracks, image, staticImage } = collection
                  const tracksCount = tracks.length;
                  return tracksCount > 0 ? (
                    <Teaser key={id} id={country} slug={`/${slug}/${slugify(name)}`} title={`${name} (${tracksCount})`} image={image} staticImage={staticImage} />
                  ) : null
                })}
              </div>
            </React.Fragment>
          ) : null    
        })}
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
      }
    }
  }
`

export default CollectionTypePage
