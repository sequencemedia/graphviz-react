import React, {
  createRef,
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
  graphRef?: React.RefObject<HTMLDivElement>
  /**
   * A string containing a graph representation using the Graphviz DOT language.
   * @see https://graphviz.org/doc/info/lang.html
   */
  dot: string
  /**
   * Options to pass to the Graphviz renderer.
   */
  options?: GraphvizOptions
  /**
   * The classname to attach to this component for styling purposes.
   */
  className?: string
  /**
   *  A handler for click events
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
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
   *  A handler for `end` events
   */
  onEnd?: () => void
}

const DEFAULT_OPTIONS: GraphvizOptions = {
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

function DEFAULT_HANDLE_START (): void {
  //
}

function DEFAULT_HANDLE_RENDER_START (): void {
  //
}

function DEFAULT_HANDLE_RENDER_END (): void {
  //
}

function DEFAULT_HANDLE_END (): void {
  //
}

function DEFAULT_HANDLE_CLICK (): void {
  //
}

const log = debug('@sequencemedia/graphviz-react')

export function hasEventTarget (event: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean {
  try {
    return Boolean(getEventTarget(event))
  } catch {
    return false
  }
}

export function getEventTarget ({ target }: React.MouseEvent<HTMLDivElement, MouseEvent>): Element {
  if (target instanceof Element) return target
  throw new Error('Target is not an Element')
}

export function hasEntryTarget (entry: ResizeObserverEntry): boolean {
  try {
    return Boolean(getEntryTarget(entry))
  } catch {
    return false
  }
}

export function getEntryTarget ({ target }: ResizeObserverEntry): Element {
  if (target instanceof Element) return target
  throw new Error('Target is not an Element')
}

export function hasCurrent (ref: React.RefObject<HTMLDivElement>): boolean {
  try {
    return Boolean(getCurrent(ref))
  } catch {
    return false
  }
}

export function getCurrent ({ current }: React.RefObject<HTMLDivElement>): Element {
  if (current instanceof Element) return current
  throw new Error('Ref `current` is null')
}

export default function GraphvizReact ({
  graphRef: ref = createRef<HTMLDivElement>(),
  dot,
  className,
  options = DEFAULT_OPTIONS,
  onStart = DEFAULT_HANDLE_START,
  onRenderStart = DEFAULT_HANDLE_RENDER_START,
  onRenderEnd = DEFAULT_HANDLE_RENDER_END,
  onEnd = DEFAULT_HANDLE_END,
  onClick = DEFAULT_HANDLE_CLICK
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

      const eventEmitter: Graphviz<BaseType, any, BaseType, any> = (
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
    if (eventEmitter !== null) {
      eventEmitter
        .on('start', onStart)
        .on('renderStart', onRenderStart)
        .on('renderEnd', onRenderEnd)
        .on('end', onEnd)
    }
  }, [eventEmitter, onStart, onRenderStart, onRenderEnd, onEnd])

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
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
