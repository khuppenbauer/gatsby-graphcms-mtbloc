const path = require("path")
const slugify = require("@sindresorhus/slugify");

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const result = await graphql(
    `
      {
        allGraphCmsTrack {
          nodes {
            id
          }
        }
        allGraphCmsCollection {
          nodes {
            name
            description
            collectionType {
              name
              slug
            }
            tracks {
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
            geoJson
            minCoords {
              latitude
              longitude
            }
            maxCoords {
              latitude
              longitude
            }
            staticImage {
              handle
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const tracks = result.data.allGraphCmsTrack.nodes
  const tracksPerPage = 15
  const numPages = Math.ceil(tracks.length / tracksPerPage)
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/tracks` : `/tracks/${i + 1}`,
      component: path.resolve("./src/templates/tracks-list.js"),
      context: {
        limit: tracksPerPage,
        skip: i * tracksPerPage,
        sort: "date",
        order: "DESC",
        numPages,
        numTracks: tracks.length,
        currentPage: i + 1,
      },
    })
  })

  result.data.allGraphCmsCollection.nodes.forEach(node => {
    const { name, collectionType, description, tracks, geoJson, minCoords, maxCoords, staticImage } = node;
    const slug = `${collectionType.slug}/${slugify(name)}`
    createPage({
      path: slug,
      component: path.resolve("./src/templates/collections-list.js"),
      context: { 
        name,
        description,
        tracks,
        geoJson,
        minCoords,
        maxCoords,
        staticImage,
      },
    })
  })
}
