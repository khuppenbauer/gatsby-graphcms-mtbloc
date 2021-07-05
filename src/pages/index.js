import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Teaser from "../views/teaser"

const IndexPage = () => {
  return (
    <Layout>
      <Seo title="Home" />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap -m-4">
            <Teaser key="tracks" slug="tracks" title="Touren" />
            <Teaser key="trips" slug="trips" title="Trips" />
            <Teaser key="regions" slug="regions" title="Regionen" />
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage
