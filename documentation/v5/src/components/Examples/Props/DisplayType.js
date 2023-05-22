import { NumericFormat } from "react-number-format";
import React from "react";

export default function PropsDisplayType() {
    return (
        <>
            <p>
                <code>displayType</code> as input
            </p>
            <div>
                <NumericFormat displayType="input" value={110} />
            </div>
            <p>
                <code>displayType</code> as text
            </p>
            <div>
                <NumericFormat displayType="text" value={110} />
            </div>
        </>
    )
}