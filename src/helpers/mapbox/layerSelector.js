import React, { useState } from 'react'
import { render } from 'react-dom'

import { addSymbol, addArea } from './layer'
import { getAlgoliaFeatures } from '../features'
import { parseAlgoliaHits } from '../geoJson'

const labels = {
  pass: 'Pässe',
  residence: 'Hütten',
  map: 'Karten',
  book: 'Bücher',
  regions: 'Regionen',
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

const LayerSelector = ({ map, minCoords, maxCoords, layers }) => {
  const state = layers.map(() => false);
  const [checkedState, setCheckedState] = useState(state);

  const handleSwitchLayer = async (layer, layerIndex) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === layerIndex ? !item : item
    );
    setCheckedState(updatedCheckedState);
    if (!map.getSource(layer)) {
      const { hits } = await getAlgoliaFeatures(minCoords, maxCoords, [layer]);
      const geoJson = parseAlgoliaHits(hits, layer);
      if (geoJson) {
        const type = geoJson.features[0].geometry.type;
        map.addSource(layer, {
          type: 'geojson',
          data: geoJson,
        });
        if (type === 'Point') {
          addSymbol(map, layer, layer);
        }
        if (type === 'Polygon') {
          addArea(map, layer, layer);
        }
      }
    } else {
      const visibility = updatedCheckedState[layerIndex] ? 'visible' : 'none';
      const mapLayers = map.getStyle().layers.filter((mapLayer) => mapLayer.source === layer);      
      mapLayers.forEach((mapLayer) => {
        map.setLayoutProperty(mapLayer.id, 'visibility', visibility);
      });
    }
  }

  const LayerItem = ({ layer, index }) => {
    if (labels[layer]) {
      return (
        <div key={layer} className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id={layer}
              name={layer}
              value={layer}
              type="checkbox"
              checked={checkedState[index]}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              onChange={() => handleSwitchLayer(layer, index)}
            />
          </div>
          <div className="ml-2 text-sm">
            <label htmlFor={layer} className="text-gray-500">
              {labels[layer]}
            </label>
          </div>
        </div>
      )
    }
    return null;
  };

  const layerItems = (
    <div className="bg-white space-y-6">
      <fieldset>
        <div className="mt-1">
          {layers.map((layer, index) => {
            return (
              <LayerItem key={layer} layer={layer} index={index} />
            )                
          })}          
        </div>
      </fieldset>
    </div>
  )

  return (
    <>
      <Button />
      <LayerList map={map} layerItems={layerItems} />
    </>
  );
}

// Wrap in a Mapbox GL plugin so that we can construct the above React element on map init
class Plugin {
  constructor({ minCoords, maxCoords, layers, position }) {
    this.minCoords = minCoords;
    this.maxCoords = maxCoords;
    this.layers = layers;
    this.position = position;
  }

  onAdd(map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.classList.add('mapboxgl-ctrl');
    this.container.classList.add('mapboxgl-ctrl-group');
    this.container.style.float = 'none !important';
    this.container.style.cursor = 'pointer';
    render(
      <LayerSelector
        map={map}
        minCoords={this.minCoords}
        maxCoords={this.maxCoords}
        layers={this.layers}
      />,
      this.container
    );
    return this.container;
  }

  onRemove() {
    this.map = null;
    this.container.parentNode.removeChild(this.container);
  }
}

export default Plugin
