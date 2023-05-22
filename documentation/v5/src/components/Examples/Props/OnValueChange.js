import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';

export default function PropsOnValueChange() {
    const [valuesObj, setValuesObj] = useState({});

    return (
        <>
            <p>To see the value change, type something in the input field</p>
            <p>
                <NumericFormat
                    value={1234}
                    prefix="$"
                    onValueChange={(values, sourceInfo) => {
                        setValuesObj(values);
                    }}
                />
            </p>
            <hr />
            <code>{JSON.stringify(valuesObj)}</code>
            <hr />
        </>
    )
}