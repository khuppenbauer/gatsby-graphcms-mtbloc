import React, { Component } from 'react';
import connect from './connector';

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
          placeholder="Suche"
          aria-label="Suche"
        />
    );
  }
}

export default connect(Places);
