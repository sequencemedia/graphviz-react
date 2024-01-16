import React, {
  createRef,
  useState,
  useEffect,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {
  graphviz
} from 'd3-graphviz'

const DEFAULT_OPTIONS = {
  useWorker: false
}

export default function GraphvizReact ({
  graphRef: ref,
  dot,
  className,
  options,
  onStart,
  onRenderStart,
  onRenderEnd,
  onEnd,
  onClick: handleClick
}) {
  const [eventEmitter, setEventEmitter] = useState(null)

  useEffect(() => {
    if (ref) {
      const {
        current = null
      } = ref

      if (current) {
        const eventEmitter = (
          graphviz(current, {
            ...DEFAULT_OPTIONS,
            ...options
          })
            .renderDot(dot)
        )

        setEventEmitter(eventEmitter)
      }
    }
  }, [dot, options])

  useEffect(() => {
    if (eventEmitter) {
      eventEmitter
        .on('start', onStart)
        .on('renderStart', onRenderStart)
        .on('renderEnd', onRenderEnd)
        .on('end', onEnd)
    }
  }, [eventEmitter, onStart, onRenderStart, onRenderEnd, onEnd])

  const onClick = useCallback((event) => {
    const {
      current = null
    } = ref

    if (current) {
      const {
        target = null
      } = event

      if (target) {
        if (current.contains(target)) {
          handleClick(event)
        }
      }
    }
  }, [dot, options, handleClick])

  return (
    <div
      className={classnames('graphviz', className)}
      onClick={onClick}
      ref={ref}
    />
  )
}

GraphvizReact.propTypes = {
  graphRef: PropTypes.shape({
    current: PropTypes.shape()
  }),
  dot: PropTypes.string.isRequired,
  className: PropTypes.string,
  options: PropTypes.shape(),
  onClick: PropTypes.func,
  onStart: PropTypes.func,
  onRenderStart: PropTypes.func,
  onRenderEnd: PropTypes.func,
  onEnd: PropTypes.func
}

GraphvizReact.defaultProps = {
  graphRef: createRef(),
  options: {},
  onStart () {
    //
  },
  onRenderStart () {
    //
  },
  onRenderEnd () {
    //
  },
  onEnd () {
    //
  },
  onClick () {
    //
  }
}
