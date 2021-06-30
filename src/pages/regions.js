import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

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
                <div key={id} className="p-4 md:w-1/3">
                  <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
                    <Link to={gatsbyPath}>
                      <div className="p-6">
                        <h1 className="title-font text-lg font-medium text-white mb-3">
                          {name}
                        </h1>
                      </div>
                    </Link>
                  </div>
                </div>
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
