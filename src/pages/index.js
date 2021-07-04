import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const IndexPage = () => {
  return (
    <Layout>
      <Seo title="Home" />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-wrap -m-4">
            <div className="p-4 md:w-1/3">
              <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
                <Link to="/tracks">
                  <div className="p-6">
                    <h1 className="title-font text-lg font-medium text-white mb-3">
                      Touren
                    </h1>
                  </div>
                </Link>
              </div>
            </div>
            <div className="p-4 md:w-1/3">
              <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
                <Link to="/trips">
                  <div className="p-6">
                    <h1 className="title-font text-lg font-medium text-white mb-3">
                      Trips
                    </h1>
                  </div>
                </Link>
              </div>
            </div>
            <div className="p-4 md:w-1/3">
              <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
                <Link to="/regions">
                  <div className="p-6">
                    <h1 className="title-font text-lg font-medium text-white mb-3">
                      Regionen
                    </h1>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage
