import React from 'react';
import { NumberFormatBase, useNumericFormat } from "react-number-format";
import { useState } from "react";

const persianNumeral = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function MyCustomNumericFormat(props) {
    const { format, removeFormatting, ...rest } = useNumericFormat(props);

    const _format = (val) => {
        const _val = format(val);
        return _val.replace(/\d/g, ($1) => persianNumeral[Number($1)]);
    };

    const _removeFormatting = (val) => {
        const _val = val.replace(new RegExp(persianNumeral.join("|"), "g"), ($1) =>
            persianNumeral.indexOf($1)
        );

        return removeFormatting(_val);
    };

    return (
        <NumberFormatBase
            format={_format}
            removeFormatting={_removeFormatting}
            {...rest}
        />
    );
}

export default function CustomNumericFormat() {
    const [valuesObj, setValuesObj] = useState({});

    return (
        <>
            <p><b>To see the value change, type something in the input field</b></p>

            <div>
                <MyCustomNumericFormat
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