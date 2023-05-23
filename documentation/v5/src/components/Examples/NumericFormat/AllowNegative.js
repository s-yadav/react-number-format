import React from 'react';
import { NumericFormat } from 'react-number-format';

export default function AllowNegative() {
    return (
        <>
            <p><b>If set to true</b></p>
            <p> Notice how the negative value is visible/allowed</p>
            <div>
                <NumericFormat value="-12" allowNegative />
            </div>
            <br />
            <p><b>If set to false</b></p>
            <p>
                Notice how the negative value is not visible/allowed. If you type '-',
                it will still not be visible
            </p>
            <div>
                <NumericFormat value="12" allowNegative={false} />
            </div>
        </>
    )
}