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
            id
            name
            description {
              markdown
              html
            }
            collectionType {
              name
              slug
              mapLayer
              teaser
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
              previewImageUrl
              overviewImageUrl
              totalElevationGain
              totalElevationLoss
              difficulty
              fitness
              experience
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
            subCollections {
              id
              name
              tracks {
                id
              }
              image {
                id
                handle
              }
              staticImage {
                id
                handle
              }
              collectionType {
                id
                name
                slug
              }
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
    const { id, name, collectionType, description, tracks, geoJson, minCoords, maxCoords, staticImage, subCollections } = node;
    const slug = `${collectionType.slug}/${slugify(name)}`
    createPage({
      path: slug,
      component: path.resolve("./src/templates/collections-list.js"),
      context: { 
        id,
        name,
        description,
        tracks,
        geoJson,
        minCoords,
        maxCoords,
        staticImage,
        subCollections,
        mapLayer: collectionType.mapLayer,
        teaser: collectionType.teaser,
      },
    })
  })
}
