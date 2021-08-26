import { default as React } from "react"
import { connectStats } from 'react-instantsearch-dom';

const stats = connectStats((Stats) => {
    const { nbHits } = Stats;
    return (
      <div className="py-3 md:py-5 pr-5">{nbHits} Touren</div>
    )
  });

export default stats;
