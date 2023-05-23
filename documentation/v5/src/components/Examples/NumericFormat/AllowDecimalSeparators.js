import React from 'react';
import { NumericFormat } from 'react-number-format';

export default function AllowDecimalSeparators() {
    return (
        <>
            <p>
                If a symbol is provided in the array, whenever the library see that
                symbol in the input, it will replace it to '.'. Default <code>decimalSeparator</code>
                {" "}is '.' so it will change to '.'. If you type '.' it will append that.
            </p>

            <div>
                <NumericFormat value="12" allowedDecimalSeparators={["%"]} />
            </div>

            <p>
                If the <code>decimalSeparator</code> prop is provided, the symbol will be replaced by
                the value of <code>decimalSeparator</code>. Enter '%'' in the input and see it change
                to '.'
            </p>

            <div>
                <NumericFormat value="12" allowedDecimalSeparators={["%"]} />
            </div>
        </>
    )
}