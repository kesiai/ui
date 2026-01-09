import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyButton } from '../my-button'

describe('MyButton', () => {
  it('renders children text correctly', () => {
    render(<MyButton>Click me</MyButton>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('applies default variant classes', () => {
    render(<MyButton>Default</MyButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary')
    expect(button).toHaveClass('text-primary-foreground')
  })

  it('applies outline variant classes', () => {
    render(<MyButton variant="outline">Outline</MyButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border')
    expect(button).toHaveClass('border-input')
  })

  it('applies ghost variant classes', () => {
    render(<MyButton variant="ghost">Ghost</MyButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('hover:bg-accent')
  })

  it('applies secondary variant classes', () => {
    render(<MyButton variant="secondary">Secondary</MyButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-secondary')
  })

  it('applies destructive variant classes', () => {
    render(<MyButton variant="destructive">Delete</MyButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })

  it('applies link variant classes', () => {
    render(<MyButton variant="link">Link</MyButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-primary')
    expect(button).toHaveClass('underline-offset-4')
  })

  it('applies default size classes', () => {
    render(<MyButton>Default Size</MyButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-10')
    expect(button).toHaveClass('px-4')
  })

  it('applies sm size classes', () => {
    render(<MyButton size="sm">Small</MyButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-9')
  })

  it('applies lg size classes', () => {
    render(<MyButton size="lg">Large</MyButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-11')
  })

  it('applies icon size classes', () => {
    render(<MyButton size="icon">Icon</MyButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-10')
    expect(button).toHaveClass('w-10')
  })

  it('merges custom className with variant classes', () => {
    render(<MyButton className="custom-class">Custom</MyButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('bg-primary')
  })

  it('passes through HTML button attributes', () => {
    render(<MyButton disabled>Disabled</MyButton>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<MyButton onClick={handleClick}>Click me</MyButton>)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be focused', () => {
    render(<MyButton>Focus me</MyButton>)
    const button = screen.getByRole('button')
    button.focus()
    expect(document.activeElement).toBe(button)
  })

  it('has visible focus state', () => {
    render(<MyButton>Focus</MyButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('focus-visible:outline-none')
    expect(button).toHaveClass('focus-visible:ring-2')
  })

  it('applies disabled state styles', () => {
    render(<MyButton disabled>Disabled</MyButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('disabled:opacity-50')
    expect(button).toHaveClass('disabled:pointer-events-none')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }

    render(<MyButton ref={ref as any}>Ref Button</MyButton>)

    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('combines variant and size correctly', () => {
    render(
      <MyButton variant="outline" size="lg">
        Combined
      </MyButton>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border')
    expect(button).toHaveClass('h-11')
  })
})
