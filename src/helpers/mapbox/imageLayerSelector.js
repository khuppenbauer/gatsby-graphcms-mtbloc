import React from 'react'
import { render } from 'react-dom'

const ImageLayerSelector = ({ map }) => {
  const handleSwitchLayer = (layer) => {
    const visibility = map.getLayoutProperty(layer, 'visibility') === 'visible' ? 'none' : 'visible';
    map.setLayoutProperty(layer, 'visibility', visibility);
  }

  return (
    <button
      id="mapboxgl-track-button"
      className="mapboxgl-ctrl-icon"
      style={{ display: 'block', padding: '5px' }}
      onClick={() => handleSwitchLayer('image')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    </button>
  );
}

// Wrap in a Mapbox GL plugin so that we can construct the above React element on map init
class Plugin {
  constructor({ position }) {
    this.position = position;
  }

  onAdd(map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.classList.add('mapboxgl-ctrl');
    this.container.classList.add('mapboxgl-ctrl-group');
    this.container.style.float = 'none !important';
    this.container.style.cursor = 'pointer';
    render(<ImageLayerSelector map={map} />, this.container);
    return this.container;
  }

  onRemove() {
    this.map = null;
    this.container.parentNode.removeChild(this.container);
  }
}

export default Plugin
