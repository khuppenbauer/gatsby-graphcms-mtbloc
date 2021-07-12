import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/section"
import Teaser from "../views/teaser"

const RegionsPage = ({ data: { regions } }) => {
  return (
    <Layout>
      <Seo title="Regionen" />
      <Section>
        <div className="flex flex-wrap -m-4">
          {regions.nodes.map(region => {
            const { id, name, tracks, gatsbyPath } = region
            return tracks.length > 0 ? (
              <Teaser key={id} slug={gatsbyPath} title={name} />
            ) : null
          })}
        </div>
      </Section>
    </Layout>
  )
}

export const pageQuery = graphql`
  {
    regions: allGraphCmsRegion(sort: { fields: name, order: ASC }) {
      nodes {
        id
        gatsbyPath(filePath: "/regions/{graphCmsRegion.name}")
        name
        tracks {
          id
        }
      }
    }
  }
`

export default RegionsPage
