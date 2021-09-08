import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/section"
import Teaser from "../views/teaser"
import Headline from "../views/headline"

const CollectionsPage = ({ data: { collectionTypes }}) => {
  return (
    <Layout>
      <Seo title="Sammlungen" />
      <Section>
        <Headline title="Sammlungen" />
        <div className="flex flex-wrap -m-4 mb-10">
          {collectionTypes.nodes.map(collectionType => {
            const { id, name, slug, collections, image } = collectionType;
            return collections.length > 0 ? (
              <Teaser key={id} slug={`/${slug}`} title={name} image={image} />
            ) : null
          })}
        </div>
      </Section>
    </Layout>
  )
}

export const pageQuery = graphql`
  {
    collectionTypes: allGraphCmsCollectionType {
      nodes {
        id
        name
        slug
        collections {
          id
        }
        image {
          handle
          id
        }
      }
    }
  }
`

export default CollectionsPage
