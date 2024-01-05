import React, { createRef, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import { graphviz } from 'd3-graphviz';
const defaultOptions = {
    useWorker: false
};
export default function Graphviz({ dot, className, options = {}, onClick: handleClick = () => { } }) {
    const ref = createRef();
    useEffect(() => {
        const { current } = ref;
        if (current !== null) {
            graphviz(current, {
                ...defaultOptions,
                ...options
            }).renderDot(dot);
        }
    }, [dot, options]);
    const onClick = useCallback((event) => {
        const { current } = ref;
        if (current !== null) {
            const { target } = event;
            if (target instanceof Element) {
                if (current.contains(target)) {
                    handleClick(event);
                }
            }
        }
    }, [dot, options]);
    return (React.createElement("div", { className: classnames('graphviz', className), onClick: onClick, ref: ref }));
}
