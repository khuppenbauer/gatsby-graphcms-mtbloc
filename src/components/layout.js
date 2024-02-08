/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import Footer from "./footer"
import "./layout.css"

const umami = process.env.GATSBY_UMAMI_SITE_ID;
const umamiSrc = process.env.GATSBY_UMAMI_SITE_SRC;

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
      allGraphCmsPage {
        nodes {
          id
          slug
          title
        }
      }
      allGraphCmsCollectionType(sort: {order: ASC, fields: name}) {
        nodes {
          id
          name
          slug
          collections {
            id
          }
        }
      }
    }
  `)

  return (
    <>
      <Helmet>
        {process.env.NODE_ENV === 'production' && umami && (
          <script
            key="umami-script"
            async
            defer
            data-website-id={`${umami}`}
            src={`${umamiSrc}`}
          />
        )}
      </Helmet>
      <Header siteTitle={data.site.siteMetadata?.title} />
      <main>{children}</main>
      <Footer
        siteTitle={data.site.siteMetadata?.title}
        metaPages={data.allGraphCmsPage.nodes}
        collectionTypes={data.allGraphCmsCollectionType.nodes} 
      />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
