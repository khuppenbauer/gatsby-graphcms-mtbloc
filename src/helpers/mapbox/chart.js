export const addChartPoints = (map) => {
  if (map.current) {
    map.current.addSource("chart-point-source", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    });
    map.current.addLayer({
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