import { orderQueue } from '../../queue/order.queue.js'

export async function queueOrder(
  type: 'buy' | 'sell',
  amount: number,
  userId: string,
  investmentId?: string,
) {
  await orderQueue.add({ type, amount, userId, investmentId })
}
