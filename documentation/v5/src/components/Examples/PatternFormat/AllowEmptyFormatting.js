import React from 'react';
import { PatternFormat } from 'react-number-format';

export default function AllowEmptyFormatting() {
    return (
        <PatternFormat format="+1 (###) #### ###" allowEmptyFormatting mask="_" />
    )
}