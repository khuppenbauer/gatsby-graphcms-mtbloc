import React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Tracks from "../../components/tracks"

const RegionPage = ({ data: { region } }) => {
  const { name, description, tracks } = region
  return (
    <Layout>
      <Seo title={name} />
      <Tracks section={{url: "/regions", label: "Regionen"}} name={name} description={description} tracks={tracks} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query RegionPageQuery($name: String!) {
    region: graphCmsRegion(name: { eq: $name }) {
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

export default RegionPage
