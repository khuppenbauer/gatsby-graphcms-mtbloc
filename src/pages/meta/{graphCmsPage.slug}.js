import React from "react"
import ReactMarkdown from "react-markdown"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Section from "../../components/section"
import Headline from "../../views/headline"
import Form from "../../views/form"

const MetaPage = ({ data: { page } }) => {
  const { title, content, form } = page
  return (
    <Layout>
      <Seo title={title} />
      <Section>
        <Headline title={title} />
        <div className="flex flex-wrap w-full mb-10">
          <ReactMarkdown className="leading-relaxed text-base">
            {content.markdown}
          </ReactMarkdown>
        </div>
        {form ? <Form form={form} /> : null}
      </Section>
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
      form {
        id
        name
        remoteFields {
          ... on GraphCMS_FormButton {
            id
            name
            label
            remoteTypeName
          }
          ... on GraphCMS_FormCheckbox {
            id
            name
            label
            required
            error
            remoteTypeName
          }
          ... on GraphCMS_FormInput {
            id
            name
            label
            placeholder
            required
            error
            type
            remoteTypeName
          }
          ... on GraphCMS_FormTextarea {
            id
            name
            required
            error
            placeholder
            label
            remoteTypeName
          }
        }
        successText {
          markdown
        }
      }
    }
  }
`

export default MetaPage
