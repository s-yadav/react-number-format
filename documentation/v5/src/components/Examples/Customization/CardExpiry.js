import React from 'react';
import { NumberFormatBase } from "react-number-format";
import { useState } from "react";
import { cardFormat } from './cardFormat';

function MyCardExpiry(props) {    

    return <NumberFormatBase {...props} format={(inputValue) => cardFormat(inputValue, true)} />;
}

export default function CardExpiry() {
    const [valuesObj, setValuesObj] = useState({});

    return (
        <>
            <p><b>To see the value change, type something in the input field</b></p>
            <div>
                <MyCardExpiry
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