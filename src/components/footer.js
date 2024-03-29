import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { Facebook, Twitter, GitHub, Linkedin } from "react-feather"

const Footer = ({ siteTitle, metaPages, collectionTypes }) => (
  <footer className="text-gray-400 bg-gray-900 body-font border-t-2 border-gray-800">
    <div className="container px-5 py-12 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
      <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
        <Link
          to="/"
          className="flex title-font font-medium items-center md:justify-start justify-center text-white"
          style={{ color: `white`, textDecoration: `none` }}
        >
          <svg
            viewBox="32.417 26.467 125.624 129.86"
            width="60"
            height="60"
            fillRule="evenodd"
            clipRule="evenodd"
            fill="#9CA3AF"
          >
            <path
              fillRule="evenodd"
              d="M 144.103 50.089 C 144.933 51.135 145.725 52.202 146.482 53.287 C 143.663 55.156 142.739 59.004 144.43 62.031 C 146.095 65.011 149.688 66.121 152.638 64.649 L 152.791 64.566 C 153.327 65.797 153.825 67.041 154.284 68.297 C 151.087 69.348 149.231 72.817 150.106 76.197 C 150.965 79.513 154.146 81.543 157.357 80.924 L 157.535 80.882 C 157.744 82.209 157.912 83.544 158.041 84.881 C 154.698 85.05 152.043 87.903 152.043 91.395 C 152.043 94.812 154.579 97.614 157.81 97.899 L 158.041 97.913 C 157.912 99.25 157.744 100.584 157.535 101.912 C 154.265 101.175 150.981 103.22 150.106 106.597 C 149.248 109.912 151.019 113.316 154.098 114.437 L 154.284 114.497 C 153.825 115.752 153.327 116.996 152.791 118.228 C 149.811 116.636 146.123 117.732 144.43 120.762 C 142.767 123.74 143.634 127.513 146.342 129.417 L 146.482 129.507 C 145.725 130.592 144.933 131.659 144.103 132.704 C 141.626 130.378 137.793 130.452 135.403 132.925 C 133.049 135.357 132.942 139.232 135.081 141.796 L 135.188 141.92 C 134.176 142.776 133.145 143.597 132.096 144.38 C 130.288 141.464 126.565 140.509 123.636 142.257 C 120.754 143.977 119.681 147.692 121.105 150.741 L 121.184 150.901 C 119.994 151.454 118.791 151.969 117.576 152.444 C 116.559 149.14 113.202 147.219 109.933 148.125 C 106.726 149.013 104.761 152.301 105.361 155.62 L 105.402 155.803 C 104.117 156.02 102.826 156.194 101.531 156.327 C 101.368 152.87 98.608 150.126 95.23 150.126 C 91.927 150.126 89.215 152.749 88.94 156.089 L 88.927 156.327 C 87.633 156.194 86.343 156.02 85.057 155.803 C 85.771 152.424 83.791 149.03 80.524 148.125 C 77.317 147.237 74.026 149.067 72.939 152.251 L 72.883 152.444 C 71.669 151.969 70.466 151.454 69.274 150.901 C 70.815 147.82 69.754 144.007 66.823 142.257 C 63.94 140.537 60.291 141.433 58.45 144.234 L 58.363 144.38 C 57.313 143.597 56.281 142.776 55.269 141.92 C 57.519 139.359 57.448 135.396 55.057 132.925 C 52.703 130.492 48.955 130.381 46.474 132.592 L 46.356 132.704 C 45.527 131.659 44.732 130.592 43.976 129.507 C 46.796 127.637 47.719 123.79 46.028 120.762 C 44.363 117.783 40.77 116.673 37.821 118.145 L 37.668 118.228 C 37.131 116.996 36.633 115.752 36.175 114.497 C 39.371 113.446 41.228 109.977 40.351 106.597 C 39.493 103.282 36.312 101.251 33.103 101.87 L 32.925 101.912 C 32.715 100.584 32.546 99.25 32.417 97.913 C 35.761 97.743 38.416 94.89 38.416 91.395 C 38.416 87.982 35.88 85.18 32.648 84.895 L 32.417 84.881 C 32.546 83.544 32.715 82.209 32.925 80.882 C 36.193 81.618 39.476 79.573 40.351 76.197 C 41.212 72.881 39.44 69.477 36.359 68.356 L 36.175 68.297 C 36.633 67.041 37.131 65.797 37.668 64.566 C 40.646 66.158 44.335 65.061 46.028 62.031 C 47.691 59.053 46.826 55.281 44.116 53.377 L 43.976 53.287 C 44.732 52.202 45.527 51.135 46.356 50.089 C 48.831 52.415 52.665 52.341 55.057 49.869 C 57.41 47.436 57.516 43.562 55.378 40.997 L 55.269 40.874 C 56.281 40.018 57.313 39.197 58.363 38.415 C 60.171 41.329 63.893 42.284 66.823 40.537 C 69.704 38.817 70.779 35.102 69.353 32.053 L 69.274 31.893 C 70.466 31.34 71.669 30.824 72.883 30.35 C 73.899 33.654 77.256 35.574 80.524 34.669 C 83.732 33.78 85.698 30.493 85.098 27.174 L 85.057 26.99 C 86.343 26.773 87.633 26.599 88.927 26.467 C 89.09 29.923 91.849 32.667 95.23 32.667 C 98.533 32.667 101.242 30.045 101.519 26.705 L 101.531 26.467 C 102.826 26.599 104.117 26.773 105.402 26.99 C 104.689 30.37 106.666 33.765 109.933 34.669 C 113.141 35.557 116.434 33.726 117.518 30.542 L 117.576 30.35 C 118.791 30.824 119.994 31.34 121.184 31.893 C 119.644 34.974 120.704 38.786 123.636 40.537 C 126.517 42.257 130.166 41.36 132.007 38.56 L 132.096 38.415 C 133.145 39.197 134.176 40.018 135.188 40.874 C 132.939 43.435 133.011 47.398 135.403 49.869 C 137.755 52.302 141.504 52.412 143.983 50.201 L 144.103 50.089 Z"
            />
            <circle fill="#111827" cx="95.5" cy="91" r="51" />
            <g transform="matrix(0.6, 0, 0, 0.6, 60, 52)">
              <svg
                viewBox="0 0 182 134"
                x="0px"
                y="0px"
                fillRule="evenodd"
                clipRule="evenodd"
                fill="#9CA3AF"
              >
                <g>
                  <path d="M66 75c50,6 116,16 116,25 0,7 -28,12 -109,14 -32,0 -49,4 -57,8 -8,6 10,11 14,12l-19 0c-30,-24 57,-28 62,-28 75,-2 92,-4 92,-6 0,-6 -134,-25 -165,-25l20 -12 4 7 8 -15 18 -12 14 10 17 -29 14 18 18 -25 54 58 -101 0z" />
                  <path d="M24 0c13,0 23,11 23,24 0,7 -4,14 -10,18l-13 24 -14 -24c-6,-4 -10,-11 -10,-18 0,-13 11,-24 24,-24zm0 8c8,0 15,7 15,16 0,8 -7,15 -15,15 -9,0 -16,-7 -16,-15 0,-9 7,-16 16,-16z" />
                </g>
              </svg>
            </g>
          </svg>
          <span className="ml-3 text-xl text-gray-400">{siteTitle}</span>
        </Link>
      </div>
      <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
          <nav className="list-none mb-10">
          <li key="search">
              <Link to="/search" className="text-gray-400 hover:text-white">
                Suche
              </Link>
            </li>
            <li key="tracks">
              <Link to="/tracks" className="text-gray-400 hover:text-white">
                Touren
              </Link>
            </li>
          </nav>
        </div>
        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
          <nav className="list-none mb-10">
            {collectionTypes.map(collectionType => {
                const { id, name, slug, collections } = collectionType;
                return collections.length > 0 ? (
                  <li key={id}>
                    <Link 
                      to={`/${slug}`}
                      className="text-gray-400 hover:text-white"
                    >
                      {name}
                    </Link>
                </li>
                ) : null
              })}
          </nav>
        </div>
        <div className="lg:w-1/4 md:w-1/2 w-full px-4">
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
          </nav>
        </div>
      </div>
    </div>
    <div className="bg-gray-800 bg-opacity-75">
      <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
        <p className="text-gray-400 text-sm text-center sm:text-left">
          © {new Date().getFullYear()} MapSeven — Kerstin Huppenbauer
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
          <img className="h-[24px]" src={'/api_logo_pwrdBy_strava_stack_gray.png'} alt="strava" />
        </span>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
          <a
            className="text-gray-400"
            href="https://www.facebook.com/kerstin.huppenbauer"
            target="_blank"
            rel="noreferrer"
          >
            <Facebook />
          </a>
          <a
            className="ml-3 text-gray-400"
            href="https://www.twitter.com/khuppenbauer"
            target="_blank"
            rel="noreferrer"
          >
            <Twitter />
          </a>
          <a
            className="ml-3 text-gray-400"
            href="https://www.github.com/khuppenbauer"
            target="_blank"
            rel="noreferrer"
          >
            <GitHub />
          </a>
          <a
            className="ml-3 text-gray-400"
            href="https://www.linkedin.com/in/kerstin-huppenbauer"
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin/>
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
