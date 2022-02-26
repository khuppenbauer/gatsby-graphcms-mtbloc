import React from "react"
import convert from "convert-units"
import { ArrowUpCircle, ArrowDownCircle, ArrowRightCircle } from "react-feather"

export const convertMetaData = (metaData) => {
  const distance = convert(metaData.distance).from("m").toBest()
  const number = new Intl.NumberFormat("de-DE").format(distance.val.toFixed(2))
  const unit = distance.unit
  const totalElevationGain = new Intl.NumberFormat("de-DE").format(
    metaData.totalElevationGain
  )
  const totalElevationLoss = new Intl.NumberFormat("de-DE").format(
    metaData.totalElevationLoss
  )
  let elevLow;
  if (metaData.elevLow) {
    elevLow = new Intl.NumberFormat("de-DE").format(
      metaData.elevLow
    )    
  }
  let elevHigh;
  if (metaData.elevHigh) {
    elevHigh = new Intl.NumberFormat("de-DE").format(
      metaData.elevHigh
    )    
  }
  return {
    distance: `${number} ${unit}`,
    totalElevationGain: `${totalElevationGain} m`,
    totalElevationLoss: `${totalElevationLoss} m`,
    elevLow: `${elevLow} m`,
    elevHigh: `${elevHigh} m`,
  };
};

export const renderMetaData = (metaData) => {
  const { distance, totalElevationGain, totalElevationLoss } = convertMetaData(metaData);
  return (
    <>
      <span className="text-gray-500 inline-flex items-center whitespace-nowrap lg:mr-auto md:mr-0 mr-auto leading-none text-sm py-1">
        <ArrowRightCircle className="w-4 h-4 mr-1" />
        {distance}
      </span>
      <span className="text-gray-500 inline-flex items-center whitespace-nowrap lg:mr-auto md:mr-0 mr-auto leading-none text-sm py-1">
        <ArrowUpCircle className="w-4 h-4 mr-1" />
        {totalElevationGain}
      </span>
      <span className="text-gray-500 inline-flex items-center whitespace-nowrap lg:mr-auto md:mr-0 mr-auto leading-none text-sm py-1">
        <ArrowDownCircle className="w-4 h-4 mr-1" />
        {totalElevationLoss}
      </span>
    </>  
  );
}
