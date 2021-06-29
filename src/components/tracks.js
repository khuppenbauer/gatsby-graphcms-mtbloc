import React from "react"
import { Link } from "gatsby"
import {
  ArrowSmUpIcon,
  ArrowSmDownIcon,
  ArrowSmRightIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/outline"
import convert from "convert-units"

const Tracks = ({ name, description, section, tracks }) => (
  <section className="text-gray-400 bg-gray-900 body-font">
    <div className="container px-5 py-24 mx-auto">
      { name || description ? (
      <div className="flex flex-wrap w-full mb-20">
        <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-white">
          <Link to={section.url} style={{ color: `white`, textDecoration: `none` }}>
            {section.label}
          </Link> / {name}</h1>
          <div className="h-1 w-20 bg-blue-500 rounded"></div>
        </div>
        <p className="lg:w-1/2 w-full leading-relaxed text-gray-400 text-opacity-90">{description}</p>
      </div>
      ) : null
      }
      <div className="flex flex-wrap -m-4">
        {tracks.map(track => {
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
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src={staticImageUrl}
                    alt={name}
                    width="320"
                    height="240"
                  />
                  <div className="p-6">
                    <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1 uppercase">
                      {startCountry}
                    </h2>
                    <h1 className="title-font text-lg font-medium text-white mb-3">
                      {name}
                    </h1>
                    <div className="my-4">
                      <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                        <PlayIcon className="h-6 w-6" />
                        {startCity} ({startState})
                      </span>
                      <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                        <StopIcon className="h-6 w-6" />
                        {endCity} ({endState})
                      </span>
                    </div>
                    <div className="flex items-center flex-wrap ">
                      <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                        <ArrowSmRightIcon className="h-6 w-6" />
                        {number} {unit}
                      </span>
                      <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                        <ArrowSmUpIcon className="h-6 w-6" />
                        {totalElevationGain} m
                      </span>
                      <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
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
);

export default Tracks
