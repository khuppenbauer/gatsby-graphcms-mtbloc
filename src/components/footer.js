import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const Footer = ({ siteTitle, metaPages }) => (
  <footer className="text-gray-400 bg-gray-900 body-font">
    <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
      <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
        <Link
          to="/"
          className="flex title-font font-medium items-center md:justify-start justify-center text-white"
          style={{ color: `white`, textDecoration: `none` }}
        >
          <svg
            className="h-12 w-12 text-white"
            viewBox="0 0 182 167.5"
            x="0px"
            y="0px"
            fillRule="evenodd"
            clipRule="evenodd"
            fill="white"
          >
            <path d="M66 75c50,6 116,16 116,25 0,7 -28,12 -109,14 -32,0 -49,4 -57,8 -8,6 10,11 14,12l-19 0c-30,-24 57,-28 62,-28 75,-2 92,-4 92,-6 0,-6 -134,-25 -165,-25l20 -12 4 7 8 -15 18 -12 14 10 17 -29 14 18 18 -25 54 58 -101 0z" />
            <path d="M24 0c13,0 23,11 23,24 0,7 -4,14 -10,18l-13 24 -14 -24c-6,-4 -10,-11 -10,-18 0,-13 11,-24 24,-24zm0 8c8,0 15,7 15,16 0,8 -7,15 -15,15 -9,0 -16,-7 -16,-15 0,-9 7,-16 16,-16z" />
          </svg>
          <span className="ml-3 text-xl">{siteTitle}</span>
        </Link>
        <p className="mt-2 text-sm text-gray-500">...</p>
      </div>
      <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
          <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
            Seiten
          </h2>
          <nav className="list-none mb-10">
            <li>
              <Link to="/tracks" className="text-gray-400 hover:text-white">
                Touren
              </Link>
            </li>
            <li>
              <Link to="/trips" className="text-gray-400 hover:text-white">
                Trips
              </Link>
            </li>
            <li>
              <Link to="/regions" className="text-gray-400 hover:text-white">
                Regionen
              </Link>
            </li>
          </nav>
        </div>
        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
          <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
            Meta
          </h2>
          <nav className="list-none mb-10">
            {metaPages.map(page => {
              const { id, slug, title } = page
              return (
                <li key={id}>
                  <Link
                    to={`/meta/${slug}`}
                    className="text-gray-400 hover:text-white"
                  >
                    {title}
                  </Link>
                </li>
              )
            })}
            <li>
              <Link
                to="/meta/contact"
                className="text-gray-400 hover:text-white"
              >
                Kontakt
              </Link>
            </li>
          </nav>
        </div>
      </div>
    </div>
    <div className="bg-gray-800 bg-opacity-75">
      <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
        <p className="text-gray-400 text-sm text-center sm:text-left">
          © 2021 MTB Loc — Kerstin Huppenbauer
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
          <a
            className="text-gray-400"
            href="https://www.facebook.com/kerstin.huppenbauer"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            className="ml-3 text-gray-400"
            href="https://www.twitter.com/khuppenbauer"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          </a>
          <a
            className="ml-3 text-gray-400"
            href="https://www.github.com/khuppenbauer"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </span>
      </div>
    </div>
  </footer>
)

Footer.propTypes = {
  siteTitle: PropTypes.string,
  metaPages: PropTypes.array,
}

Footer.defaultProps = {
  siteTitle: ``,
  metaPages: [],
}

export default Footer
