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
            collectionTypes {
              name
              slug
              mapLayer
              teaser
              colorScheme
            }
            tracks {
              id
              gatsbyPath(filePath: "/tracks/{graphCmsTrack.slug}")
              distance
              endCity
              endCountry
              endState
              name
              title
              slug
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
            private
            staticImage {
              handle
            }
            subCollections {
              id
              name
              tracks {
                id
                gatsbyPath(filePath: "/tracks/{graphCmsTrack.slug}")
                distance
                title
                slug
                startCity
                totalElevationGain
                totalElevationLoss
                difficulty
                fitness
                experience
              }
              image {
                id
                handle
              }
              staticImage {
                id
                handle
              }
              collectionTypes {
                id
                name
                slug
              }
              private
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
    const { 
      id, name, collectionTypes, description, tracks, geoJson, minCoords, maxCoords, staticImage, subCollections, private: privateCollection 
    } = node;
    collectionTypes.forEach((collectionType) => {
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
          privateCollection,
          collectionType,
        },
      })
    })
  })
}
