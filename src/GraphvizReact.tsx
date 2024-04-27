import React, {
  createRef,
  useState,
  useEffect,
  useCallback
} from 'react'
import classnames from 'classnames'
import type { GraphvizOptions } from 'd3-graphviz'
import { graphviz } from 'd3-graphviz'

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
    const {
      target = null
    } = entry

    if (target !== null) {
      const svg = target.querySelector('svg')

      if (svg !== null) {
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

function handleStart (): void {
  //
}

function handleRenderStart (): void {
  //
}

function handleRenderEnd (): void {
  //
}

function handleEnd (): void {
  //
}

function handleClick (): void {
  //
}

export default function GraphvizReact ({
  graphRef: ref = createRef<HTMLDivElement>(),
  dot,
  className,
  options = {},
  onStart = handleStart,
  onRenderStart = handleRenderStart,
  onRenderEnd = handleRenderEnd,
  onEnd = handleEnd,
  onClick = handleClick
}: IGraphvizProps): JSX.Element {
  const [eventEmitter, setEventEmitter] = useState<any>(null)

  useEffect(() => {
    const { fit = false } = options

    if (fit) {
      const { current = null } = ref

      if (current !== null) {
        resizeObserver.observe(current)

        return () => {
          resizeObserver.unobserve(current)
        }
      }
    }
  })

  useEffect(() => {
    const {
      current = null
    } = ref

    if (current !== null) {
      const eventEmitter: any = (
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
    const {
      current = null
    } = ref

    if (current !== null) {
      const {
        target = null
      } = event

      if (target instanceof Element) {
        if (current.contains(target)) {
          onClick(event)
        }
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
