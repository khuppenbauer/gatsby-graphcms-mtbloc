const path = require("path")

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
}
