import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/section"
import Tracks from "../views/tracks"
import Pagination from "../views/pagination"

export default class TracksList extends React.Component {
  render() {
    const { data, pageContext } = this.props
    const { tracks } = data
    const { currentPage, limit, numPages, numTracks, skip } = pageContext
    return (
      <Layout>
        <Seo title="Tracks" />
        <Section>
          <Tracks name="Alle Touren" tracks={tracks.nodes} />
        </Section>
        <Pagination
          limit={limit}
          skip={skip}
          currentPage={currentPage}
          numPages={numPages}
          numItems={numTracks}
        />
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query(
    $skip: Int!
    $limit: Int!
    $order: [SortOrderEnum]
    $sort: [GraphCMS_TrackFieldsEnum]
  ) {
    tracks: allGraphCmsTrack(
      filter: { private: { ne: true }},
      sort: { fields: $sort, order: $order }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        id
        gatsbyPath(filePath: "/tracks/{graphCmsTrack.slug}")
        distance
        endCity
        endCountry
        endState
        title
        slug
        startCity
        startCountry
        startState
        previewImageUrl
        overviewImageUrl
        totalElevationGain
        totalElevationLoss
      }
    }
  }
`
