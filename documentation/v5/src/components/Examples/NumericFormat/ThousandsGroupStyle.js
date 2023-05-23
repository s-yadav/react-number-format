import React from 'react';
import { NumericFormat } from 'react-number-format';

export default function ThousandsGroupStyle() {
    return (
        <>
            <NumericFormat
                type="text"
                value={1231231}
                thousandsGroupStyle="lakh"
                thousandSeparator=","
            />
        </>
    )
}