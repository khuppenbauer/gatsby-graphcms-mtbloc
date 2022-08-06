import React, { useState } from 'react'
import { render } from 'react-dom'

const styleImages = process.env.GATSBY_MAPBOX_STYLE_IMAGES

const getSrc = ({ styleID }) =>
  `${styleImages}${styleID}.webp`

const StyleSelector = ({ map, styles }) => {
  const [basemap, setBasemap] = useState(styles[0]);
  const handleBasemapClick = newBasemap => {
    if (newBasemap === basemap) return;
    setBasemap(newBasemap);
    map.setStyle(`mapbox://styles/mapbox/${newBasemap}`);
  }
  const nextBasemap = basemap === styles[0] ? styles[1] : styles[0];

  return (
    <img 
      alt={nextBasemap} 
      src={getSrc({ styleID: nextBasemap })} 
      width="29"
      height="29"
      onClick={() => handleBasemapClick(nextBasemap)}
      aria-hidden="true"
    />
  )
}

// Wrap in a Mapbox GL plugin so that we can construct the above React element on map init
class Plugin {
  constructor({ styles, position }) {
    this.styles = styles;
    this.position = position;
  }

  onAdd(map) {
    const { styles } = this;
    this.map = map;
    const styleSelector = document.getElementById('style-selector');
    if (styleSelector) {
      styleSelector.parentNode.removeChild(styleSelector);
    }
    this.container = document.createElement('div');
    this.container.classList.add('mapboxgl-ctrl');
    this.container.classList.add('mapboxgl-ctrl-style-selector');
    this.container.setAttribute('id', 'style-selector');
    this.container.style.float = 'none !important';
    this.container.style.cursor = 'pointer';
    render(<StyleSelector map={map} styles={styles} />, this.container);
    return this.container;
  }

  init() {
    const { map, styles, container } = this;
    render(<StyleSelector map={map} styles={styles} />, container);
  }

  onRemove() {
    this.map = null;
    this.container.parentNode.removeChild(this.container);
  }
}

export default Plugin
