import { NumericFormat } from "react-number-format";
import React from "react";

export default function PropsDisplayType() {
    return (
        <>
            <p>
                <code>displayType</code> as input
            </p>
            <p>
                <NumericFormat displayType="input" value={110} />
            </p>
            <p>
                <code>displayType</code> as text
            </p>
            <p>
                <NumericFormat displayType="text" value={110} />
            </p>
        </>
    )
}