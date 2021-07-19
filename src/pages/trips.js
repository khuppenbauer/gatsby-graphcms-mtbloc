import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/section"
import Teaser from "../views/teaser"
import Headline from "../views/headline"

const TripsPage = ({ data: { countries } }) => {
  return (
    <Layout>
      <Seo title="Trips" />
      <Section>
        {countries.nodes.map(country => {
          const { id: countryId, name, trips } = country;
          return trips.length > 0 ? (
            <>
              <Headline key={`h-${countryId}`} title={name} />
              <div key={`c-${countryId}`} className="flex flex-wrap -m-4 mb-10">
                {trips.map(trip => {
                  console.log(trip);
                  const { id: tripId, name, tracks, gatsbyPath, image } = trip
                  const tracksCount = tracks.length;
                  return tracks.length > 0 ? (
                    <Teaser key={tripId} slug={gatsbyPath} title={`${name} (${tracksCount})`} image={image} />
                  ) : null
                })}
              </div>
            </>
          ) : null    
        })}
      </Section>
    </Layout>
  )
}

export const pageQuery = graphql`
  {
    countries: allGraphCmsCountry(sort: {fields: name, order: ASC}) {
      nodes {
        id
        name
        trips {
          id
          gatsbyPath(filePath: "/trips/{graphCmsTrip.name}")
          name
          image {
            handle
            width
            height
          }
          tracks {
            id
          }
        }
      }
    }
  }  
`

export default TripsPage
