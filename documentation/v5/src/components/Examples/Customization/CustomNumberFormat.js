import React from 'react';
import { NumberFormatBase } from "react-number-format";
import { useState } from "react";

function MyCustomNumberFormat(props) {
    const format = (numStr) => {
        if (numStr === "") return "";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }).format(numStr);
    };

    return <NumberFormatBase {...props} format={format} />;
}

export default function CustomNumberFormat() {
    const [valuesObj, setValuesObj] = useState({});

    return (
        <>
            <p><b>To see the value change, type something in the input field</b></p>
            <p>
                <MyCustomNumberFormat
                    value={111}
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
};