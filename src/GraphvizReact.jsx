import React, {
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

const DEFAULT_OPTIONS = {
  useWorker: false
}

function handleEntries (entries) {
  for (const entry of entries) {
    if (hasEntryTarget(entry)) {
      const target = getEntryTarget(entry)

      if (target instanceof Element) {
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
  }
}

function DEFAULT_HANDLE_EVENT () {
  //
}

export function hasEventTarget ({ target }) {
  return (target instanceof Element)
}

export function getEventTarget ({ target }) {
  if (target instanceof Element) return target
  return null
}

export function hasEntryTarget ({ target }) {
  return (target instanceof Element)
}

export function getEntryTarget ({ target }) {
  if (target instanceof Element) return target
  return null
}

/**
 * @param {React.RefObject<any>} ref
 * @returns {ref is React.RefObject<HTMLElement>}
 */
export function hasCurrent (ref = { current: null }) {
  const {
    current // = null
  } = ref

  return (current instanceof Element)
}

/**
 * @param {React.RefObject<HTMLElement>} ref
 * @returns {HTMLElement}
 */
export function getCurrent ({ current }) {
  return current
}

const resizeObserver = new ResizeObserver(handleEntries)

const log = debug('@sequencemedia/graphviz-react')

export default function GraphvizReact ({
  graphRef: ref,
  dot,
  className,
  options = DEFAULT_OPTIONS,
  onStart = DEFAULT_HANDLE_EVENT,
  onRenderStart = DEFAULT_HANDLE_EVENT,
  onRenderEnd = DEFAULT_HANDLE_EVENT,
  onRenderDot = DEFAULT_HANDLE_EVENT,
  onEnd = DEFAULT_HANDLE_EVENT,
  onClick = DEFAULT_HANDLE_EVENT
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

      const OPTIONS = {
        ...DEFAULT_OPTIONS,
        ...options
      }

      const eventEmitter = (
        graphviz(current, OPTIONS)
          .renderDot(dot, onRenderDot)
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
  }, [
    eventEmitter,
    onStart,
    onRenderStart,
    onRenderEnd,
    onEnd
  ])

  const handleClick = useCallback((event) => {
    if (hasEventTarget(event)) {
      const target = getEventTarget(event)

      if (target instanceof Element) {
        if (hasCurrent(ref)) {
          const current = getCurrent(ref) ?? { contains () { return false } }

          if (current.contains(target)) onClick(event)
        }
      }
    }
  }, [
    dot,
    options,
    onClick
  ])

  log(ref)

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
  onRenderDot: PropTypes.func,
  onEnd: PropTypes.func
}
