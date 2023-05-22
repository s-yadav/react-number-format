import React from 'react';
import { NumericFormat } from 'react-number-format';
const MAX_LIMIT = 1000;

export default function IsAllowed() {
    return (
        <>
            <p>Only values less than 1000 are allowed</p>
            <div>
                <NumericFormat
                    value={11}
                    isAllowed={(values) => {
                        if (!values.value) return true;
                        const { floatValue } = values;
                        return floatValue < MAX_LIMIT;
                    }}
                />
            </div>
        </>
    )
}