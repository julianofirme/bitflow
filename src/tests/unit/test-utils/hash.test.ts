import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../../../utils/hash.js'

describe('Password Utils', () => {
  it('should hash a password correctly', () => {
    const password = 'testPassword'
    const { hash, salt } = hashPassword(password)

    expect(hash).toBeDefined()
    expect(salt).toBeDefined()

    expect(hash).not.toBe(password)
  })

  it('should verify the password correctly', () => {
    const password = 'testPassword'
    const { hash, salt } = hashPassword(password)

    const isPasswordCorrect = verifyPassword({
      candidatePassword: password,
      salt,
      hash,
    })
    expect(isPasswordCorrect).toBe(true)

    const isPasswordIncorrect = verifyPassword({
      candidatePassword: 'wrongPassword',
      salt,
      hash,
    })
    expect(isPasswordIncorrect).toBe(false)
  })

  it('should generate different salts and hashes for the same password', () => {
    const password = 'testPassword'

    const { hash: hash1, salt: salt1 } = hashPassword(password)
    const { hash: hash2, salt: salt2 } = hashPassword(password)

    expect(salt1).not.toBe(salt2)

    expect(hash1).not.toBe(hash2)
  })
})
