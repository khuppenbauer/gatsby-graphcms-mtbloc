import React from "react"
import ReactMarkdown from "react-markdown"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Headline from "../../views/headline"

const MetaPage = ({ data: { page } }) => {
  const { title, content } = page
  return (
    <Layout>
      <Seo title={title} />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-12 mx-auto">
          <Headline title={title} />
          <div className="flex flex-wrap w-full mb-20">
            <ReactMarkdown className="leading-relaxed text-base">
              {content.markdown}
            </ReactMarkdown>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const pageQuery = graphql`
  query PagePageQuery($slug: String!) {
    page: graphCmsPage(slug: { eq: $slug }) {
      title
      content {
        markdown
      }
    }
  }
`

export default MetaPage
