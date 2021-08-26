import React, { Component } from 'react';
import { createConnector } from 'react-instantsearch-dom';

const connect = createConnector({
  displayName: 'GeoSearch',

  getProvidedProps(props, searchState, searchResults) {
    return {};
  },

  refine(props, searchState, nextValue) {
    return {
      ...searchState,
      aroundLatLng: nextValue,
      boundingBox: {},
    };
  },

  getSearchParameters(searchParameters, props, searchState) {
    const { aroundLatLng } = searchState;
    if (!aroundLatLng) {
      return searchParameters.setQueryParameter('insideBoundingBox')  
    }
    const { lat, lng } = aroundLatLng;
    if (!lat && !lng) {
      return searchParameters
      .setQueryParameter('insideBoundingBox')
      .setQueryParameter('aroundLatLng');
    }
    return searchParameters
      .setQueryParameter('insideBoundingBox')
      .setQueryParameter('aroundLatLng', `${lat}, ${lng}`)
      .setQueryParameter('getRankingInfo', true);
  },
});

class Places extends Component {
  createRef = c => (this.element = c);

  componentDidMount() {
    const { refine } = this.props;

    if (window) {
      const places = require("places.js");
      const autocomplete = places({
        container: this.element,
      });
  
      autocomplete.on('change', event => {
        refine(event.suggestion.latlng);
      });
  
      autocomplete.on('clear', () => {
        refine({});
      });
    }
  }

  render() {
    return (
        <input
          className="w-full bg-gray-800 bg-opacity-40 rounded border border-gray-700 focus:border-blue-500 focus:bg-gray-900 focus:ring-2 focus:ring-blue-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          ref={this.createRef}
          type="search"
          id="address-input"
          placeholder="Suche nach Orten"
          aria-label="Suche"
        />
    );
  }
}

export default connect(Places);
