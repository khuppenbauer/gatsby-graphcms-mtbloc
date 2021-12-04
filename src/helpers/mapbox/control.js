import mapboxgl from "mapbox-gl"
import ImageLayerSelector from "./imageLayerSelector"
import LayerSelector from "./layerSelector"
import StyleSelector from "./styleSelector"
import TrackSelector from "./trackSelector"

import { getMapLayerFeatures, getImages, getTracks } from "../geoJson" 

export const addControls = (map, geoJson) => {
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
      new TrackSelector({
        tracks: getTracks(geoJson),
      }),
      'top-left'
    );
    if (getImages(geoJson).length > 1) {
      map.addControl(
        new ImageLayerSelector({}),
        'top-left'
      );
    }
    const layers = getMapLayerFeatures(geoJson);
    if (Object.keys(layers).length > 0) {
      map.addControl(
        new LayerSelector({
          layers,
        }),
        'top-left'
      );
    }
    map.addControl(
      new StyleSelector({
        styles: [
          'outdoors-v11',
          'satellite-streets-v11'
        ],
      }),
      'bottom-left'
    );
  }
};
