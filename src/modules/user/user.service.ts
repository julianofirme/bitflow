import { db } from '../../lib/prisma.js'
import { hashPassword } from '../../utils/hash.js'
import { type CreateUserInput } from './user.schema.js'

export async function createUserWithWalletService(input: CreateUserInput) {
  return db.$transaction(async (transaction) => {
    const { password, ...rest } = input
    const { hash, salt } = hashPassword(password)

    const user = await transaction.user.create({
      data: { ...rest, salt, passwordHash: hash },
    })

    const wallet = await transaction.wallet.create({
      data: {
        amount: 0,
        userId: user.id,
      },
    })

    return { user, wallet }
  })
}

export async function findUserByEmailService(email: string) {
  return db.user.findUnique({
    where: { email },
  })
}

export async function findUserByIdService(id: string) {
  return db.user.findUnique({
    where: { id },
  })
}
