import * as React from "react"
import { graphql, Link } from "gatsby"
import { Activity, ArrowUpRight, ArrowDownRight, ArrowRight } from "react-feather"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Tracks from "../views/tracks"
import Headline from "../views/headline"

const Statistic = ({data}) => {
  const statistic = data.reduce(
    (acc, { distance, totalElevationGain, totalElevationLoss }) => {
      acc.distance += distance;
      acc.totalElevationGain += totalElevationGain;
      acc.totalElevationLoss += totalElevationLoss;
      return acc;
    },
    { distance: 0, totalElevationGain: 0, totalElevationLoss: 0 }
  );
  const count = new Intl.NumberFormat("de-DE").format(data.length);
  const distance = new Intl.NumberFormat("de-DE").format(Math.round(statistic.distance / 1000));
  const totalElevationGain = new Intl.NumberFormat("de-DE").format(statistic.totalElevationGain);
  const totalElevationLoss = new Intl.NumberFormat("de-DE").format(statistic.totalElevationLoss);
  return (
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
  )
}

const IndexPage = ({ data: { tracks, trackStatistic }}) => {
  return (
    <Layout>
      <Seo title="Home" />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div class="lg:w-4/5 mx-auto flex flex-wrap">
            <img alt="ecommerce" class="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="https://media.graphcms.com/0faI5rNFTBaR2JdvNAML" />
            <div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 class="text-sm title-font text-gray-500 tracking-widest">MapSeven</h2>
              <h1 class="text-white text-2xl title-font font-medium mb-1">Was ist das?</h1>
              <p class="leading-relaxed">
                Vor über 10 Jahren habe ich meine erste "Mountainbike-Tour" mit dem Smartphone aufgezeichnet.<br />
                Inzwischen sind es über 1000 Touren, Zeit für eine kleine Website, um die Highlights wieder zu finden.<br />
                ... und ihr könnt bei der Entwicklung live dabei sein.<br />
                Denn das hier ist der Anfang, es warten noch viele Ideen auf die Umsetzung.<br /><br />
                Daneben ist diese Seite auch mein "Entwicklerspielplatz", bei dem ich - für mich - neue Technologien und Komponenten ausprobiere.<br />
                Dazu wird es auch mal einen Blog geben, in dem ich etwas Einblick in die Technik hinter dieser Website geben möchte.<br /><br />
                Und nun, viel Spaß beim stöbern.
              </p>
            </div>
          </div>
        </div>
        <div className="container px-5 pt-12 mx-auto">
          <div className="flex flex-wrap -m-4">
            <div className="p-4 md:w-1/2 w-full">
              <Link to={`/search`}>
                <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
                  <img className="w-full object-cover object-center" src="https://media.graphcms.com/kVt3w53XSKmJlKR8z3TB" alt="search" width="640" height="426" />
                  <div className="p-6">
                    <h1 className="title-font text-lg font-medium text-white mb-3">
                      Suche
                    </h1>
                    <p className="leading-relaxed">
                      Die Suche liefert einen Überblick über alle Touren.<br />
                      Durch die Umkreissuche und/oder zusätzliche Filter läßt sich das Ergebnis weiter einschränken.<br />
                      Außerdem kann das Ergebnis nach unterschiedlichen Kriterien sortiert werden. 
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="p-4 md:w-1/2 w-full">
              <Link to={`/collections`}>
                <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
                  <img className="w-full object-cover object-center" src="https://media.graphcms.com/N0RNaxHPSYWcgHACTUY0" alt="search" width="640" height="426" />
                  <div className="p-6">
                    <h1 className="title-font text-lg font-medium text-white mb-3">
                      Sammlungen
                    </h1>
                    <p className="leading-relaxed">
                      In den Sammlungen finden sich manuell zusammengestellte Touren nach unterschiedlichen Kategorien.<br />
                      Hier lassen sich z.B. Mehrtagestouren oder Touren in bestimmten Regionen finden. 
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="container px-5 py-12 mx-auto">
          <Headline title="Statistik" />
          <Statistic data={trackStatistic.nodes} />
        </div>
        <div className="container px-5 pt-12 mx-auto">
          <Tracks tracks={tracks.nodes} name="Letzte Touren" />
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
