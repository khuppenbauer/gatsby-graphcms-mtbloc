import React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Headline from "../../views/headline"

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
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-12 mx-auto">
          <Headline title={name} />
          <div className="flex flex-wrap w-full mb-20">
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
          </div>
        </div>  
      </section>
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
