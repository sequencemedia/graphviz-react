import React, { createRef, useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import { graphviz } from 'd3-graphviz';
const DEFAULT_OPTIONS = {
    useWorker: false
};
export default function GraphvizReact({ graphRef: ref = createRef(), dot, className, options = {}, onStart = () => { }, onRenderStart = () => { }, onRenderEnd = () => { }, onEnd = () => { }, onClick: handleClick = () => { } }) {
    const [eventEmitter, setEventEmitter] = useState(null);
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
    const onClick = useCallback((event) => {
        const { current = null } = ref;
        if (current !== null) {
            const { target = null } = event;
            if (target instanceof Element) {
                if (current.contains(target)) {
                    handleClick(event);
                }
            }
        }
    }, [dot, options, handleClick]);
    return (React.createElement("div", { className: classnames('graphviz', className), onClick: onClick, ref: ref }));
}