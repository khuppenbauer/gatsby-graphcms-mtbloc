import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/section"
import Mapbox from "../components/mapbox/collection"
import Headline from "../views/headline"
import Tracks from "../views/tracks"

export default class CollectionsList extends React.Component {
  render() {
    const { pageContext } = this.props
    const { name, description, tracks, geoJson, minCoords, maxCoords } = pageContext;
    return (
      <Layout>
        <Seo title={name} />
        <Section>
          { geoJson && minCoords && maxCoords ? (
            <>
              <Headline title={name} description={description} />
              <div className="mb-10 w-full">
                <Mapbox data={geoJson} minCoords={minCoords} maxCoords={maxCoords} />
              </div>
              <Tracks name="Touren" tracks={tracks} />
            </>
          ) :
            <Tracks name={name} description={description} tracks={tracks} />
          }
        </Section>
      </Layout>
    )
  }
}
