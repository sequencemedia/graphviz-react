import React, { createRef, useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import { graphviz } from 'd3-graphviz';
const DEFAULT_OPTIONS = {
    useWorker: false
};
const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
        const { target = null } = entry;
        if (target !== null) {
            const svg = target.querySelector('svg');
            if (svg !== null) {
                const { contentRect: { width, height } } = entry;
                svg.setAttribute('width', width + 'px');
                svg.setAttribute('height', height + 'px');
            }
        }
    }
});
function handleStart() {
    //
}
function handleRenderStart() {
    //
}
function handleRenderEnd() {
    //
}
function handleEnd() {
    //
}
function handleClick() {
    //
}
export default function GraphvizReact({ graphRef: ref = createRef(), dot, className, options = {}, onStart = handleStart, onRenderStart = handleRenderStart, onRenderEnd = handleRenderEnd, onEnd = handleEnd, onClick = handleClick }) {
    const [eventEmitter, setEventEmitter] = useState(null);
    useEffect(() => {
        const { fit = false } = options;
        if (fit) {
            const { current = null } = ref;
            if (current !== null) {
                resizeObserver.observe(current);
                return () => {
                    resizeObserver.unobserve(current);
                };
            }
        }
    });
    useEffect(() => {
        const { current = null } = ref;
        if (current !== null) {
            const eventEmitter = (graphviz(current, {
                ...DEFAULT_OPTIONS,
                ...options
            })
                .renderDot(dot));
            setEventEmitter(eventEmitter);
        }
    }, [dot, options]);
    useEffect(() => {
        if (eventEmitter !== null) {
            eventEmitter
                .on('start', onStart)
                .on('renderStart', onRenderStart)
                .on('renderEnd', onRenderEnd)
                .on('end', onEnd);
        }
    }, [eventEmitter, onStart, onRenderStart, onRenderEnd, onEnd]);
    const handleClick = useCallback((event) => {
        const { current = null } = ref;
        if (current !== null) {
            const { target = null } = event;
            if (target instanceof Element) {
                if (current.contains(target)) {
                    onClick(event);
                }
            }
        }
    }, [dot, options, onClick]);
    return (React.createElement("div", { className: classnames('graphviz', className), onClick: handleClick, ref: ref }));
}
