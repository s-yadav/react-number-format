import React, { useState } from 'react';
import { PatternFormat } from 'react-number-format';

export default function PropValueIsNumericString() {
    const [val, setVal] = useState("123456789");

    return (
        <>
            <p>
                <PatternFormat
                    format="+1 (###) ###-####"
                    value={val}
                    onValueChange={(values) => {
                        const { value } = values;
                        setVal(value);
                    }}
                    valueIsNumericString={true}
                />
            </p>
        </>
    )
}