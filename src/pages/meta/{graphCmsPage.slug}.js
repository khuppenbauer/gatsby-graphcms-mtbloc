import React from "react"
import ReactMarkdown from "react-markdown"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"

const MetaPage = ({ data: { page } }) => {
  const { title, content } = page
  return (
    <Layout>
      <Seo title={title} />
      <section className="text-gray-400 body-font bg-gray-900">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap w-full mb-10">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-white">
                {title}
              </h1>
              <div className="h-1 w-20 bg-blue-500 rounded"></div>
            </div>
          </div>
          <div className="flex flex-wrap flex flex-wrap w-full mb-20">
            <p className="leading-relaxed text-base">
              <ReactMarkdown>{content.markdown}</ReactMarkdown>
            </p>
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
