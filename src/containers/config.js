import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Web3 from 'web3'
import moment from 'moment'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useGlobalFilter, useTable, useSortBy, usePagination } from 'react-table'

import NavBar from '../components/main/navbar'
import DepositAddress from '../components/config/deposit-address'
import TotalDeposit from '../components/config/total-deposit'
import PreviousWinner from '../components/config/previous-winner'
import Portions from '../components/config/portions'
import AllTable from '../components/config/all-table'
import Toaster from '../components/toastify/toaster'

export const ContractContext = React.createContext()

function Config() {

  let navigate = useNavigate()

  // APIs
  const all_transaction_api = process.env.REACT_APP_ALL_TRANSACTION_API
  const deposit_address_api = process.env.REACT_APP_DEPOSIT_ADDRESS_API
  const total_deposit_api = process.env.REACT_APP_TOTAL_DEPOSIT_API
  const previous_winner_api = process.env.REACT_APP_PREV_WINNER_API
  const portion_api = process.env.REACT_APP_PORTION_API

  const [,setLoadAccounts] = useState('')

  // deposit address
  const [id, setId] = useState('')
  const [depositAddress, setDepositAddress] = useState('')
  const [privKey, setPrivKey] = useState('')

  // all table
  const [allTable, setAllTable] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(true)

  // previous winner
  const [previousWinner, setPreviousWinner] = useState('')

  // total deposit
  const [startDate, setStartDate] = useState(new Date())
  const [deposit, setDeposit] = useState(0)

  // portion
  const [portionId, setPortionId] = useState(0)
  const [prize, setPrize] = useState(0)
  const [burn, setBurn] = useState(0)
  const [guild, setGuild] = useState(0)

  // react table
  // const [pageSizeOptions, setPageSizeOptions] = useState([3, 6, 9, 12, 15, 18, 21, 24, 27, 30])

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      // await window.ethereum.enable()
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
          setLoadAccounts(accounts)
        } catch (error) {
          if (error.code === 4001) {
            // User rejected request
          }
          window.alert('Error connecting to account')
        }
      }
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying Metamask!')
    }
  }

  const getDefaultAccount = useCallback(async () => {
    const web3 = window.web3 // initialize web3js
    const accounts = await web3.eth.getAccounts() // get default account
    // const accountsOnEnable = await window.ethereum.request({method: 'eth_requestAccounts'})

    if (accounts[0] !== process.env.REACT_APP_OWNER_ADDRESS) navigate('/')
  }, [navigate])

  const fetchDepositAddress = useCallback(async () => {
    await fetch(deposit_address_api)
      .then(res => res.json())
      .then(res => {
        if (res) {

          res.map(address => {
              if (address.status === 'Active') {
                setId(address._id)
                setDepositAddress(address.wallet_address)
                setPrivKey(address.privateKey)
              }
              return address
          })
        }
      })
      //eslint-disable-next-line
  }, [depositAddress])

  const addDepositAddress = useCallback(async (wallet_address, privateKey) => {
    let allWalletAddress = {
      status: 'Inactive'
    }
    let newDepositAddress = {
      wallet_address,
      privateKey
    }

    // UPDATE All status to Inactive
    await axios.patch(deposit_address_api, allWalletAddress)
      .catch(error => console.log('something went wrong'))

    // CREATE the new wallet address
    let execute = new Promise(async (resolve, reject) => {
      await fetch(`${deposit_address_api}/wallet/${wallet_address}`)
        .then(res => res.json())
        .then(res => {
          setTimeout(resolve, 3000)

          if (res.length === 0) {
            axios.post(deposit_address_api, newDepositAddress)
              .then(res => {
                fetch(deposit_address_api)
                  .then(res => res.json())
                  .then(res => {
                    setId(res[res.length -1]._id)
                    setDepositAddress(res[res.length - 1].wallet_address)
                  })
                  .catch(error => console.log('something went wrong'))
              })
              .catch(error => console.log('something went wrong'))
          }
        })
        .catch(error => console.log('something went wrong'))
    })
    toast.promise(execute, {
      pending: 'Adding Deposit Address...',
      success: 'Deposit Address was successfully added',
      error: 'Deposit Address was not successfully added'
    })
    //eslint-disable-next-line
  }, [])

  const updateDepositAddress = useCallback(async (id, walletAddress, privateKey) => {
    let depositAddress = {
      wallet_address: walletAddress,
      privateKey,
      status: 'Active'
    }

    let execute = new Promise(async (resolve, reject) => {
      await axios.patch(`${deposit_address_api}/${id}`, depositAddress)
      .then(res => setTimeout(resolve, 3000))
      .catch(error => console.log('something went wrong'))
    })
    toast.promise(execute, {
      pending: 'Updating Deposit Address...',
      success: 'Deposit Address was successfully updated',
      error: 'Deposit Address was not successfully updated'
    })
    //eslint-disable-next-line
  }, [])

  const fetchAllTransactions = useCallback(async () => {
    await fetch(all_transaction_api)
      .then(res => res.json())
      .then(res => {
        if (res) {

          setAllTable(res)
          setIsTableLoading(false)
        }
      })
      //eslint-disable-next-line
  }, [allTable, isTableLoading])

  const deleteDepositAddress = useCallback(async (id) => {
    let execute = new Promise(async (resolve, reject) => {
      await axios.delete(`${deposit_address_api}/${id}`)
        .then(res => {
            setTimeout(resolve, 3000)
            fetch(deposit_address_api)
              .then(res => res.json())
              .then(res => {
                if (res) {
                  res.filter(item => item._id !== id).map(item => {
                    setId(res[res.length -1]._id)
                    setDepositAddress(res[res.length - 1].wallet_address)

                    updateDepositAddress(res[res.length -1]._id, res[res.length - 1].wallet_address)
                      .catch(error => console.log('something went wrong'))

                    return item
                  })
                }
              })
        })
        .catch(error => console.log('something went wrong'))
    })
    toast.promise(execute, {
      pending: 'Deleting Deposit Address...',
      success: 'Deposit Address was successfully deleted',
      error: 'Deposit Address was not successfully deleted'
    })
    //eslint-disable-next-line
  }, [])

  const fetchTotalDeposit = useCallback(async (value) => {
    let selected_date = moment(value).format('MMM Do YY')

    // setStartDate(value)
    await fetch(`${total_deposit_api}/${selected_date}`)
      .then(res => res.json())
      .then(res => {
        try {
            if (res) setDeposit(res[0].jackpot)
        } catch {
          setDeposit(0)
        }
      })
      //eslint-disable-next-line
  }, [startDate])

  const fetchPreviousWinner = async () => {
    await fetch(previous_winner_api)
      .then(res => res.json())
      .then(res => {
          setPreviousWinner(res[res.length - 1].wallet_address)
      })
      .catch(error => console.log('something went wrong'))
  }

  const fetchPortions = useCallback(async () => {
    await fetch(portion_api)
      .then(res => res.json())
      .then(res => {
        if (res) {
          setPortionId(res[res.length - 1]._id)
          setPrize(res[res.length - 1].prize_percentage)
          setBurn(res[res.length - 1].burn_percentage)
          setGuild(res[res.length - 1].guild_percentage)
        }
      })
      //eslint-disable-next-line
  }, [prize, burn, guild])

  const updatePortions = useCallback(async (id, prize_percentage, burn_percentage, guild_percentage) => {
    let updatedPortion = {
      prize_percentage,
      burn_percentage,
      guild_percentage
    }


    await axios.patch(`${portion_api}/${id}`, updatedPortion)
      .catch(error => console.log('something went wrong'))
    //eslint-disable-next-line
  }, [])

  // using react table to display the transactions
  const data = useMemo(() => [...allTable], [allTable])

  const columns = useMemo(() => [
    {
      Header: 'Id',
      accessor: 'display_id'
    },
    {
      Header: 'Date',
      accessor: 'timestamp'
    },
    {
      Header: 'Address',
      accessor: 'wallet_address'
    },
    {
      Header: 'Amount',
      accessor: 'amount'
    },
    {
      Header: 'Entry',
      accessor: 'entry'
    },
    {
      Header: 'Status',
      accessor: 'status'
    }
  ], [])

  const tableInstance = useTable({ columns, data, initialState: { pageIndex: 0, pageSize: 3 }}, useGlobalFilter, useSortBy, usePagination)

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    pageOptions,
    page,
    state: { pageIndex },
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
  }  = tableInstance

  useEffect(() => {
    let currentDate = new Date()
    loadWeb3()
    getDefaultAccount()
    fetchAllTransactions()
    fetchDepositAddress()
    fetchTotalDeposit(currentDate)
    fetchPreviousWinner()
    fetchPortions()
    //eslint-disable-next-line
  }, [navigate]) //eslint-disable-next-line

  return (
    <>
      <div className="cx-navbar d-flex justify-content-center align-items-center">
        <NavBar />
      </div>
      <div className="cx-body d-flex flex-column">
        <div className="cx-content cx-w-100 mt-5">
          <ContractContext.Provider value={{ id, depositAddress, setDepositAddress, privKey, setPrivKey, fetchDepositAddress, addDepositAddress, updateDepositAddress, deleteDepositAddress }}>
            <DepositAddress />
          </ContractContext.Provider>
        </div>
        <div className="cx-content mt-5">
          <ContractContext.Provider value={{ startDate, setStartDate, deposit, fetchTotalDeposit }}>
            <TotalDeposit />
          </ContractContext.Provider>
        </div>
        <div className="cx-content mt-5">
          <ContractContext.Provider value={{ previousWinner }}>
            <PreviousWinner />
          </ContractContext.Provider>
        </div>
        <div className="cx-content cx-w-50 mt-5">
          <ContractContext.Provider value={{ portionId, prize, burn, guild, setPrize, setBurn, setGuild, updatePortions }}>
            <Portions />
          </ContractContext.Provider>
        </div>
      </div>
      <div className="d-flex mt-5 mb-5 justify-content-center align-items-center">
        <ContractContext.Provider
          value={{
            allTable,
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
          }}>
          <AllTable />
        </ContractContext.Provider>
        <Toaster />
      </div>
    </>
  )
}

export default Config
