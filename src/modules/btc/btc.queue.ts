import { orderQueue } from '../../queue/order.queue.js'
import { validateUserBalance } from './btc.service.js'

export async function queueOrder(
  type: 'buy' | 'sell',
  amount: number,
  userId: string,
) {
  await validateUserBalance(userId, amount)

  await orderQueue.add({ type, amount, userId })
}
