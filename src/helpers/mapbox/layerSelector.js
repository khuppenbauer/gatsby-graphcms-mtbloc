import React from 'react'
import { render } from 'react-dom'

const labels = {
  pass: 'Pässe',
  residence: 'Hütten',
  map: 'Karten',
  book: 'Bücher',
};

const Button = () => {
  const handleOpenLayerList = () => {
    document.getElementById('mapboxgl-layer-button').style.display = 'none';
    document.getElementById('mapboxgl-layer-list').style.display = 'block';
  }

  return (
    <button
      id="mapboxgl-layer-button"
      className="mapboxgl-ctrl-icon"
      style={{ display: 'block', padding: '5px' }}
      onClick={() => handleOpenLayerList()}
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
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    </button>
  );
}

const LayerList = ({ layerItems }) => {
  const handleCloseLayerList = () => {
    document.getElementById('mapboxgl-layer-button').style.display = 'block';
    document.getElementById('mapboxgl-layer-list').style.display = 'none';
  }

  return (
    <div 
      id="mapboxgl-layer-list" 
      style={{ display: 'none', maxWidth: '35vH', maxHeight: '35vH', 'overflowY': 'auto', padding: '10px' }}
    >
      <div className="flex items-start justify-between">
        <div className="ml-3 h-7 flex items-center">
          <button 
            type="button" 
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
            id="mapboxgl-track-close-button"
            onClick={() => handleCloseLayerList()}
          >
            x
          </button>
        </div>
      </div>
      {layerItems}
    </div>
  );
}

const LayerSelector = ({ map, layers }) => {
  const { Point: point, Polygon: polygon } = layers;

  const handleSwitchLayer = (layer, type) => {
    if (type === 'point') {
      const visibility = map.getLayoutProperty(`${layer}`, 'visibility') === 'visible' ? 'none' : 'visible';
      map.setLayoutProperty(layer, 'visibility', visibility);
    }
    if (type === 'polygon') {
      const visibility = map.getLayoutProperty(`${layer}-fill`, 'visibility') === 'visible' ? 'none' : 'visible';
      map.setLayoutProperty(`${layer}-fill`, 'visibility', visibility);
      map.setLayoutProperty(`${layer}-outline`, 'visibility', visibility);
    }
  }

  const LayerItem = ({ layer, type }) => (
    <div key={layer} className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={layer}
          name={layer}
          value={layer}
          type="checkbox"
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          onChange={() => handleSwitchLayer(layer, type)}
        />
      </div>
      <div className="ml-2 text-sm">
        <label htmlFor={layer} className="text-gray-500">
          {labels[layer]}
        </label>
      </div>
    </div>
  );

  const layerItems = point || polygon ? (
    <div className="bg-white space-y-6">
      <fieldset>
        <div className="mt-1">
          {point && point.map((layer) => {
            return (
              <LayerItem key={layer} layer={layer} type="point" />
            )
          })}
          {polygon && polygon.map((layer) => {
            return (
              <LayerItem key={layer} layer={layer} type="polygon" />
            )
          })}
        </div>
      </fieldset>
    </div>
  ) : null;

  return (
    <>
      <Button />
      <LayerList map={map} layerItems={layerItems} />
    </>
  );
}

// Wrap in a Mapbox GL plugin so that we can construct the above React element on map init
class Plugin {
  constructor({ layers, position }) {
    this.layers = layers;
    this.position = position;
  }

  onAdd(map) {
    const { layers } = this;
    this.map = map;
    this.container = document.createElement('div');
    this.container.classList.add('mapboxgl-ctrl');
    this.container.classList.add('mapboxgl-ctrl-group');
    this.container.style.float = 'none !important';
    this.container.style.cursor = 'pointer';
    render(<LayerSelector map={map} layers={layers} />, this.container);
    return this.container;
  }

  onRemove() {
    this.map = null;
    this.container.parentNode.removeChild(this.container);
  }
}

export default Plugin
