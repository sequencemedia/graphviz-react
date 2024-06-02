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
import debug from 'debug'

export function hasEventTarget (event) {
  try {
    return Boolean(getEventTarget(event))
  } catch {
    return false
  }
}

export function getEventTarget ({ target = null }) {
  if (target instanceof Element) return target
  throw new Error('Target is not an Element')
}

export function hasEntryTarget (entry) {
  try {
    return Boolean(getEntryTarget(entry))
  } catch {
    return false
  }
}

export function getEntryTarget ({ target = null }) {
  if (target instanceof Element) return target
  throw new Error('Target is not an Element')
}

export function hasCurrent (ref) {
  try {
    return Boolean(getCurrent(ref))
  } catch {
    return false
  }
}

export function getCurrent ({ current }) {
  if (current instanceof Element) return current
  throw new Error('Ref `current` is null')
}

/*
export function hasEventTarget (event) {
  return (getEventTarget(event) instanceof Element)
}

export function getEventTarget ({ target = null }) {
  return target
}

export function hasEntryTarget (entry) {
  return (getEntryTarget(entry) instanceof Element)
}

export function getEntryTarget ({ target = null }) {
  return target
}

export function hasCurrent (ref = {}) {
  return (getCurrent(ref) instanceof Element)
}

export function getCurrent ({ current = null } = {}) {
  return current
}
*/

const DEFAULT_OPTIONS = {
  useWorker: false
}

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (hasEntryTarget(entry)) {
      const target = getEntryTarget(entry)

      const svg = target.querySelector('svg')

      if (svg instanceof SVGElement) {
        const {
          contentRect: {
            width,
            height
          }
        } = entry

        svg.setAttribute('width', width + 'px')
        svg.setAttribute('height', height + 'px')
      }
    }
  }
})

function DEFAULT_HANDLE_START () {
  //
}

function DEFAULT_HANDLE_RENDER_START () {
  //
}

function DEFAULT_HANDLE_RENDER_END () {
  //
}

function DEFAULT_HANDLE_END () {
  //
}

function DEFAULT_HANDLE_CLICK () {
  //
}

const log = debug('@sequencemedia/graphviz-react')

export default function GraphvizReact ({
  graphRef: ref = createRef(),
  dot,
  className,
  options = DEFAULT_OPTIONS,
  onStart = DEFAULT_HANDLE_START,
  onRenderStart = DEFAULT_HANDLE_RENDER_START,
  onRenderEnd = DEFAULT_HANDLE_RENDER_END,
  onEnd = DEFAULT_HANDLE_END,
  onClick = DEFAULT_HANDLE_CLICK
}) {
  log('GraphvizReact')

  const [
    eventEmitter,
    setEventEmitter
  ] = useState(null)

  useEffect(() => {
    const {
      fit = false
    } = options

    if (fit) {
      if (hasCurrent(ref)) {
        const current = getCurrent(ref)

        resizeObserver.observe(current)

        return () => {
          resizeObserver.unobserve(current)
        }
      }
    }
  })

  useEffect(() => {
    if (hasCurrent(ref)) {
      const current = getCurrent(ref)

      const eventEmitter = (
        graphviz(current, {
          ...DEFAULT_OPTIONS,
          ...options
        })
          .renderDot(dot)
      )

      setEventEmitter(eventEmitter)
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

  const handleClick = useCallback((event) => {
    if (hasEventTarget(event)) {
      const target = getEventTarget(event)

      if (hasCurrent(ref)) {
        const current = getCurrent(ref)

        if (current.contains(target)) onClick(event)
      }
    }
  }, [dot, options, onClick])

  return (
    <div
      className={classnames('graphviz', className)}
      onClick={handleClick}
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
