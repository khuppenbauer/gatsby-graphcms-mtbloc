import React from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import convert from "convert-units"
import { Link } from "gatsby"
import { 
  ChevronUp, ChevronDown, 
  ArrowUpCircle, ArrowDownCircle, ArrowRightCircle, ArrowUpRight,
} from 'react-feather';
import { matchSorter } from 'match-sorter'

const InputColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
      className="rounded-md text-xs px-3 py-2 border bg-gray-800 border-gray-500 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 w-32"
      placeholder={`Suche ${count} Touren...`}
    />
  )
}

const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
      className="rounded-md text-xs bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Alle</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

fuzzyTextFilterFn.autoRemove = val => !val

const TrackTable = ({ tracks, subCollections }) => {
  let hasFitness = false;
  let hasExperience = false;
  let hasDifficulty = false;
  let hasCollection = false;
  if (subCollections.length > 0) {
    hasCollection = true;
    subCollections.forEach((collectionItem) => {
    collectionItem.tracks.forEach((track) => {
      tracks.push({...track, collection: collectionItem.name});
    })
  })
  }
  const tableRows = tracks.map((track) => {
    const {
      collection,
      title,
      slug,
      totalElevationGain,
      totalElevationLoss,
      difficulty,
      fitness,
      experience,
      startCity,
    } = track;
    if (difficulty) {
      hasDifficulty = true;
    }
    if (fitness) {
      hasFitness = true;
    }
    if (experience) {
      hasExperience = true;
    }
    const distance = convert(track.distance).from("m").toBest();
    const link = <Link to={`/tracks/${slug}`} className="text-blue-400"><ArrowUpRight className="h-5 w-5" /></Link>;
    return {
      collection,
      link,
      title,
      distance: new Intl.NumberFormat("en-US").format(distance.val.toFixed(2)),
      totalElevationGain,
      totalElevationLoss,
      difficulty,
      fitness,
      experience,
      startCity,
    }
  });

  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
    }),
    []
  )

  const data = React.useMemo(
    () => (tableRows),
    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Sammlung',
        accessor: 'collection',
        Filter: InputColumnFilter,
        filter: 'fuzzyText',
      },
      {
        Header: '',
        accessor: 'link',
      },
      {
        Header: 'Name',
        accessor: 'title',
        Filter: InputColumnFilter,
        filter: 'fuzzyText',
      },
      {
        Header: 'Start',
        accessor: 'startCity',
        Filter: InputColumnFilter,
        filter: 'fuzzyText',
      },
      {
        Header: <ArrowRightCircle className="h-5 w-5" />,
        accessor: 'distance',
      },
      {
        Header: <ArrowUpCircle className="h-5 w-5" />,
        accessor: 'totalElevationGain',
      },
      {
        Header: <ArrowDownCircle className="h-5 w-5" />,
        accessor: 'totalElevationLoss',
      },
      {
        Header: 'Schwierigkeit',
        accessor: 'difficulty',
        Filter: SelectColumnFilter,
        filter: 'equals',
      },
      {
        Header: 'Kondition',
        accessor: 'fitness',
        Filter: SelectColumnFilter,
        filter: 'equals',
      },
      {
        Header: 'Erlebnis',
        accessor: 'experience',
        Filter: SelectColumnFilter,
        filter: 'equals',
      },                                                 
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data, filterTypes }, useFilters, useSortBy)

  return (
    
    <div className="flex flex-wrap w-full mx-auto overflow-auto">
      <table {...getTableProps()} className="table-auto w-full text-left whitespace-no-wrap">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {
                const { id } = column;
                if ((id === 'difficulty' && !hasDifficulty) ||
                (id === 'fitness' && !hasFitness) ||
                (id === 'experience' && !hasExperience) || 
                (id === 'collection' && !hasCollection)) {
                  return null;
                }
                return (
                  <th
                    {...column.getHeaderProps()}
                    className="px-2 py-3 bg-gray-800 align-top"
                  >
                    <span
                      {...column.getSortByToggleProps()}
                      className="inline-flex items-center lg:mr-auto md:mr-0 mr-auto"
                    >
                      {column.render('Header')}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? <ChevronDown className="h-5 w-5" />
                          : <ChevronUp className="h-5 w-5" />
                        : ''}
                    </span>
                    {column.filter ? (
                      <>
                        <div className="mt-5">
                          {column.render('Filter')}
                        </div>
                      </>
                    ) : null}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  const { id } = cell.column;
                  if ((id === 'difficulty' && !hasDifficulty) ||
                  (id === 'fitness' && !hasFitness) ||
                  (id === 'experience' && !hasExperience) ||
                  (id === 'collection' && !hasCollection)) {
                    return null;
                  }
                  return (
                    <td
                      className="px-2 py-3 border-b-2 border-gray-800"
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TrackTable;
