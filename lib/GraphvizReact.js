import React, { createRef, useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import { graphviz } from 'd3-graphviz';
import debug from 'debug';
const DEFAULT_OPTIONS = {
    useWorker: false
};
function handleEntries(entries) {
    for (const entry of entries) {
        if (hasEntryTarget(entry)) {
            const target = getEntryTarget(entry);
            const svg = target.querySelector('svg');
            if (svg instanceof SVGElement) {
                const { contentRect: { width, height } } = entry;
                svg.setAttribute('width', width + 'px');
                svg.setAttribute('height', height + 'px');
            }
        }
    }
}
function DEFAULT_HANDLE_START() {
    //
}
function DEFAULT_HANDLE_RENDER_START() {
    //
}
function DEFAULT_HANDLE_RENDER_END() {
    //
}
function DEFAULT_HANDLE_END() {
    //
}
function DEFAULT_HANDLE_CLICK() {
    //
}
export function hasEventTarget({ target }) {
    return (target instanceof Element);
}
export function getEventTarget({ target }) {
    if (target instanceof Element)
        return target;
    throw new Error('Target is not an Element');
}
export function hasEntryTarget({ target }) {
    return (target instanceof Element);
}
export function getEntryTarget({ target }) {
    if (target instanceof Element)
        return target;
    throw new Error('Target is not an Element');
}
export function hasCurrent({ current }) {
    return (current instanceof Element);
}
export function getCurrent({ current }) {
    if (current instanceof Element)
        return current;
    throw new Error('Ref `current` is null');
}
const resizeObserver = new ResizeObserver(handleEntries);
const log = debug('@sequencemedia/graphviz-react');
export default function GraphvizReact({ graphRef: ref = createRef(), dot, className, options = DEFAULT_OPTIONS, onStart = DEFAULT_HANDLE_START, onRenderStart = DEFAULT_HANDLE_RENDER_START, onRenderEnd = DEFAULT_HANDLE_RENDER_END, onEnd = DEFAULT_HANDLE_END, onClick = DEFAULT_HANDLE_CLICK }) {
    log('GraphvizReact');
    const [eventEmitter, setEventEmitter] = useState(null);
    useEffect(() => {
        const { fit = false } = options;
        if (fit) {
            if (hasCurrent(ref)) {
                const current = getCurrent(ref);
                resizeObserver.observe(current);
                return () => {
                    resizeObserver.unobserve(current);
                };
            }
        }
    });
    useEffect(() => {
        if (hasCurrent(ref)) {
            const current = getCurrent(ref);
            const OPTIONS = {
                ...DEFAULT_OPTIONS,
                ...options
            };
            const eventEmitter = (graphviz(current, OPTIONS)
                .renderDot(dot));
            setEventEmitter(eventEmitter);
        }
    }, [
        dot,
        options
    ]);
    useEffect(() => {
        if (eventEmitter !== null) {
            eventEmitter
                .on('start', onStart)
                .on('renderStart', onRenderStart)
                .on('renderEnd', onRenderEnd)
                .on('end', onEnd);
        }
    }, [
        eventEmitter,
        onStart,
        onRenderStart,
        onRenderEnd,
        onEnd
    ]);
    const handleClick = useCallback((event) => {
        if (hasEventTarget(event)) {
            const target = getEventTarget(event);
            if (hasCurrent(ref)) {
                const current = getCurrent(ref);
                if (current.contains(target))
                    onClick(event);
            }
        }
    }, [
        dot,
        options,
        onClick
    ]);
    return (React.createElement("div", { className: classnames('graphviz', className), onClick: handleClick, ref: ref }));
}
