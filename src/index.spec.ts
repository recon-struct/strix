import { describe, expect, it } from 'bun:test'
import strix from './index'

describe('strix', () => {
  it('It should kick ass and take names', () => {
    const expected = 'Kick ass and take names.'
    const t = strix({
      motto: 'Kick {{this}} and take {{that}}.',
    } as const)
    const actual = t('motto', { this: 'ass', that: 'names' } as const)

    expect(actual).toBe(expected)
  })

  it('It should allow for setting different capture settings', () => {
    const expected = 'We are the champions!'
    const t = strix(
      {
        anthem: 'We are the ::title::!',
      } as const,
      { start: '::', end: '::' } as const,
    )
    const actual = t('anthem', { title: 'champions' } as const)

    expect(actual).toBe(expected)
  })

  it('It should support templates that contain no variables', () => {
    const expected = 'I am a template string'
    const t = strix({
      template: 'I am a template string',
    } as const)
    const actual = t('template')
    expect(actual).toBe(expected)
  })

  it('should support nesting', () => {
    const aa = 'aa'
    const ab = 'ab'
    const ac = 'ac'
    const ba = 'ba'
    const bb = 'bb'
    const bc = 'bc'
    const ca = 'ca'
    const cb = 'cb'
    const cc = 'cc'

    const t = strix({
      a: {
        a: 'aa',
        b: 'ab',
        c: 'ac',
      },
      b: {
        a: 'ba',
        b: 'bb',
        c: 'bc',
      },
      c: {
        a: 'ca',
        b: 'cb',
        c: 'cc',
      },
    } as const)

    expect(t('a.a')).toBe(aa)
    expect(t('a.b')).toBe(ab)
    expect(t('a.c')).toBe(ac)
    expect(t('b.a')).toBe(ba)
    expect(t('b.b')).toBe(bb)
    expect(t('b.c')).toBe(bc)
    expect(t('c.a')).toBe(ca)
    expect(t('c.b')).toBe(cb)
    expect(t('c.c')).toBe(cc)
  })
})

export {}
