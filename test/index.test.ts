import { describe, expect, test, it } from 'vitest'
import { pages, dynamicRoutes } from './data'
import { resolvePages, match } from '../src/core'

describe('matching routes', () => {
  test('get pageNames', () => {
    const pageNames = resolvePages(pages)
    expect(pageNames).toMatchSnapshot()
  })

  test('dynamicRoutes and pageNames', () => {
    const pageNames = resolvePages(pages)
    const matching = match(dynamicRoutes, pageNames)
    expect(matching).toMatchSnapshot()
  })
})
