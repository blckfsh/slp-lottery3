import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Web3 from 'web3'
import QRCode from 'qrcode'
// import { Transaction } from '@ethereumjs/tx'
import moment from 'moment'
import axios from 'axios'
import abiDecoder from 'abi-decoder'
import { useGlobalFilter, useTable, useSortBy, usePagination, } from 'react-table'
import { setIntervalAsync } from 'set-interval-async/dynamic'
import { clearIntervalAsync } from 'set-interval-async'

import SampleToken from '../abis/SampleToken.json'

import NavBar from '../components/main/navbar'
import Pool from '../components/main/pool'
import Chart from '../components/main/chart'
import WheelRoulette from '../components/main/wheel'
import Table from '../components/main/table'
import ShowWinner from '../components/main/show-winner'
import PayDetails from '../components/main/pay-details'


export const ContractContext = React.createContext()

function Main() {

// APIs
  const transaction_api = process.env.REACT_APP_TRANSACTION_API
  const all_transaction_api = process.env.REACT_APP_ALL_TRANSACTION_API
  const deposit_address_api = process.env.REACT_APP_DEPOSIT_ADDRESS_API
  const total_deposit_api = process.env.REACT_APP_TOTAL_DEPOSIT_API
  const previous_winner_api = process.env.REACT_APP_PREV_WINNER_API
  const portion_api = process.env.REACT_APP_PORTION_API

  const [isConnected, setIsConnected] = useState(false)
  const [,setLoadAccounts] = useState('')
  const [account, setAccount] = useState('')
  const [receiver, setReceiver] = useState('')
  const [privKey, setPrivKey] = useState('')
  const [,setOwner] = useState('')

  // blocks
  const [blockNum, setBlockNum] = useState(0)
  const [blockNumId, setBlockNumId] = useState('')

  // token
  const [,setSampleToken] = useState('')
  const [,setTokenBalance] = useState('')

  // table
  const [table, setTable] = useState([])
  const [allTable, setAllTable] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(true)

  // portion
  const [prizePercentage, setPrizePercentage] = useState(0)
  const [burnPercentage, setBurnPercentage] = useState(0)
  const [guildPercentage, setGuildPercentage] = useState(0)
  const [totalPool, setTotalPool] = useState('')
  const [pool, setPool] = useState('')

  // roulette wheel
  const [segment, setSegment] = useState([])
  const [mustSpin, setMustSpin] = useState(false)
  const [isLoadingEntries, setIsLoadingEntries] = useState(true)

  // modal
  const [prizeTxHash, setPrizeTxHash] = useState('')
  const [isModalWinnerOpen, setIsModalWinnerOpen] = useState(false)
  const [wallet_address, setWallet_Address] = useState('')

  // QRCode
  const [qrImgUrl, setQrImgUrl] = useState('')

  // test for auto-trigger function (pick winner)

  // react table
  // const [pageSizeOptions, setPageSizeOptions] = useState([3, 6, 9, 12, 15, 18, 21, 24, 27, 30])

  const countRef = useRef(segment)
  const poolRef = useRef(totalPool)
  const receiverRef = useRef(receiver)
  const privRef = useRef(privKey)
  const prizeRef = useRef(prizePercentage)
  const burnRef = useRef(burnPercentage)
  const guildRef = useRef(guildPercentage)
  const blockRef = useRef(blockNum)
  const blockIdRef = useRef(blockNumId)

  countRef.current = segment
  poolRef.current = totalPool
  receiverRef.current = receiver
  privRef.current = privKey
  prizeRef.current = prizePercentage
  burnRef.current = burnPercentage
  guildRef.current = guildPercentage
  blockRef.current = blockNum
  blockIdRef.current = blockNumId

  // Arrays
  const segments = []

  const addingPad = (num, size) => {
    let s = num+""
    while (s.length < size) s = '0' + s
    return s
  }

  // Adding validation in token amount
  // const handleChange = (event) => {
  //   const re = /^[0-9\b]+$/
  //
  //   if (event.target.value !== '' && re.test(event.target.value)) {
  //       setIsAcceptingToken(false)
  //      setAmount(event.target.value)
  //   } else {
  //     setIsAcceptingToken(true)
  //     setAmount(event.target.value)
  //   }
  // }

  const getNetworkId = async () => {
    const web3 = window.web3 // initialize web3js
    const networkId = await web3.eth.net.getId()

    return networkId
  }

  const getDefaultAccount = async () => {
    try {
      const web3 = window.web3 // initialize web3js
      const accounts = await web3.eth.getAccounts() // get default account

      setAccount(accounts[0])
      return accounts
    } catch {
      console.log('something went wrong - getDefaultAccount')
    }

  }

  const getReceiverAccount = async () => {
    let address
    let privK
    let status = 'Active'
    await fetch(`${deposit_address_api}/status/${status}`)
      .then(res => res.json())
      .then(res => {
        if (res) {
          address = res[0].wallet_address
          privK = res[0].privateKey
        }
      })

    setReceiver(address)
    setPrivKey(privK)
    return address
  }

  const loadTokenAddress = async () => {
    try {
      const netId = await getNetworkId()
      const tokenData = SampleToken.networks[netId]

      // console.log(tokenData.address) //THIS IS IMPORTANT
      return tokenData
    } catch {
      console.log('something went wrong - loadTokenAddress')
    }
  }

  const loadTokenData = async () => {
    const web3 = window.web3 // initialize web3js
    const netId = await getNetworkId()
    const tokenData = SampleToken.networks[netId]

    if (tokenData) {
      const token = new web3.eth.Contract(SampleToken.abi, tokenData.address)
      setSampleToken(token)

      return token
    } else {
      window.alert('Token contract not deployed to detected network')
    }
  }

  const getTokenBalanceOf = async () => {
    const token = await loadTokenData()
    const accounts = await getDefaultAccount()

    const tokenBalanceOf = await token.methods.balanceOf(accounts[0]).call()
    setTokenBalance(tokenBalanceOf)
  }

  const fetchPortion = useCallback(async () => {
    await fetch(portion_api)
      .then(res => res.json())
      .then(res => {
        if (res) {
          setPrizePercentage(res[res.length - 1].prize_percentage)
          setBurnPercentage(res[res.length - 1].burn_percentage)
          setGuildPercentage(res[res.length - 1].guild_percentage)
        }
      })
      //eslint-disable-next-line
  }, [prizePercentage, burnPercentage, guildPercentage])

  const getLotteryPool = useCallback(async () => {
    const web3 = window.web3 // initialize web3js
    const address = await getReceiverAccount()
    const token = await loadTokenData()
    const lotteryPool = await token.methods.balanceOf(address).call()

    if (lotteryPool) {
      let computePrizePool = parseFloat(lotteryPool) * parseFloat(prizeRef.current) / 100

      setTotalPool(web3.utils.fromWei(lotteryPool, 'Ether'))
      setPool(web3.utils.fromWei(computePrizePool.toString(), 'Ether'))
      return web3.utils.fromWei(computePrizePool.toString(), 'Ether')
    } else {
      setTotalPool(web3.utils.fromWei('0', 'Ether'))
      setPool(web3.utils.fromWei('0', 'Ether'))
      return web3.utils.fromWei('0', 'Ether')
    }
    //eslint-disable-next-line
  }, [prizePercentage, pool])

  const getLotteryOwner = async () => {
    const lotteryOwner = process.env.REACT_APP_OWNER_ADDRESS // owner wallet_address (the one who deployed the app)

    setOwner(lotteryOwner)
    return lotteryOwner
  }

  const pickWinner = async (entries, prize, receiver_address, passphrase) => {
    const web3 = window.web3 // initialize web3js
    const tokenData = await loadTokenAddress()
    const token = await loadTokenData()
    const newPrizeNumber = Math.floor(Math.random() * entries.length)
    const winner = entries[newPrizeNumber].option
    const burn = process.env.REACT_APP_BURN_ADDRESS // wallet_address for guild
    const guild = process.env.REACT_APP_GUILD_ADDRESS // wallet_address for burn

    let computePrizePool = parseFloat(prize) * parseFloat(prizeRef.current) / 100
    let computeBurnTokens = parseFloat(prize) * parseFloat(burnRef.current) / 100
    let computeGuildTokens = parseFloat(prize) * parseFloat(guildRef.current) / 100

    if (prize > 0) {
      // testing
      let count = await web3.eth.getTransactionCount(receiver_address)
      let data_winner = token.methods.transfer(winner, web3.utils.toWei(computePrizePool.toString(), 'Ether')).encodeABI()
      let data_burn = token.methods.transfer(burn, web3.utils.toWei(computeBurnTokens.toString(), 'Ether')).encodeABI()
      let data_guild = token.methods.transfer(guild, web3.utils.toWei(computeGuildTokens.toString(), 'Ether')).encodeABI()

      setWallet_Address(entries[newPrizeNumber].option)

      const rawTransaction4Winner = {
        nonce: web3.utils.toHex(count),
        from: receiver_address,
        gasPrice: web3.utils.toHex(2 * 1e9),
        gasLimit: web3.utils.toHex(500000),
        to: tokenData.address,
        value: 0,
        data: data_winner
      }

      const rawTransaction4Burn = {
        nonce: web3.utils.toHex(count + 1),
        from: receiver_address,
        gasPrice: web3.utils.toHex(2 * 1e9),
        gasLimit: web3.utils.toHex(500000),
        to: tokenData.address,
        value: 0,
        data: data_burn
      }

      const rawTransaction4Guild = {
        nonce: web3.utils.toHex(count + 2),
        from: receiver_address,
        gasPrice: web3.utils.toHex(2 * 1e9),
        gasLimit: web3.utils.toHex(500000),
        to: tokenData.address,
        value: 0,
        data: data_guild
      }

      let txHashForSendingPrize
      let txHashForSendingBurn
      let txHashForSendingGuild

      const signedTxWinner = await web3.eth.accounts.signTransaction(rawTransaction4Winner, passphrase)
      const signedTxBurn = await web3.eth.accounts.signTransaction(rawTransaction4Burn, passphrase)
      const signedTxGuild = await web3.eth.accounts.signTransaction(rawTransaction4Guild, passphrase)

      // console.log(rawTransaction4Winner)

      await web3.eth.sendSignedTransaction(signedTxWinner.rawTransaction).once('transactionHash', hash => txHashForSendingPrize = hash).then((res) => {
        // console.log(res)
        // console.log(txHashForSendingPrize)
        setPrizeTxHash(txHashForSendingPrize)

        deleteTransactions()

        web3.eth.sendSignedTransaction(signedTxBurn.rawTransaction).once('transactionHash', hash => txHashForSendingBurn = hash).then(
          web3.eth.sendSignedTransaction(signedTxGuild.rawTransaction).once('transactionHash', hash => txHashForSendingGuild = hash).then(
            // deleteTransactions()
          ).catch((e) => {
            // try {
              if (e.includes('not mined within 50 blocks')) {
                const handle = setInterval(() => {
                  web3.eth.getTransactionReceipt(txHashForSendingPrize).then((resp) => {
                    if (resp != null && resp.blockNumber > 0) {
                      clearInterval(handle)
                      console.log('signedTxGuild--' + txHashForSendingGuild)
                    }
                  })
                })
              }
            // } catch {
            //   console.log('error in catch -- 1')
            // }
          })
        ).catch((e) => {
          try {
            if (e.includes('not mined within 50 blocks')) {
              const handle = setInterval(() => {
                web3.eth.getTransactionReceipt(txHashForSendingBurn).then((resp) => {
                  if (resp != null && resp.blockNumber > 0) {
                    clearInterval(handle)
                    console.log('signedTxBurn--' + txHashForSendingBurn)
                  }
                })
              })
            }
          } catch {
            console.log('error in catch -- 2')
          }
        })
      }).catch((e) => {
        try {
          if (e.includes('not mined within 50 blocks')) {
            const handle = setInterval(() => {
              web3.eth.getTransactionReceipt(txHashForSendingGuild).then((resp) => {
                if (resp != null && resp.blockNumber > 0) {
                  clearInterval(handle)
                  console.log('signedTxWinner--' + txHashForSendingPrize)
                }
              })
            })
          }
        } catch {
          console.log('error in catch -- 3')
        }
      })

      saveTotalDeposit(computePrizePool.toString())
      saveWinner(entries[newPrizeNumber].option)

    } else {
      // window.alert('No Prize Pool')
    }
  }

  const saveTotalDeposit = async (jackpot) => {
    let newDeposit = {
      jackpot,
      date: moment().format("MMM Do YY")
    }

    await axios.post(total_deposit_api, newDeposit)
      .catch(error => console.log('something went wrong - saveTotalDeposit'))
  }

  const saveWinner = async (wallet_address) => {
    let newWinner = {
      wallet_address,
      date: moment().format("MMM Do YY")
    }

    await axios.post(previous_winner_api, newWinner)
      .catch(error => console.log('something went wrong - saveWinner'))
  }

  const stopPick = useCallback(async () => {
    setMustSpin(false)
    setIsModalWinnerOpen(true)
    getLotteryPool()
    //eslint-disable-next-line
  }, [mustSpin, isModalWinnerOpen])

  const closeWinnerModal = useCallback(async () => {
    setIsModalWinnerOpen(false)
    //eslint-disable-next-line
  }, [isModalWinnerOpen])

  // const closeQRModal = useCallback(async () => {
  //   setIsModalQROpen(false)
  // }, [isModalQROpen])

  const generateQRCode = useCallback(async () => {
    const address = await getReceiverAccount()

    try {
      const response = await QRCode.toDataURL(address)

      setQrImgUrl(response)
    } catch (error) {
      console.log('something went wrong - generateQRCode')
    }
    //eslint-disable-next-line
  }, [qrImgUrl])

  // test

  const getLatestBlockNumber = useCallback(async () => {
    await fetch(process.env.REACT_APP_BLOCK_API)
      .then(res => res.json())
      .then(res => {
        //eslint-disable-next-line
        res.map(item => {
          // console.log('latest:' + item.blockNumber)
          setBlockNumId(item._id)
          setBlockNum(item.blockNumber)
        })
    })
  }, [])

  const singleSolution = useCallback(async (currentBlock) => {
    try {
      const web3 = window.web3 // initialize web3js
      const tokenData = await loadTokenAddress()
      const address = tokenData.address
      const token = new web3.eth.Contract(SampleToken.abi, address)
      const block = await token.getPastEvents('Transfer', {
        fromBlock: currentBlock,
        toBlock: 'latest'
      })
      let newBlock = {
          blockNumber: parseInt(block[block.length - 1].blockNumber)
      }
      abiDecoder.addABI(SampleToken.abi) // initialize abi-decoder

      await getLatestBlockNumber()

      // console.log('what block we are getting: ' + currentBlock)
      // console.log('single: ' + blockIdRef.current)

      if (currentBlock > 0 && block != null) {
        // console.log('number of transactions fetched: ' + block.length)
        // console.log(block)
        await axios.patch(`${process.env.REACT_APP_BLOCK_API}/${blockIdRef.current}`, newBlock)

          block.map(async (item) => {
            let hash = await web3.eth.getBlock(item.blockNumber)
            let txHash = await web3.eth.getTransaction(item.transactionHash)

            // console.log(hash)

            if (address === txHash.to) {
                let decodeData = abiDecoder.decodeMethod(txHash.input)

                if (decodeData.name === 'transfer') {
                  // check if the receiver is the deposit address

                  if (decodeData.params[0].value === receiverRef.current.toLowerCase()) {
                    // fetch transactions
                    const get_all_transactions = await fetch(all_transaction_api).then(res => res.json())

                    // setup id
                    let fixedValue = 10010
                    let newValue
                    let id

                    newValue = fixedValue + (parseInt(get_all_transactions.length) + 1)
                    id = addingPad(newValue, 7)

                    // config timestamp
                    // console.log(new Date(parseInt(txData[count].timestamp)*1000))
                    let configDate = new Date(parseInt(hash.timestamp)*1000)
                    let newDate = moment(configDate.toUTCString()).format('l')
                    let txTransaction = {
                      display_id: id,
                      number: hash.number,
                      transactionHash: txHash.hash,
                      timestamp: newDate,
                      wallet_address: txHash.from,
                      amount: web3.utils.fromWei(decodeData.params[1].value, 'Ether'),
                      entry: web3.utils.fromWei(decodeData.params[1].value, 'Ether')
                    }

                    // insert in mongodb
                    const get_all_transaction_by_hash = await fetch(`${all_transaction_api}/${txHash.hash}`).then(res => res.json())

                    if (!get_all_transaction_by_hash) {
                      await axios.post(transaction_api, txTransaction)
                      await axios.post(all_transaction_api, txTransaction)
                    }
                  }
                }
            }
          })
      }
    } catch {
      console.log('Something went wrong - singleSolution please check')
    }

    //eslint-disable-next-line
  }, [])

  const fetchTransactions = useCallback(async () => {

    await fetch(transaction_api)
      .then(res => res.json())
      .then(res => {
        if (res) {
          setAllTable(res)
          setTable(res)
          setIsTableLoading(false)
        }
      })
      //eslint-disable-next-line
  }, [table, allTable, isTableLoading])

  const fetchPlayerEntries = useCallback(async () => {
    // setIsLoadingEntries(true)
    let configTx = []
    let walletArray = []
    let countEntries = 0

    await fetch(transaction_api)
      .then(res => res.json())
      .then(res => {
        segments.splice(0, segments.length)
        configTx.splice(0, configTx.length)
        walletArray.splice(0, walletArray.length)
        res.map(transaction => {
          let { wallet_address, entry } = transaction
          configTx.push({ wallet_address, entry })
          if (walletArray.includes(wallet_address) === false) walletArray.push(wallet_address)
          return transaction
        })

        walletArray.map(item => {
          countEntries = 0
          configTx.filter(txEntry => txEntry.wallet_address === item).map(res => {
            countEntries += parseFloat(res.entry)
            return res
          })
          for (let counter = 0; counter < parseInt(countEntries); counter++) {
            segments.push({ option: item })
          }
          return item
        })

        setSegment(segments)
        setIsLoadingEntries(false)
      })
      //eslint-disable-next-line
  }, [segment, isLoadingEntries])

  const deleteTransactions = () => {
    axios.delete(transaction_api)
      .catch(error => console.log('something went wrong - deleteTransactions'))
  }

  // using react table to display the transactions
  const data = useMemo(() => [...table], [table])

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
    const loadWeb3 = async () => {
      try {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          // await window.ethereum.enable()
          if (window.ethereum) {
            try {
              const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
              setLoadAccounts(accounts)

              if (accounts.length > 0) {
                setIsConnected(true)

                getNetworkId()
                loadTokenAddress()
                loadTokenData()

                getReceiverAccount()
                getTokenBalanceOf()
                getLotteryOwner()
                generateQRCode()
                fetchPortion()
                getLotteryPool()
                singleSolution(blockRef.current)
                fetchPlayerEntries()
                fetchTransactions()


                const timer = setIntervalAsync(async () => {
                  let timePick = moment().format('LT')
                  if (timePick === '10:00 AM' && parseFloat(poolRef.current) > 0) {
                    setMustSpin(true)
                    await pickWinner(countRef.current, poolRef.current, receiverRef.current, privRef.current)
                            .then(() => {
                              console.log('picked winner')
                            })
                            .catch(error => console.error)
                  }
                  fetchPortion()
                  getLotteryPool()
                  singleSolution(blockRef.current)
                  fetchTransactions()
                  fetchPlayerEntries()
                }, 60000)

                return async () => await clearIntervalAsync(timer)
              } else {
                setIsConnected(false)
              }
            } catch (error) {
              if (error.code === 4001) {
                // User rejected request
              }
              setIsConnected(false)
            }
          }
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
          window.alert('Non-Ethereum browser detected.')
        }
      } catch {
        console.log('we are working on this')
      }
    }

    loadWeb3()
    //eslint-disable-next-line
  }, [])



  return (
    <>
      <div className="cx-navbar d-flex justify-content-center align-items-center">
        <NavBar />
      </div>
      {
        isConnected ?
        <>
          <div className="d-flex justify-content-center align-items-center">
            <ContractContext.Provider value={{ pool }}>
              <Pool />
            </ContractContext.Provider>
          </div>
          <div className="cx-body mt-5 mb-5 d-flex flex-row flex-wrap">
            <div className="cx-content d-flex justify-content-center align-items-center">
              <Chart />
            </div>
            <div className="cx-content d-flex flex-column justify-content-between align-items-center">
              <ContractContext.Provider value={{ segment, mustSpin, stopPick, pool, account, receiver, isLoadingEntries }}>
                <WheelRoulette />
              </ContractContext.Provider>
            </div>
            <div className="cx-content cx-cta">
              <ContractContext.Provider value={{ qrImgUrl, receiver }}>
                <PayDetails />
              </ContractContext.Provider>
            </div>
          </div>
          <div className="d-flex mt-5 mb-5 justify-content-center align-items-center">
            <ContractContext.Provider
              value={{
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
              <Table />
            </ContractContext.Provider>
          </div>
        </>
         :
        <div className="cx-not-connected d-flex justify-content-center align-items-center text-center">
          <h1>Connect your wallet and refresh the page.</h1>
        </div>
      }

      <ContractContext.Provider value={{ wallet_address, closeWinnerModal, isModalWinnerOpen, prizeTxHash }}>
        <ShowWinner />
      </ContractContext.Provider>
    </>
  )
}

export default Main
