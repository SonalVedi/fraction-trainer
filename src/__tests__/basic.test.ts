import { describe, it, expect } from 'vitest'

describe('basic sanity check', () => {
  it('adds numbers correctly', () => {
    const sum = 1 + 2
    expect(sum).toBe(3)
  })
})
