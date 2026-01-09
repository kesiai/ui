import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn (className utility)', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles undefined and null values', () => {
    expect(cn('foo', undefined, 'bar', null)).toBe('foo bar')
  })

  it('removes conflicting Tailwind classes', () => {
    // Tailwind merge should remove conflicting classes
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('handles conditional classes with clsx', () => {
    expect(cn('base-class', true && 'active', false && 'inactive')).toBe(
      'base-class active'
    )
  })

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
  })

  it('handles objects with conditional classes', () => {
    expect(cn({
      'foo': true,
      'bar': false,
      'baz': true
    })).toBe('foo baz')
  })

  it('combines multiple types of inputs', () => {
    expect(cn(
      'base',
      ['array-class'],
      { 'conditional': true, 'removed': false },
      'string-class'
    )).toBe('base array-class conditional string-class')
  })

  it('handles empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn(null, undefined)).toBe('')
  })

  it('handles complex Tailwind conflicts', () => {
    expect(cn('px-4 py-2', 'px-8')).toBe('py-2 px-8')
    expect(cn('w-full h-full', 'w-1/2')).toBe('h-full w-1/2')
  })

  it('maintains last class for conflicts', () => {
    // The last class should win in conflicts
    expect(cn('text-sm', 'text-lg', 'text-xl')).toBe('text-xl')
  })

  it('handles responsive variants correctly', () => {
    expect(cn('text-sm md:text-lg', 'text-base')).toBe('md:text-lg text-base')
  })

  it('preserves important classes', () => {
    expect(cn('!text-red-500', '!text-blue-500')).toBe('!text-blue-500')
  })
})
