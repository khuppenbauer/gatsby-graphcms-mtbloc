export const addChartPoints = (map) => {
  if (map) {
    map.addSource("chart-point-source", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    });
    map.addLayer({
      id: "chart-point",
      type: "circle",
      source: "chart-point-source",
      paint: {
        "circle-color": "blue",
        "circle-stroke-color": "rgba(255,255,255,0.6)",
        "circle-stroke-width": 4,
        "circle-radius": 6,
        "circle-blur": 0.1
      }
    });
  }
}