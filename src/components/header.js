import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const Header = ({ siteTitle }) => (
  <header className="text-gray-400 bg-gray-900 body-font">
    <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
      <span className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
        <svg
          className="h-12 w-12 text-white"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <circle cx="5" cy="18" r="3" />
          <circle cx="19" cy="18" r="3" />
          <polyline points="12 19 12 15 9 12 14 8 16 11 19 11" />
          <circle cx="17" cy="5" r="1" />
        </svg>
        <span className="ml-3 text-xl">
          <Link to="/" style={{ color: `white`, textDecoration: `none` }}>
            {siteTitle}
          </Link>
        </span>
      </span>
      <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
        <span className="mr-5 hover:text-white">
          <Link to="/tracks" style={{ color: `white`, textDecoration: `none` }}>
            Touren
          </Link>
        </span>
        <span className="mr-5 hover:text-white">
          <Link
            to="/regions"
            style={{ color: `white`, textDecoration: `none` }}
          >
            Regionen
          </Link>
        </span>
        <span className="mr-5 hover:text-white">
          <Link to="/trips" style={{ color: `white`, textDecoration: `none` }}>
            Trips
          </Link>
        </span>
      </nav>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
