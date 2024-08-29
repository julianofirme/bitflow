import { describe, it, expect } from 'vitest'
import { models } from '../../../modules/user/user.schema.js'

const {
  createUserResponseSchema,
  createUserSchema,
  loginResponseSchema,
  loginSchema,
} = models

describe('User Schemas', () => {
  describe('createUserSchema', () => {
    it('should validate a correct user input', () => {
      const validUserInput = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      }

      const result = createUserSchema.safeParse(validUserInput)
      expect(result.success).toBe(true)
    })

    it('should invalidate an input with a missing password', () => {
      const invalidUserInput = {
        email: 'test@example.com',
        name: 'Test User',
      }

      const result = createUserSchema.safeParse(invalidUserInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe('Password is required')
    })

    it('should invalidate an input with an invalid email', () => {
      const invalidUserInput = {
        email: 'not-an-email',
        name: 'Test User',
        password: 'password123',
      }

      const result = createUserSchema.safeParse(invalidUserInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe('Invalid email')
    })
  })

  describe('createUserResponseSchema', () => {
    it('should validate a correct user response', () => {
      const validUserResponse = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      }

      const result = createUserResponseSchema.safeParse(validUserResponse)
      expect(result.success).toBe(true)
    })

    it('should invalidate a response with a missing id', () => {
      const invalidUserResponse = {
        email: 'test@example.com',
        name: 'Test User',
      }

      const result = createUserResponseSchema.safeParse(invalidUserResponse)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe('Required')
    })
  })

  describe('loginSchema', () => {
    it('should validate a correct login input', () => {
      const validLoginInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = loginSchema.safeParse(validLoginInput)
      expect(result.success).toBe(true)
    })

    it('should invalidate a login input with a missing password', () => {
      const invalidLoginInput = {
        email: 'test@example.com',
      }

      const result = loginSchema.safeParse(invalidLoginInput)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe('Password is required')
    })
  })

  describe('loginResponseSchema', () => {
    it('should validate a correct login response', () => {
      const validLoginResponse = {
        token: 'some-token',
      }

      const result = loginResponseSchema.safeParse(validLoginResponse)
      expect(result.success).toBe(true)
    })

    it('should invalidate a response with a missing token', () => {
      const invalidLoginResponse = {}

      const result = loginResponseSchema.safeParse(invalidLoginResponse)
      expect(result.success).toBe(false)
      expect(result.error?.errors[0].message).toBe('Required')
    })
  })
})
