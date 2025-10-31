
import { describe, it, expect } from 'vitest'
import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('Fraction Trainer smoke', () => {
  it('renders and toggles tabs', () => {
    render(<App />)
    expect(screen.getByText(/Fraction Practice/i)).toBeInTheDocument()
    fireEvent.click(screen.getByText(/Timed Test/i))
    expect(screen.getByText(/Timed Test/i)).toBeInTheDocument()
  })
})
