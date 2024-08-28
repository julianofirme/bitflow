import { BadRequestError } from '../../errors/bad-request-error.js'
import { db } from '../../lib/prisma.js'
import { hashPassword } from '../../utils/hash.js'
import { type CreateUserInput } from './user.schema.js'

export async function createUserWithWalletService(input: CreateUserInput) {
  return db.$transaction(async (transaction) => {
    const { password, ...rest } = input
    const { hash, salt } = hashPassword(password)

    const isUserExists = await findUserByEmailService(input.email)

    if (isUserExists) {
      throw new BadRequestError('User already exists')
    }

    const user = await transaction.user.create({
      data: { ...rest, salt, passwordHash: hash },
    })

    const wallet = await transaction.wallet.create({
      data: {
        amount: 0,
        amount_btc: 0,
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
