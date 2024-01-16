import React from 'react'
import * as renderer from 'react-test-renderer'
import GraphvizReact from '../GraphvizReact.tsx'

describe('<GraphvizReact />', () => {
  it('matches the snapshot', () => {
    const graphviz = renderer.create(
      <GraphvizReact
        dot='graph { a -- b }'
      />
    )

    expect(graphviz.toJSON())
      .toMatchSnapshot()
  })
})
