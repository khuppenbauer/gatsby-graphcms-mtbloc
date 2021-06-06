import React from "react";
import { graphql } from "gatsby";

const TrackPage = ({ data: { track } }) => {
  const { 
    name, 
    startCity, 
    startTime, 
    totalElevationGain, 
    totalElevationLoss, 
    distance, 
    elevHigh, 
    elevLow,
  } = track;
  return (
    <div>
      Name: {name}<br />
      Start: {startCity}<br />
      Datum: {startTime}<br />
      Höhenmeter: {totalElevationGain}<br />
      Tiefenmeter: {totalElevationLoss}<br />
      Distanz: {distance}<br />
      Höchster Punkt: {elevHigh}<br />
      Tiefster Punkt: {elevLow}<br />
    </div>
  );
};

export const pageQuery = graphql`
  query TrackPageQuery($name: String!) {
    track: graphCmsTrack(name: { eq: $name }) {
      name
      startCity
      startTime
      totalElevationGain
      totalElevationLoss
      distance
      elevHigh
      elevLow
    }
  }
`;

export default TrackPage;