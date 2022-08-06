import React, { useState } from 'react'
import { render } from 'react-dom'

import { setClusterVisibility, setTrackVisibility } from './layer'

const trackIcon = (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path d="M320 256C302.3 256 288 270.3 288 288C288 305.7 302.3 320 320 320H416C469 320 512 362.1 512 416C512 469 469 512 416 512H139.6C148.3 502.1 158.9 489.4 169.6 475.2C175.9 466.8 182.4 457.6 188.6 448H416C433.7 448 448 433.7 448 416C448 398.3 433.7 384 416 384H320C266.1 384 223.1 341 223.1 288C223.1 234.1 266.1 192 320 192H362.1C340.2 161.5 320 125.4 320 96C320 42.98 362.1 0 416 0C469 0 512 42.98 512 96C512 160 416 256 416 256H320zM416 128C433.7 128 448 113.7 448 96C448 78.33 433.7 64 416 64C398.3 64 384 78.33 384 96C384 113.7 398.3 128 416 128zM118.3 487.8C118.1 488 117.9 488.2 117.7 488.4C113.4 493.4 109.5 497.7 106.3 501.2C105.9 501.6 105.5 502 105.2 502.4C99.5 508.5 96 512 96 512C96 512 0 416 0 352C0 298.1 42.98 255.1 96 255.1C149 255.1 192 298.1 192 352C192 381.4 171.8 417.5 149.9 448C138.1 463.2 127.7 476.9 118.3 487.8L118.3 487.8zM95.1 384C113.7 384 127.1 369.7 127.1 352C127.1 334.3 113.7 320 95.1 320C78.33 320 63.1 334.3 63.1 352C63.1 369.7 78.33 384 95.1 384z"/>
  </svg>
);

const clusterIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000000"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="2" />
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
  </svg>
);

const ClusterSelector = ({ map, types, tracks }) => {
  const [mapType, setMapType] = useState(types[0]);
  const handleSwitchLayer = newMapType => {
    if (newMapType === mapType) return;
    let trackVisibility = 'none';
    let clusterVisibility = 'none';
    setMapType(newMapType);
    if (newMapType === 'cluster') {
      clusterVisibility = 'visible';
    }
    if (newMapType === 'track') {
      trackVisibility = 'visible';
    }
    tracks.forEach((trackItem) => {
      const track = trackItem.properties.name;
      setTrackVisibility(map, track, trackVisibility);
    });
    setClusterVisibility(map, clusterVisibility);
  }
  const nextMapType = mapType === types[0] ? types[1] : types[0];
  return (
    <button
      id="mapboxgl-cluster-button"
      className="mapboxgl-ctrl-icon"
      style={{ display: 'block', padding: '5px' }}
      onClick={() => handleSwitchLayer(nextMapType)}
    >
      {nextMapType === 'cluster' ? (clusterIcon) : (trackIcon)}
    </button>
  )
}

// Wrap in a Mapbox GL plugin so that we can construct the above React element on map init
class Plugin {
  constructor({ tracks, types, position }) {
    this.tracks = tracks;
    this.types = types;
    this.position = position;
  }

  onAdd(map) {
    const { types, tracks } = this;
    this.map = map;
    const clusterSelector = document.getElementById('cluster-selector');
    if (clusterSelector) {
      clusterSelector.parentNode.removeChild(clusterSelector);
    }
    this.container = document.createElement('div');
    this.container.classList.add('mapboxgl-ctrl');
    this.container.classList.add('mapboxgl-ctrl-group');
    this.container.setAttribute('id', 'cluster-selector');
    this.container.style.float = 'none !important';
    this.container.style.cursor = 'pointer';
    render(
      <ClusterSelector 
        map={map}
        tracks={tracks}
        types={types}
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
