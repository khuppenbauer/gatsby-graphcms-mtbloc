import { default as React } from "react"
import { useConnector } from 'react-instantsearch-hooks-web';
import connectStats from 'instantsearch.js/es/connectors/stats/connectStats';


const useStats = (props) => {
  return useConnector(connectStats, props);
}

const Stats = (props) => {
  const {
    nbHits,
  } = useStats(props);
  return (
    <div className="py-3 md:py-5 pr-5">{nbHits} Touren</div>
  );
}

export default Stats;
