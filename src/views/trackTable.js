import React from "react";
import { useTable, useSortBy } from "react-table";
import convert from "convert-units"
import slugify from "@sindresorhus/slugify";
import { Link } from "gatsby"
import { ArrowUpRight, ChevronUp, ChevronDown } from 'react-feather';

const TrackTable = ({ tracks }) => {
  let hasFitness = false;
  let hasExperience = false;
  let hasDifficulty = false;
  const tableRows = tracks.map((track) => {
    const {
      name,
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
    return {
      name,
      distance: new Intl.NumberFormat("de-DE").format(distance.val.toFixed(2)),
      totalElevationGain,
      totalElevationLoss,
      difficulty,
      fitness,
      experience,
      startCity,
      link: <Link to={`/tracks/${slugify(name)}`} className="text-blue-400"><ArrowUpRight className="h-5 w-5" /></Link>,
    }
  });
  const data = React.useMemo(
    () => (tableRows),
    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Start',
        accessor: 'startCity',
      },
      {
        Header: 'Länge',
        accessor: 'distance',
      },
      {
        Header: 'Höhenmeter',
        accessor: 'totalElevationGain',
      },
      {
        Header: 'Tiefenmeter',
        accessor: 'totalElevationLoss',
      },
      {
        Header: 'Schwierigkeit',
        accessor: 'difficulty',
      },
      {
        Header: 'Kondition',
        accessor: 'fitness',
      },
      {
        Header: 'Erlebnis',
        accessor: 'experience',
      },
      {
        Header: '',
        accessor: 'link',
        canSort: false,
      }                                                  
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy)

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
                (id === 'experience' && !hasExperience)) {
                  return null;
                }
                return (
                  <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-2 py-3 title-font tracking-wider font-medium text-white text-sm bg-gray-800"
                >
                  <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                    {column.render('Header')}
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <ChevronDown className="h-5 w-5" />
                        : <ChevronUp className="h-5 w-5" />
                      : ''}
                  </span>
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
                  (id === 'experience' && !hasExperience)) {
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
