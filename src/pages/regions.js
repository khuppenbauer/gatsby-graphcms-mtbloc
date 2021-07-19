import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/section"
import Teaser from "../views/teaser"
import Headline from "../views/headline"

const RegionsPage = ({ data: { countries } }) => {
  return (
    <Layout>
      <Seo title="Regionen" />
      <Section>
        {countries.nodes.map(country => {
          const { id: countryId, name, regions } = country;
          return regions.length > 0 ? (
            <>
              <Headline key={`h-${countryId}`} title={name} />
              <div key={`c-${countryId}`} className="flex flex-wrap -m-4 mb-10">
                {regions.map(region => {
                  const { id: regionId, name, tracks, gatsbyPath } = region
                  const tracksCount = tracks.length;
                  return tracks.length > 0 ? (
                    <Teaser key={regionId} slug={gatsbyPath} title={`${name} (${tracksCount})`} />
                  ) : null
                })}
              </div>
            </>
          ) : null    
        })}
      </Section>
    </Layout>
  )
}

export const pageQuery = graphql`
  {
    countries: allGraphCmsCountry(sort: {fields: name, order: ASC}) {
      nodes {
        id
        name
        regions {
          id
          gatsbyPath(filePath: "/regions/{graphCmsRegion.name}")
          name
          tracks {
            id
          }
        }
      }
    }
  }
`

export default RegionsPage
