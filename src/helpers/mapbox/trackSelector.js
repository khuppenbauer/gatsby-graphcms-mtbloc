import React, { useState } from 'react'
import { render } from 'react-dom'

import { selectTrack, unselectAllTracks, setTrackVisibility } from './layer'

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
        viewBox="0 0 512 512"
      >
        <path d="M12.41 148.02l232.94 105.67c6.8 3.09 14.49 3.09 21.29 0l232.94-105.67c16.55-7.51 16.55-32.52 0-40.03L266.65 2.31a25.607 25.607 0 0 0-21.29 0L12.41 107.98c-16.55 7.51-16.55 32.53 0 40.04zm487.18 88.28l-58.09-26.33-161.64 73.27c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.51 209.97l-58.1 26.33c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 276.3c16.55-7.5 16.55-32.5 0-40zm0 127.8l-57.87-26.23-161.86 73.37c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.29 337.87 12.41 364.1c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 404.1c16.55-7.5 16.55-32.5 0-40z"/>
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

  const handleSelectTrack = (name) => {
    unselectAllTracks(map);
    selectTrack(map, name, name);
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
              <label htmlFor="all" className="text-gray-500">
                Alle Touren
              </label>
            </div>
          </div>
          {tracks && tracks.map((track, index) => {
            const { properties } = track;
            const { name } = properties;
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
                <div className="ml-2 text-sm">
                  <label htmlFor={name} className="text-gray-500">
                    {name}
                  </label>
                </div>
                <div className="ml-2 text-sm">
                  <button 
                    className="h-3 -m-1"
                    onClick={() => handleSelectTrack(name)}
                  >
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="highlighter" className="svg-inline--fa fa-highlighter" role="img" width="15" height="15" strokeWidth="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                      <path fill="currentColor" d="M124.6 239.1c-10.75 9.502-14.1 24.38-10.75 38.13l12.1 42.75l-50.88 51l96.13 96.25l50.88-50.88l42.75 13c13.75 4.25 28.62 0 38.12-10.75l35.62-41.62L166.1 204.5L124.6 239.1zM527.9 79.25l-63.09-63.12c-20.5-20.5-53.42-21.63-75.17-2.376L190.5 183.6l169.9 169.9l169.9-199.1C549.5 132.6 548.4 99.75 527.9 79.25zM71.48 409.6l-65.08 65.24C-7.278 488.6 2.419 512 21.76 512h72.54c4.232 0 8.291-1.684 11.29-4.686l32.02-32.1L71.48 409.6z"></path>
                    </svg>
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
    this.map = map;
    this.container = document.createElement('div');
    this.container.classList.add('mapboxgl-ctrl');
    this.container.classList.add('mapboxgl-ctrl-group');
    this.container.style.float = 'none !important';
    this.container.style.cursor = 'pointer';
    if (tracks.length > 1) {
      render(<TrackSelector map={map} tracks={tracks} />, this.container);
    }
    return this.container;
  }

  onRemove() {
    this.map = null;
    this.container.parentNode.removeChild(this.container);
  }
}

export default Plugin
