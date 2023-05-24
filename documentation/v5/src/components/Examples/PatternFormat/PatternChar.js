import React from 'react';
import { PatternFormat } from 'react-number-format';

export default function PatternChar() {
    return (
        <PatternFormat format="%% (%%%)" patternChar="%" />
    )
}