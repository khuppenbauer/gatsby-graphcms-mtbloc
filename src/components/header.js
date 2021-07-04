import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const Header = ({ siteTitle }) => (
  <header className="text-gray-400 bg-gray-900 body-font">
    <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
      <Link
        to="/"
        className="flex title-font font-medium items-center text-white mb-4 md:mb-0"
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
      <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
        <Link to="/tracks" className="mr-5 hover:text-white">
          Touren
        </Link>
        <Link to="/trips" className="mr-5 hover:text-white">
          Trips
        </Link>
        <Link to="/regions" className="mr-5 hover:text-white">
          Regionen
        </Link>
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
