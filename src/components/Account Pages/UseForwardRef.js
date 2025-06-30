"use client";
import { useRef } from 'react';
const UseForwardRef = () => {
    const ref = useRef(null);
    return {
        ref
        ,
        setRef: (element) => {
            ref.current = element;
        },
    };
};
export default UseForwardRef