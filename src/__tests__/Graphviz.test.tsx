import React from 'react'
import * as renderer from 'react-test-renderer'
import Graphviz from '../Graphviz.tsx'

describe('<Graphviz />', () => {
  it('matches the snapshot', () => {
    const graphviz = renderer.create(
      <Graphviz
        dot='graph { a -- b }'
      />
    )

    expect(graphviz.toJSON())
      .toMatchSnapshot()
  })
})
