require("dotenv").config()

module.exports = {
  flags: { PRESERVE_WEBPACK_CACHE: true, PRESERVE_FILE_DOWNLOAD_CACHE: true },
  siteMetadata: {
    title: `MTB Loc`,
    description: `MTB Loc Prototype`,
    author: `Kerstin Huppenbauer`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-source-graphcms",
      options: {
        endpoint: process.env.GRAPHCMS_ENDPOINT,
        token: process.env.GRAPHCMS_TOKEN,
        locales: ["de"],
        stages: ["PUBLISHED"],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `MTB Loc`,
        short_name: `MTB Loc`,
        start_url: `/`,
        background_color: `#111827`,
        theme_color: `#111827`,
        display: `minimal-ui`,
        icon: `src/images/logo.svg`,
      },
    },
    {
      resolve: "gatsby-plugin-sentry",
      options: {
        dsn: process.env.SENTRY_DSN,
      },
    },
    `gatsby-plugin-offline`,
  ],
}
