import React from 'react';
import type { GraphvizOptions } from 'd3-graphviz';
export interface IGraphvizProps {
    /**
     *  A React `ref` for the container
     */
    graphRef?: React.RefObject<HTMLDivElement>;
    /**
     * A string containing a graph representation using the Graphviz DOT language.
     * @see https://graphviz.org/doc/info/lang.html
     */
    dot: string;
    /**
     * Options to pass to the Graphviz renderer.
     */
    options?: GraphvizOptions;
    /**
     * The classname to attach to this component for styling purposes.
     */
    className?: string;
    /**
     *  A handler for click events
     */
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    /**
     *  A handler for `start` events
     */
    onStart?: () => void;
    /**
     *  A handler for `renderStart` events
     */
    onRenderStart?: () => void;
    /**
     *  A handler for `renderEnd` events
     */
    onRenderEnd?: () => void;
    /**
     *  A handler for `end` events
     */
    onEnd?: () => void;
}
export default function GraphvizReact({ graphRef: ref, dot, className, options, onStart, onRenderStart, onRenderEnd, onEnd, onClick }: IGraphvizProps): JSX.Element;
