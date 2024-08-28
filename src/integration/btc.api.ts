/* eslint-disable @typescript-eslint/no-misused-promises */
import axios from 'axios'

interface TickerData {
  high: string
  low: string
  vol: string
  last: string
  buy: string
  sell: string
  open: string
  date: number
  pair: string
}

export async function fetchTickerData(): Promise<TickerData> {
  try {
    const response = await axios.get(
      'https://www.mercadobitcoin.net/api/BTC/ticker/',
    )
    return response.data.ticker
  } catch (error) {
    console.error('Error to get BTC value:', error)
    throw error
  }
}
