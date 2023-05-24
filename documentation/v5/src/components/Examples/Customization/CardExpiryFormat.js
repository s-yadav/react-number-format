import React from 'react';
import { usePatternFormat, NumberFormatBase } from "react-number-format";
import { useState } from "react";
import { cardFormat } from './cardFormat';

function MyCardExpiryFormat(props) {
    const { format, ...rest } = usePatternFormat({ ...props, format: "##/##" });
    const _format = (val) => format(cardFormat(val));

    return <NumberFormatBase format={_format} {...rest} />;
}

export default function CardExpiryFormat() {
    const [valuesObj, setValuesObj] = useState({});

    return (
        <>
            <p><b>To see the value change, type something in the input field</b></p>

            <div>
                <MyCardExpiryFormat
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