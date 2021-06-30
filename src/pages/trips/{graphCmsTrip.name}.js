import React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Tracks from "../../views/tracks"

const TripPage = ({ data: { trip } }) => {
  const { name, description, tracks } = trip
  return (
    <Layout>
      <Seo title={name} />
      <Tracks
        section={{ url: "/trips", label: "Trips" }}
        name={name}
        description={description}
        tracks={tracks}
      />
    </Layout>
  )
}

export const pageQuery = graphql`
  query TripPageQuery($name: String!) {
    trip: graphCmsTrip(name: { eq: $name }) {
      name
      description
      tracks {
        id
        gatsbyPath(filePath: "/tracks/{graphCmsTrack.name}")
        distance
        endCity
        endCountry
        endState
        name
        startCity
        startCountry
        startState
        staticImageUrl
        totalElevationGain
        totalElevationLoss
      }
    }
  }
`

export default TripPage
