import { describe, expect, test } from 'vitest'
import app from '../helpers/fastify.js'

describe('User Authentication and Registration', () => {
  test('POST /account should register a new user successfully', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/account',
      payload: {
        name: 'user',
        email: 'newuser@example.com',
        password: 'newpass',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toHaveProperty('id')
  })

  test('should not register a user with an existing email', async () => {
    await app.inject({
      method: 'POST',
      url: '/account',
      payload: {
        name: 'user',
        email: 'existinguser@example.com',
        password: 'password',
      },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/account',
      payload: {
        name: 'user',
        email: 'existinguser@example.com',
        password: 'password',
      },
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toEqual({ error: 'User already exists' })
  })

  test('should login successfully with valid credentials', async () => {
    await app.inject({
      method: 'POST',
      url: '/account',
      payload: {
        name: 'user',
        email: 'loginuser@example.com',
        password: 'loginpass',
      },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/login',
      payload: { email: 'loginuser@example.com', password: 'loginpass' },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toHaveProperty('token')
  })

  test('should not login with invalid credentials', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/login',
      payload: { email: 'loginuser@example.com', password: 'wrongpassword' },
    })

    expect(response.statusCode).toBe(401)
    expect(response.json()).toEqual({ message: 'Invalid email or password' })
  })

  test('should not login with non-existent email', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/login',
      payload: { email: 'nonexistent@example.com', password: 'password' },
    })

    expect(response.statusCode).toBe(401)
    expect(response.json()).toEqual({ message: 'Invalid email or password' })
  })
})
