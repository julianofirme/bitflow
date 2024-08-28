/* eslint-disable @typescript-eslint/no-misused-promises */
import axios from 'axios'

export async function fetchTickerData() {
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
