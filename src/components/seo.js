/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function Seo({ description, lang, title, image, noIndex }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
    >
      <meta name="description" content={metaDescription} />
      {image && (
        <meta property="image" content={image} />
      )}
      <meta name="og:title" content={title} />
      <meta name="og:description" content={metaDescription} />
      {image && (
        <meta property="og:image" content={image} />
      )}
      <meta name="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={site.siteMetadata?.author || ``} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {image && (
        <meta property="twitter:image" content={image} />
      )}
      {noIndex && (
        <meta name="robots" content="noindex, nofollow, noimageindex" data-no-index="true" />
      )}
    </Helmet>
  )
}

Seo.defaultProps = {
  lang: `de`,
  meta: [],
  description: ``,
  image: null,
  noIndex: false,
}

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  noIndex: PropTypes.bool,
}

export default Seo
