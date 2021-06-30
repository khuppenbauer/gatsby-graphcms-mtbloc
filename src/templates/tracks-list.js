import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Tracks from "../views/tracks"
import Pagination from "../views/pagination"

export default class TracksList extends React.Component {
  generateLink = data => {
    console.log(data)
  }

  render() {
    const { data, pageContext } = this.props
    const { tracks } = data
    const { currentPage, limit, numPages, numTracks, skip } = pageContext
    return (
      <Layout>
        <Seo title="Tracks" />
        <Tracks tracks={tracks.nodes} />
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
      sort: { fields: $sort, order: $order }
      limit: $limit
      skip: $skip
    ) {
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
  }
`
