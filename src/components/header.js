import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const Header = ({ siteTitle }) => (
  <header class="text-gray-400 bg-gray-900 body-font">
    <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
      <span class="flex title-font font-medium items-center text-white mb-4 md:mb-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="w-10 h-10 text-white p-2 bg-blue-500 rounded-full"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        <span class="ml-3 text-xl">
          <Link to="/" style={{ color: `white`, textDecoration: `none` }}>
            {siteTitle}
          </Link>
        </span>
      </span>
      <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
        <span class="mr-5 hover:text-white">First Link</span>
        <span class="mr-5 hover:text-white">Second Link</span>
        <span class="mr-5 hover:text-white">Third Link</span>
        <span class="mr-5 hover:text-white">Fourth Link</span>
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
