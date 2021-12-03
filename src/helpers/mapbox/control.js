import mapboxgl from "mapbox-gl"
import StyleSelector from "./styleSelector"
import TrackSelector from "./trackSelector"

import { getFeatures, getTracks } from "../geoJson" 

export const addControls = (map, geoJson, mapType) => {
  if (map) {
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }));
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(
      new StyleSelector({
        styles: [
          'outdoors-v11',
          'satellite-streets-v11'
        ],
      }),
      'bottom-left'
    );
    const tracks = mapType === 'collection' ? getTracks(geoJson) : [];
    map.addControl(
      new TrackSelector({
        tracks,
      }),
      'bottom-left'
    );
  }
};
