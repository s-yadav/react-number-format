import React from 'react';
import { PatternFormat } from 'react-number-format';

export default function Mask() {
    return (
        <PatternFormat
          value="411111"
          isNumericString
          format="#### #### #### ####"
          mask="_"
        />
    )
}