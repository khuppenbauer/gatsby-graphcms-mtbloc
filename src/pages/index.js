import * as React from "react"
import { Link, graphql } from "gatsby"

const IndexPage = ({ data: { tracks } }) => {
  return tracks.nodes.map((track) => (
    <div key={track.id}>
      <Link key={track.id} to={track.gatsbyPath}>
        {track.name}
      </Link>
      <br />
    </div>
  ));
}

export const pageQuery = graphql`
  {
    tracks: allGraphCmsTrack {
      nodes {
        id
        name
        gatsbyPath(filePath: "/{graphCmsTrack.name}")
      }
    }
  }
`;

export default IndexPage;
