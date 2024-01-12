import React, {
  createRef,
  useEffect,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {
  graphviz
} from 'd3-graphviz'

const defaultOptions = {
  useWorker: false
}

export default function Graphviz ({ graphRef: ref, dot, className, options, onClick: handleClick }) {
  useEffect(() => {
    if (ref) {
      const {
        current
      } = ref

      if (current) {
        graphviz(current, {
          ...defaultOptions,
          ...options
        }).renderDot(dot)
      }
    }
  }, [dot, options])

  const onClick = useCallback((event) => {
    const {
      current
    } = ref

    if (current) {
      const {
        target
      } = event

      if (current.contains(target)) {
        handleClick(event)
      }
    }
  }, [dot, options])

  return (
    <div
      className={classnames('graphviz', className)}
      onClick={onClick}
      ref={ref}
    />
  )
}

Graphviz.propTypes = {
  graphRef: PropTypes.shape({
    current: PropTypes.shape()
  }),
  dot: PropTypes.string.isRequired,
  className: PropTypes.string,
  options: PropTypes.shape(),
  onClick: PropTypes.func
}

Graphviz.defaultProps = {
  graphRef: createRef(),
  options: {},
  onClick () {
    //
  }
}
