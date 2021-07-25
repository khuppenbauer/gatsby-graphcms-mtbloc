import * as React from "react"
import { graphql } from "gatsby"
import getBounds from 'geolib/es/getBounds';
import getCenterOfBounds from 'geolib/es/getCenterOfBounds';

import Layout from "../components/layout"
import Seo from "../components/seo"
import Section from "../components/section"
import Teaser from "../views/teaser"
import Headline from "../views/headline"

const mapboxToken = process.env.GATSBY_MAPBOX_ACCESS_TOKEN
const mapboxBaseUrl = 'https://api.mapbox.com/styles/v1/';
const mapboxStyle = 'khuppenbauer/ckrd352a31ffl18qit94pozv8';
const imageSize = '320x240';
const stroke = '#ff3300';
const strokeWidth = 2;
const fillOpacity = 0;

const createImage = (tracks) => {
  const coords = tracks.reduce((acc, track) => {
    acc.push(track.minCoords);
    acc.push(track.maxCoords);
    return acc;
  }, []);
  const bounds = getBounds(coords);
  const center = getCenterOfBounds(coords);
  const { minLat, minLng, maxLat, maxLng } = bounds;
  const { latitude, longitude } = center;
  const geoJsonString = {
    type: 'Feature',
    properties: {
      stroke,
      'stroke-width': strokeWidth,
      'fill-opacity': fillOpacity,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [minLng, minLat],
          [maxLng, minLat],
          [maxLng, maxLat],
          [minLng, maxLat],
          [minLng, minLat]
        ]
      ]
    },
  };
  const pathParams = [
    mapboxStyle,
    'static',
    `geojson(${encodeURIComponent(JSON.stringify(geoJsonString))})`,
    `${longitude},${latitude},6`,
    imageSize,
  ];
  return `${mapboxBaseUrl}${pathParams.join('/')}?access_token=${mapboxToken}`;
}

const RegionsPage = ({ data: { countries } }) => {
  return (
    <Layout>
      <Seo title="Regionen" />
      <Section>
        {countries.nodes.map(country => {
          const { id: countryId, name, regions } = country;
          regions.sort((a, b) => (a.name > b.name && 1) || -1)
          return regions.length > 0 ? (
            <React.Fragment key={countryId}>
              <Headline title={name} />
              <div className="flex flex-wrap -m-4 mb-10">
                {regions.map(region => {
                  const { id: regionId, name, tracks, gatsbyPath } = region
                  const tracksCount = tracks.length;
                  const image = createImage(tracks);
                  return tracks.length > 0 ? (
                    <Teaser key={regionId} slug={gatsbyPath} title={`${name} (${tracksCount})`} asset={image} />
                  ) : null
                })}
              </div>
            </React.Fragment>
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
            minCoords {
              latitude
              longitude
            }
            maxCoords {
              latitude
              longitude
            }
          }
        }
      }
    }
  }
`

export default RegionsPage
