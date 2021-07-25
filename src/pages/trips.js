import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/section"
import Teaser from "../views/teaser"
import Headline from "../views/headline"

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

const TripsPage = ({ data: { countries } }) => {
  return (
    <Layout>
      <Seo title="Trips" />
      <Section>
        {countries.nodes.map(country => {
          const { id: countryId, name, trips } = country;
          return trips.length > 0 ? (
            <React.Fragment key={countryId}>
              <Headline title={name} />
              <div className="flex flex-wrap -m-4 mb-10">
                {trips.map(trip => {
                  const { id: tripId, name, tracks, gatsbyPath, image } = trip
                  const { handle } = image;
                  const tracksCount = tracks.length;
                  const asset = `${assetBaseUrl}/resize=w:320,h:240,fit:crop/auto_image/compress/${handle}`
                  return tracks.length > 0 ? (
                    <Teaser key={tripId} slug={gatsbyPath} title={`${name} (${tracksCount})`} asset={asset} />
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
