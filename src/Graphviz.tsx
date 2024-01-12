import React, {
  createRef,
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
  graphRef: React.RefObject<HTMLDivElement>
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
}

const defaultOptions: GraphvizOptions = {
  useWorker: false
}

export default function Graphviz ({ graphRef: ref = createRef<HTMLDivElement>(), dot, className, options = {}, onClick: handleClick = () => {} }: IGraphvizProps): JSX.Element {
  useEffect(() => {
    const {
      current
    } = ref

    if (current !== null) {
      graphviz(current, {
        ...defaultOptions,
        ...options
      }).renderDot(dot)
    }
  }, [dot, options])

  const onClick = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const {
      current
    } = ref

    if (current !== null) {
      const {
        target
      } = event

      if (target instanceof Element) {
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
