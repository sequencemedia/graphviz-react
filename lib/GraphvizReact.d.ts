import type { JSX } from 'react';
import React from 'react';
import type { GraphvizOptions } from 'd3-graphviz';
export interface IGraphvizProps {
    /**
     *  A React `ref` for the container
     */
    graphRef?: React.RefObject<any>;
    /**
     *  A string containing a graph representation using the Graphviz DOT language
     *
     *  @see https://graphviz.org/doc/info/lang.html
     */
    dot: string;
    /**
     *  Configuration options
     */
    options?: GraphvizOptions;
    /**
     *  A `className` for the container
     */
    className?: string;
    /**
     *  A handler for `click` events
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
     *  A handler for the `renderDot` callback
     */
    onRenderDot?: () => void;
    /**
     *  A handler for `end` events
     */
    onEnd?: () => void;
}
export declare function hasEventTarget({ target }: React.MouseEvent<HTMLDivElement, MouseEvent>): boolean;
export declare function getEventTarget({ target }: React.MouseEvent<HTMLDivElement, MouseEvent>): Element | null;
export declare function hasEntryTarget({ target }: ResizeObserverEntry): boolean;
export declare function getEntryTarget({ target }: ResizeObserverEntry): Element | null;
export declare function hasCurrent(ref?: React.RefObject<any>): ref is React.RefObject<HTMLDivElement>;
export declare function getCurrent({ current }: React.RefObject<HTMLDivElement>): Element;
export default function GraphvizReact({ graphRef: ref, dot, className, options, onStart, onRenderStart, onRenderEnd, onRenderDot, onEnd, onClick }: IGraphvizProps): JSX.Element;
