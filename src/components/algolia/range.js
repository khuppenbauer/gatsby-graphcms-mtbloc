import React, { useState } from 'react';
import convert from "convert-units"
import { useConnector } from 'react-instantsearch-hooks-web';
import connectRange from 'instantsearch.js/es/connectors/range/connectRange';
import { EuiDualRange, useGeneratedHtmlId } from '@elastic/eui'
import '@elastic/eui/dist/eui_theme_light.css';

export function useRangeSlider(props) {
  return useConnector(connectRange, props);
}

const convertTo = (attribute, value) => {
  let number;
  let unit;
  switch (attribute) {
    case 'distance':
      const distance = convert(value).from("m").toBest()
      number = new Intl.NumberFormat("de-DE").format(distance.val.toFixed(2))
      unit = distance.unit
      return `${number} ${unit}`;
    case 'totalElevationGain':
    case 'totalElevationLoss':
      number = new Intl.NumberFormat("de-DE").format(value)
      unit = 'm';
      return `${number} ${unit}`;
    default:
      return value;
  }
}

const Range = (props) => {
  const { attribute } = props;
  const { range, refine, start } = useRangeSlider(props);
  const { min, max } = range;
  const minValue = Number.isInteger(start[0]) ? start[0] : min;
  const maxValue = Number.isInteger(start[1]) ? start[1] : max;
  const [dualValue, setDualValue] = useState([minValue, maxValue]);
  const basicRangeId = useGeneratedHtmlId({ prefix: 'basicRange' });
  return (
    <>
      { min !== minValue || max !== maxValue ? (
        <div className="flex justify-between">
          <div className="text-sm text-white">{convertTo(attribute, minValue)}</div>
          <div className="text-sm text-white">{convertTo(attribute, maxValue)}</div>
        </div>
      ) : null }
      <EuiDualRange
        id={basicRangeId}
        min={min}
        max={max}
        value={dualValue}
        compressed
        isDraggable
        onChange={(value) => {
          const customMin = value[0] || min;
          const customMax = value[1] || max;
          setDualValue([customMin, customMax]);
          refine([customMin, customMax]);
        }}
      />
      <div className="flex justify-between">
        <div className="text-sm">{convertTo(attribute, min)}</div>
        <div className="text-sm">{convertTo(attribute, max)}</div>
      </div>
    </>    
  );
}

export default Range;
