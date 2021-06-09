import * as React from "react"
import { Link, graphql } from "gatsby"
import {
  ArrowSmUpIcon,
  ArrowSmDownIcon,
  ArrowSmRightIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/outline"
import convert from "convert-units"

import Layout from "../components/layout"
import Seo from "../components/seo"

const IndexPage = ({ data: { tracks } }) => {
  return (
    <Layout>
      <Seo title="Home" />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            {tracks.nodes.map(track => {
              const {
                id,
                name,
                gatsbyPath,
                endCity,
                endState,
                startCity,
                startState,
                startCountry,
                staticImageUrl,
                totalElevationGain,
                totalElevationLoss,
              } = track
              const distance = convert(track.distance).from("m").toBest()
              const number = new Intl.NumberFormat("de-DE").format(
                distance.val.toFixed(2)
              )
              const unit = distance.unit
              return (
                <div key={id} className="p-4 md:w-1/3">
                  <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
                    <Link to={gatsbyPath}>
                      <img
                        class="lg:h-48 md:h-36 w-full object-cover object-center"
                        src={staticImageUrl}
                        alt={name}
                      />
                      <div class="p-6">
                        <h2 class="tracking-widest text-xs title-font font-medium text-gray-500 mb-1 uppercase">
                          {startCountry}
                        </h2>
                        <h1 class="title-font text-lg font-medium text-white mb-3">
                          {name}
                        </h1>
                        <div className="my-4">
                          <span class="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                            <PlayIcon className="h-6 w-6" />
                            {startCity} ({startState})
                          </span>
                          <span class="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                            <StopIcon className="h-6 w-6" />
                            {endCity} ({endState})
                          </span>
                        </div>
                        <div class="flex items-center flex-wrap ">
                          <span class="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                            <ArrowSmRightIcon className="h-6 w-6" />
                            {number} {unit}
                          </span>
                          <span class="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                            <ArrowSmUpIcon className="h-6 w-6" />
                            {totalElevationGain} m
                          </span>
                          <span class="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                            <ArrowSmDownIcon className="h-6 w-6" />
                            {totalElevationLoss} m
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const pageQuery = graphql`
  {
    tracks: allGraphCmsTrack(sort: { fields: date, order: DESC }, limit: 30) {
      nodes {
        id
        gatsbyPath(filePath: "/{graphCmsTrack.name}")
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

export default IndexPage
