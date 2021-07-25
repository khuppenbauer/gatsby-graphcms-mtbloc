import React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Section from "../../components/section"
import Tracks from "../../views/tracks"

const RegionPage = ({ data: { region } }) => {
  const { name, description, tracks } = region
  tracks.sort((a, b) => (a.name < b.name && 1) || -1)
  return (
    <Layout>
      <Seo title={name} />
      <Section>
        <Tracks name={name} description={description} tracks={tracks} />
      </Section>
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
