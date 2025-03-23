import type { JSX } from 'react'
import React, {
  useState,
  useEffect,
  useCallback
} from 'react'
import classnames from 'classnames'
import type {
  BaseType
} from 'd3-selection'
import type {
  Graphviz,
  GraphvizOptions
} from 'd3-graphviz'
import {
  graphviz
} from 'd3-graphviz'
import debug from 'debug'

export interface IGraphvizProps {
  /**
   *  A React `ref` for the container
   */
  graphRef?: React.RefObject<any>
  /**
   *  A string containing a graph representation using the Graphviz DOT language
   *
   *  @see https://graphviz.org/doc/info/lang.html
   */
  dot: string
  /**
   *  Configuration options
   */
  options?: GraphvizOptions
  /**
   *  A `className` for the container
   */
  className?: string
  /**
   *  A handler for `click` events
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  /**
   *  A handler for `start` events
   */
  onStart?: () => void
  /**
   *  A handler for `renderStart` events
   */
  onRenderStart?: () => void
  /**
   *  A handler for `renderEnd` events
   */
  onRenderEnd?: () => void
  /**
   *  A handler for the `renderDot` callback
   */
  onRenderDot?: () => void
  /**
   *  A handler for `end` events
   */
  onEnd?: () => void
}

const DEFAULT_OPTIONS: GraphvizOptions = {
  useWorker: false
}

function handleEntries (entries: ResizeObserverEntry[]): void {
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

function DEFAULT_HANDLE_EVENT (): void {
  //
}

export function hasEventTarget ({ target }: React.MouseEvent<HTMLDivElement>): boolean {
  if (target instanceof Element) return true
  return false
}

export function getEventTarget ({ target }: React.MouseEvent<HTMLDivElement>): Element | null {
  if (target instanceof Element) return target
  return null
}

export function hasEntryTarget ({ target }: ResizeObserverEntry): boolean {
  if (target instanceof Element) return true
  return false
}

export function getEntryTarget ({ target }: ResizeObserverEntry): Element | null {
  if (target instanceof Element) return target
  return null
}

export function hasCurrent (ref: React.RefObject<any> = { current: null }): ref is React.RefObject<HTMLDivElement> {
  const {
    current // = null
  } = ref

  return (current instanceof Element)
}

export function getCurrent ({ current }: React.RefObject<HTMLDivElement>): Element {
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
}: IGraphvizProps): JSX.Element {
  log('GraphvizReact')

  const [
    eventEmitter,
    setEventEmitter
  ] = useState<Graphviz<BaseType, any, BaseType, any> | null>(null)

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

      const eventEmitter: Graphviz<BaseType, any, BaseType, any> = (
        graphviz(current, OPTIONS)
          .renderDot(dot, onRenderDot)
      )

      setEventEmitter(eventEmitter)
    }
  }, [
    dot,
    options
  ])

  useEffect(() => {
    if (eventEmitter !== null) {
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

  const handleClick = useCallback(function handleClick (event: React.MouseEvent<HTMLDivElement>): void {
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
