import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Search from "../components/search"

const IndexPage = () => {
  return (
    <Layout>
      <Seo title="Home" />
      <Search />
    </Layout>
  )
}

export default IndexPage
