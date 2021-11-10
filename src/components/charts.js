import React, { useContext} from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getPathLength } from "geolib";

import { TrackContext } from "./mapChart"

const Charts = ({ data: { features }, distance }) => {
  const { dispatch } = useContext(TrackContext);
  const geoJson = features
    .filter((feature) => feature.geometry.type === 'LineString')
    .reduce((prev, current) => {
    const prevDistance = prev ? getPathLength(prev.geometry.coordinates) : 0;
    const currentDistance = current ? getPathLength(current.geometry.coordinates) : 0;
    return (prevDistance > currentDistance) ? prev : current;
  });
  const points = geoJson.geometry.coordinates;
  const step = distance / points.length;
  const elevation = points.map((coordinate, index) => {
    const distance = index * step / 1000;
    return {
      elevation: Math.floor(coordinate[2]),
      distance: distance.toFixed(2),

    };
  });
  const start = 0;
  const diff = 5;
  const end = Math.ceil(distance / 1000);
  const length = Math.ceil(Math.abs((end - start) / diff)) + 1;
  const ticks = Array.from(Array(length), (x, index) => start + index * diff);

  const markPoint = ({ activeTooltipIndex: index, isTooltipActive }) => {
    if (isTooltipActive === true && index) {
      const trackPoint = geoJson.geometry.coordinates[index];
      dispatch({ type: 'chart', data: trackPoint});
    }
  };

  return (
    <ResponsiveContainer 
      width="100%" 
      height={200}
    >
      <LineChart
        data={elevation}
        type="monotone"
        onMouseDown={(e) => markPoint(e)}
        onMouseMove={(e) => markPoint(e)}
      >
        <CartesianGrid strokeDasharray="3" stroke="#9CA3AF" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} label="" />
        <XAxis type="number" unit="km" dataKey="distance" stroke="#9CA3AF" domain={['dataMin', 'dataMax']} interval="preserveStart" ticks={ticks} />
        <YAxis type="number" unit="m" dataKey="elevation" stroke="#9CA3AF" />
        <Line type="monotone" dataKey="elevation" stroke="#3B82F6" strokeWidth={3} dot={false} />
        <Line type="monotone" dataKey="distance" strokeWidth={0} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default Charts;
