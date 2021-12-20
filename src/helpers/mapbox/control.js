import mapboxgl from "mapbox-gl"
import ImageLayerSelector from "./imageLayerSelector"
import LayerSelector from "./layerSelector"
import StyleSelector from "./styleSelector"
import TrackSelector from "./trackSelector"

import { getTracks, getImages } from "../geoJson" 

export const addControls = (map, geoJson, minCoords, maxCoords, layers, type) => {
  if (map) {
    let images = [];
    if (type === 'collection') {
      images = layers.filter((item) => item === 'image');
    }
    if (type === 'track') {
      images = getImages(geoJson);
    }
    const mapLayers = layers.filter((item) => item !== 'image' && item !== 'track');
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
    if (images.length > 0) {
      map.addControl(
        new ImageLayerSelector({
          minCoords,
          maxCoords,
          images: type === 'track' ? images : null,
        }),
        'top-left'
      );
    }
    if (mapLayers.length > 0) {
      map.addControl(
        new LayerSelector({
          minCoords,
          maxCoords,
          layers: mapLayers,
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
