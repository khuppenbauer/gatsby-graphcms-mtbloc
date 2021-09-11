import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/section"
import Mapbox from "../components/mapbox/collection"
import Headline from "../views/headline"
import Tracks from "../views/tracks"

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

export default class CollectionsList extends React.Component {
  render() {
    const { pageContext } = this.props
    const { name, description, tracks, geoJson, minCoords, maxCoords, staticImage } = pageContext;
    const staticImageUrl = `${assetBaseUrl}/${staticImage.handle}`;
    return (
      <Layout>
        <Seo title={name} image={staticImageUrl} />
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
