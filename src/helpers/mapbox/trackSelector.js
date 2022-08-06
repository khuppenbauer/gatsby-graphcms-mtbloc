import React, { useState } from 'react'
import { render } from 'react-dom'
import { points } from '@turf/helpers'
import bboxPolygon from '@turf/bbox-polygon'
import pointsWithinPolygon from '@turf/points-within-polygon'

import { convertMetaData } from '../track' 
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
        stroke="#000000"
        strokeWidth="3"
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
  const [trigger, setTrigger] = useState(Date.now());

  map.once('idle', () => {
    const date = Date.now();
    if (date > trigger) {
      setTrigger(date);
    }
  });

  const bounds = map.getBounds();
  const {_sw, _ne } = bounds;
  const bbox = bboxPolygon([_sw.lng, _sw.lat, _ne.lng, _ne.lat]);

  const activeTracks = tracks.map((track) => {
    const { geometry, properties } = track;
    const { name } = properties;
    const trackPoints = points(geometry.coordinates);
    const tracksWithinBounds = pointsWithinPolygon(trackPoints, bbox);
    const visibility = map.getLayoutProperty(
      `track-${name}`,
      'visibility'
    );
    track.properties = {
      ...properties,
      enabled: tracksWithinBounds.features.length > 10,
      visibility: visibility !== 'none',
    };
    return track;
  })

  const hasActiveState = activeTracks.filter((item) => item.properties.visibility === true);
  const activeTracksCount = hasActiveState.length;
  const checkedAllState = activeTracksCount > 0;
  const checkedSomeState = activeTracksCount > 0 && activeTracksCount < activeTracks.length

  const handleSelectTrack = (track, index) => {
    if (!activeTracks[index].properties.visibility) {
      handleToggleTracks(index);
    }
    flyTo(map, track);
  }

  const handleToggleTracks = (trackIndex) => {
    const { properties } = activeTracks[trackIndex];
    const { name, visibility } = properties;
    const trackVisibility = visibility ? 'none' : 'visible';
    setTrackVisibility(map, name, trackVisibility);
  };

  const handleToggleAllTracks = () => {   
    activeTracks.forEach((trackItem) => {
      const track = trackItem.properties.name;
      const visibility = checkedAllState ? 'none' : 'visible';
      setTrackVisibility(map, track, visibility);
    });
  };

  const trackItems = activeTracks ? (
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
          {activeTracks && activeTracks.map((track, index) => {
            const { properties } = track;
            const { name, title, color, visibility, enabled } = properties;
            const trackName = `track-${properties.name}`;
            const { distance, totalElevationGain, totalElevationLoss } = convertMetaData(properties);
            const borderColor = enabled ? '' : 'rgb(156, 163, 175)';
            return (
              <div key={name} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={name}
                    name={trackName}
                    value={trackName}
                    type="checkbox"
                    className="h-4 w-4 rounded"
                    checked={visibility}
                    disabled={!enabled}
                    style={{ borderColor }}
                    onChange={() => handleToggleTracks(index)}
                  />
                </div>
                <div className="ml-2 text-xs">
                  <button
                    href="#"
                    className={`${enabled ? "text-blue-500" : "text-gray-200"}`}
                    onClick={() => handleSelectTrack(track, index)}
                    onKeyDown={() => handleSelectTrack(track, index)}
                    style={{ width: '100%', height: '100%', textAlign: 'left', borderLeft: `10px solid ${color}`, margin: '2px 0px', paddingLeft: '10px' }}
                  >
                    {title || name}<br />({`${distance} | ${totalElevationGain} | ${totalElevationLoss}`})
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
    const trackSelector = document.getElementById('track-selector');
    if (trackSelector) {
      trackSelector.parentNode.removeChild(trackSelector);
    }
    this.container = document.createElement('div');
    this.container.classList.add('mapboxgl-ctrl');
    this.container.classList.add('mapboxgl-ctrl-group');
    this.container.setAttribute('id', 'track-selector');
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
