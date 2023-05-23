import React from 'react';
import { NumericFormat } from 'react-number-format';

export default function DecimalSeparator() {
    return (
        <NumericFormat value={12323.3333} decimalSeparator="," />
    )
}