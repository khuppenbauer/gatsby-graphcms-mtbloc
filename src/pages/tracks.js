import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Tracks from "../components/tracks"

const TracksPage = ({ data: { tracks } }) => {
  return (
    <Layout>
      <Seo title="Tracks" />
      <Tracks tracks={tracks.nodes} />
    </Layout>
  )
}

export const pageQuery = graphql`
  {
    tracks: allGraphCmsTrack(sort: { fields: date, order: DESC }, limit: 15) {
      nodes {
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

export default TracksPage
