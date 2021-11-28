import mapboxgl from "mapbox-gl"
import StyleSelector from "./styleSelector"

export const addControls = (map) => {
  if (map.current) {
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }));
    map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(
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
