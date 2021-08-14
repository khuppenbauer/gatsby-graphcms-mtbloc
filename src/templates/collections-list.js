import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/section"
import Tracks from "../views/tracks"

export default class CollectionsList extends React.Component {
  render() {
    const { pageContext } = this.props
    const { name, description, tracks } = pageContext;
    return (
      <Layout>
        <Seo title={name} />
        <Section>
          <Tracks name={name} description={description} tracks={tracks} />
        </Section>
      </Layout>
    )
  }
}
