import React, { useState } from 'react'
import { render } from 'react-dom'

import { flyTo, unselectAllTracks, setTrackVisibility } from './layer'

const Button = () => {
  const handleOpenTrackList = () => {
    document.getElementById('mapboxgl-track-button').style.display = 'none';
    document.getElementById('mapboxgl-track-list').style.display = 'block';
  }

  return (
    <button
      id="mapboxgl-track-button"
      className="mapboxgl-ctrl-icon"
      style={{ display: 'block', padding: '5px' }}
      onClick={() => handleOpenTrackList()}
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
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    </button>
  );
}

const TrackList = ({ map, tracks }) => {
  const handleCloseTrackList = () => {
    unselectAllTracks(map);
    document.getElementById('mapboxgl-track-button').style.display = 'block';
    document.getElementById('mapboxgl-track-list').style.display = 'none';
  }

  return (
    <div 
      id="mapboxgl-track-list" 
      style={{ display: 'none', maxWidth: '35vH', maxHeight: '35vH', 'overflowY': 'auto', padding: '10px' }}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-lg text-gray-400">Touren</h2>
        <div className="ml-3 h-7 flex items-center">
          <button 
            type="button" 
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
            id="mapboxgl-track-close-button"
            onClick={() => handleCloseTrackList()}
          >
            x
          </button>
        </div>
      </div>
      {tracks}
    </div>
  );
}

const TrackSelector = ({ map, tracks }) => {
  const [checkedAllState, setCheckedAllState] = useState(true);
  const [checkedSomeState, setCheckedSomeState] = useState(false);
  const [checkedState, setCheckedState] = useState(
    new Array(tracks.length).fill(true)
  );

  const handleSelectTrack = (track, index) => {
    if (!checkedState[index]) {
      handleToggleTracks(index);
    }
    flyTo(map, track);
  }

  const handleToggleTracks = (trackIndex) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === trackIndex ? !item : item
    );
    setCheckedState(updatedCheckedState);

    const hasActiveState = updatedCheckedState.filter((item) => item === true);
    if (hasActiveState.length === 0) {
      setCheckedAllState(false);
    }
    if (hasActiveState.length > 0) {
      setCheckedAllState(true);
    }
    if (hasActiveState.length > 0 && hasActiveState.length < tracks.length) {
      setCheckedSomeState(true);
    } else {
      setCheckedSomeState(false);
    }

    const track = tracks[trackIndex].properties.name;
    const visibility = updatedCheckedState[trackIndex] ? 'visible' : 'none';
    setTrackVisibility(map, track, visibility);
  };

  const handleToggleAllTracks = () => {   
    setCheckedAllState(!checkedAllState);
    setCheckedState(new Array(tracks.length).fill(!checkedAllState));
    setCheckedSomeState(false);

    tracks.forEach((trackItem) => {
      const track = trackItem.properties.name;
      const visibility = checkedAllState ? 'none' : 'visible';
      setTrackVisibility(map, track, visibility);
    });
  };

  const trackItems = tracks ? (
    <div className="bg-white space-y-6">
      <fieldset>
        <div className="mt-1">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="all"
                name="all"
                value="all"
                type="checkbox"
                className={`h-4 w-4 ${checkedSomeState ? 'text-gray-400' : 'text-blue-600'} border-gray-300 rounded`}
                checked={checkedAllState}
                onChange={() => handleToggleAllTracks()}
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="all" className="text-gray-500 text-xs">
                Alle Touren
              </label>
            </div>
          </div>
          {tracks && tracks.map((track, index) => {
            const { properties } = track;
            const { name, title } = properties;
            const trackName = `track-${properties.name}`;
            return (
              <div key={name} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={name}
                    name={trackName}
                    value={trackName}
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={checkedState[index]}
                    onChange={() => handleToggleTracks(index)}
                  />
                </div>
                <div className="ml-2 text-xs">
                  <button
                    href="#"
                    className="text-blue-500"
                    onClick={() => handleSelectTrack(track, index)}
                    onKeyDown={() => handleSelectTrack(track, index)}
                    style={{ width: '100%', height: '100%', textAlign: 'left'}}
                  >
                    {title || name}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </fieldset>
    </div>
  ) : null;

  return (
    <>
      <Button />  
      <TrackList map={map} tracks={trackItems} />
    </>
  );
}

// Wrap in a Mapbox GL plugin so that we can construct the above React element on map init
class Plugin {
  constructor({ position, tracks }) {
    this.position = position;
    this.tracks = tracks;
  }

  onAdd(map) {
    const { tracks } = this;
    const trackItems = tracks.sort((a, b) => (a.properties.name > b.properties.name) ? 1 : -1)
    this.map = map;
    this.container = document.createElement('div');
    this.container.classList.add('mapboxgl-ctrl');
    this.container.classList.add('mapboxgl-ctrl-group');
    this.container.style.float = 'none !important';
    this.container.style.cursor = 'pointer';
    if (trackItems.length > 1) {
      render(<TrackSelector map={map} tracks={trackItems} />, this.container);
    }
    return this.container;
  }

  onRemove() {
    this.map = null;
    this.container.parentNode.removeChild(this.container);
  }
}

export default Plugin
