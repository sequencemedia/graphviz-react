import React from 'react'

import {
  render
} from '@testing-library/react'

import {
  toSnapshot
} from 'react-component-snapshot'

import GraphvizReact from '../GraphvizReact.tsx'

describe('<GraphvizReact />', () => {
  it('matches the snapshot', () => {
    expect(toSnapshot(render(
      <GraphvizReact
        dot='graph { a -- b }'
      />
    )))
      .toMatchSnapshot()
  })
})
