import * as React from "react"
import { graphql } from "gatsby"
import slugify from '@sindresorhus/slugify';

import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/section"
import Teaser from "../views/teaser"

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

const CollectionTypePage = ({ data: { collectionType }}) => {
  const { name, slug, collections } = collectionType;
  collections.sort((a, b) => (a.name > b.name && 1) || -1)
  return (
    <Layout>
      <Seo title={name} />
      <Section>
        <div className="flex flex-wrap -m-4 mb-10">
          {collections.map(collection => {
            const { id, name: title, tracks, images } = collection
            const tracksCount = tracks.length;
            let asset;
            if (images.length > 0) {
              asset = `${assetBaseUrl}/resize=w:320,h:240,fit:crop/auto_image/compress/${images[0].handle}`
            }
            return tracks.length > 0 ? (
              <Teaser key={id} slug={`/${slug}/${slugify(title)}`} title={`${title} (${tracksCount})`} asset={asset} />
            ) : null   
          })}
        </div>
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
        }
        images {
          handle
        }
      }
    }
  }
`

export default CollectionTypePage
