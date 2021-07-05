import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Teaser from "../views/teaser"

const RegionsPage = ({ data: { regions } }) => {
  return (
    <Layout>
      <Seo title="Regionen" />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap -m-4">
            {regions.nodes.map(region => {
              const { id, name, tracks, gatsbyPath } = region
              return tracks.length > 0 ? (
                <Teaser key={id} slug={gatsbyPath} title={name} />
              ) : null
            })}
          </div>
        </div>
      </section>
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
