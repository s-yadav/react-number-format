import React from 'react';
import { NumericFormat } from 'react-number-format';

export default function FixedDecimalScale() {
    return (
        <>
            <p><b>If set to true</b></p>
            <p>
                Notice trailing 0s after decimal separator, there will always be 3
                decimal digits.
            </p>

            <div>
                <NumericFormat value={12323.1} decimalScale={3} fixedDecimalScale />
            </div>
            <br />
            <p><b>If set to false</b></p>
            <p>No trailing 0s will be displayed after decimal separator.</p>
            <div>
                <NumericFormat value={12323.1} decimalScale={3} />
            </div>
        </>
    )
}