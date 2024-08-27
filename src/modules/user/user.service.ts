import { db } from '../../lib/prisma.js'
import { hashPassword } from '../../utils/hash.js'
import { type CreateUserInput } from './user.schema.js'

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input

  const { hash, salt } = hashPassword(password)

  const user = await db.user.create({
    data: { ...rest, salt, passwordHash: hash },
  })

  return user
}

export async function findUserByEmail(email: string) {
  return await db.user.findUnique({
    where: {
      email,
    },
  })
}
