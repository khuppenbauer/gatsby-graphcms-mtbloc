import React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"

const TrackPage = ({ data: { track } }) => {
  const {
    name,
    startCity,
    startTime,
    totalElevationGain,
    totalElevationLoss,
    distance,
    elevHigh,
    elevLow,
  } = track
  return (
    <Layout>
      <Seo title={name} />
      <h1>{name}</h1>
      <div>
        Name: {name}
        <br />
        Start: {startCity}
        <br />
        Datum: {startTime}
        <br />
        Höhenmeter: {totalElevationGain}
        <br />
        Tiefenmeter: {totalElevationLoss}
        <br />
        Distanz: {distance}
        <br />
        Höchster Punkt: {elevHigh}
        <br />
        Tiefster Punkt: {elevLow}
        <br />
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query TrackPageQuery($name: String!) {
    track: graphCmsTrack(name: { eq: $name }) {
      name
      startCity
      startTime
      totalElevationGain
      totalElevationLoss
      distance
      elevHigh
      elevLow
    }
  }
`

export default TrackPage
