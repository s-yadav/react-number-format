import React from 'react';
import { NumericFormat } from 'react-number-format';

export default function AllowLeadingZeros() {
    return (
        <>
            <p>
                <b>Without</b> <code>allowLeadingZeros</code>
            </p>
            <p>
                Type zeros in front and move out, the number will change to 102,220
                because leading zeros aren't allowed.
            </p>
            <div>

                <NumericFormat value="102220" thousandSeparator="," />
            </div>
            <br />
            <p>
                <b>With</b> <code>allowLeadingZeros</code>
            </p>
            <p>
                Type zeros in front and move out, the number will not change because
                leading zeros are allowed.
            </p>
            <div>
                <NumericFormat
                    value="102220"
                    allowLeadingZeros
                    thousandSeparator=","
                />
            </div>
        </>
    )
}