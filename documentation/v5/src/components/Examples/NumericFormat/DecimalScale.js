import React from 'react';
import { NumericFormat } from 'react-number-format';

export default function DecimalScale() {
    return (
        <NumericFormat value={12323.3333} decimalScale={3} />
    )
}