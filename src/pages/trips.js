import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Teaser from "../views/teaser"

const TripsPage = ({ data: { trips } }) => {
  return (
    <Layout>
      <Seo title="Trips" />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap -m-4">
            {trips.nodes.map(trip => {
              const { id, name, tracks, gatsbyPath } = trip
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
    trips: allGraphCmsTrip(sort: { fields: name, order: ASC }) {
      nodes {
        id
        gatsbyPath(filePath: "/trips/{graphCmsTrip.name}")
        name
        tracks {
          id
        }
      }
    }
  }
`

export default TripsPage
