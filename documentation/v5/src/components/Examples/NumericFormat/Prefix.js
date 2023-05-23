import React from 'react';
import { NumericFormat } from 'react-number-format';

export default function Prefix() {
    return (
        <>
            <NumericFormat value={1234} prefix={"$"} />
        </>
    )
}