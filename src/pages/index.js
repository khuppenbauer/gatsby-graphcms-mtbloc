import * as React from "react"
import { graphql } from "gatsby"
import { Activity, ArrowUpRight, ArrowDownRight, ArrowRight } from "react-feather"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Tracks from "../views/tracks"
import Headline from "../views/headline"

const IndexPage = ({ data: { tracks, trackStatistic }}) => {
  const statistic = trackStatistic.nodes.reduce(
    (acc, { distance, totalElevationGain, totalElevationLoss }) => {
      acc.distance += distance;
      acc.totalElevationGain += totalElevationGain;
      acc.totalElevationLoss += totalElevationLoss;
      return acc;
    },
    { distance: 0, totalElevationGain: 0, totalElevationLoss: 0 }
  );
  const count = new Intl.NumberFormat("de-DE").format(trackStatistic.nodes.length);
  const distance = new Intl.NumberFormat("de-DE").format(Math.round(statistic.distance / 1000));
  const totalElevationGain = new Intl.NumberFormat("de-DE").format(statistic.totalElevationGain);
  const totalElevationLoss = new Intl.NumberFormat("de-DE").format(statistic.totalElevationLoss);
  return (
    <Layout>
      <Seo title="Home" />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 pt-12 mx-auto">
          <Tracks tracks={tracks.nodes} name="Letzte Touren" />
        </div>
        <div className="container px-5 py-12 mx-auto">
          <Headline title="Statistik" />
          <div className="flex flex-wrap -m-4 text-center">
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-800 px-4 py-6 rounded-lg">
                <Activity className="text-blue-400 w-12 h-12 mb-3 inline-block" />
                <h2 className="title-font font-medium text-3xl text-white">{count}</h2>
                <p className="leading-relaxed">Touren</p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-800 px-4 py-6 rounded-lg">
                <ArrowRight className="text-blue-400 w-12 h-12 mb-3 inline-block" />
                <h2 className="title-font font-medium text-3xl text-white">{distance}</h2>
                <p className="leading-relaxed">km</p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-800 px-4 py-6 rounded-lg">
                <ArrowUpRight className="text-blue-400 w-12 h-12 mb-3 inline-block" />
                <h2 className="title-font font-medium text-3xl text-white">{totalElevationGain}</h2>
                <p className="leading-relaxed">m</p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-800 px-4 py-6 rounded-lg">
                <ArrowDownRight className="text-blue-400 w-12 h-12 mb-3 inline-block" />
                <h2 className="title-font font-medium text-3xl text-white">{totalElevationLoss}</h2>
                <p className="leading-relaxed">m</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const pageQuery = graphql`
  {
    tracks: allGraphCmsTrack(sort: { fields: date, order: DESC }, limit: 3) {
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
    trackStatistic: allGraphCmsTrack {
      nodes {
        distance,
        totalElevationGain,
        totalElevationLoss,
      }
    }
  }
`

export default IndexPage
