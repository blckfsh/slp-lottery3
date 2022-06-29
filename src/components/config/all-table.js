import React, { useContext } from 'react'
import { ContractContext } from '../../containers/config'

function AllTable() {

  const {
    isTableLoading,
    getTableProps,
    headerGroups,
    getTableBodyProps,
    prepareRow,
    page,
    previousPage,
    canPreviousPage,
    nextPage,
    canNextPage,
    pageIndex,
    pageOptions
  } = useContext(ContractContext)
  // console.log('rendering table')

  return (
    <div className="cx-table">
      {
        isTableLoading === true ?
        <div className="d-flex justify-content-center">
          Loading data...
        </div> :
        page.length > 0 ?
        <>
          <p>History from all deposits:</p>
          <table {...getTableProps()} className="table table-bordered text-center">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      {column.isSorted ? (column.isSortedDesc ? <i className="fas fa-arrow-down text-secondary float-right"></i> : <i className="fas fa-arrow-up text-secondary float-right"></i>) : ''}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {
                page.map((row, i) => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      })}
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="cx-pagination d-flex flex-row space-in-between justify-content-center">
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous Page
            </button>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              Next Page
            </button>
            <div className="ms-3">
              Page{' '}
              <em>
                {pageIndex + 1} of {pageOptions.length}
              </em>
            </div>
         </div>
        </> :
        <table className="table table-bordered text-center">
          <tbody>
            <tr>
              <td>No players found.</td>
            </tr>
          </tbody>
        </table>
      }
    </div>
  )
}

export default AllTable
