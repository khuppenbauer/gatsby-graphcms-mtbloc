import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/section"
import Teaser from "../views/teaser"

const IndexPage = ({ data: { collectionTypes } }) => {
  return (
    <Layout>
      <Seo title="Home" />
      <Section>
        <div className="flex flex-wrap -m-4">
          <Teaser key="tracks" slug="tracks" title="Touren" />
          {collectionTypes.nodes.map(collectionType => {
            const { id, name, slug, collections } = collectionType;
            return collections.length > 0 ? (
              <Teaser key={id} slug={slug} title={name} />
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
      }
    }
  }
`

export default IndexPage
