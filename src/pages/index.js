import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/section"
import Teaser from "../views/teaser"

const IndexPage = () => {
  return (
    <Layout>
      <Seo title="Home" />
      <Section>
        <div className="flex flex-wrap -m-4">
          <Teaser key="tracks" slug="tracks" title="Touren" />
          <Teaser key="trips" slug="trips" title="Trips" />
          <Teaser key="regions" slug="regions" title="Regionen" />
        </div>
      </Section>
    </Layout>
  )
}

export default IndexPage
