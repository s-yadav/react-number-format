import React from 'react';
import { PatternFormat } from 'react-number-format';

export default function Format() {
    return (
        <PatternFormat value={123123} format="### ###" />
    )
}