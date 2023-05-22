import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';

export default function OnValueChange() {
    const [valuesObj, setValuesObj] = useState({});

    return (
        <>
            <p>To see the value change, type something in the input field</p>
            <div>
                <NumericFormat
                    value={1234}
                    prefix="$"
                    onValueChange={(values, sourceInfo) => {
                        setValuesObj(values);
                    }}
                />
            </div>
            <hr />
            <code>{JSON.stringify(valuesObj)}</code>
            <hr />
        </>
    )
}