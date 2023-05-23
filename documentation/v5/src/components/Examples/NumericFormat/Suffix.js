import React from 'react';
import { NumericFormat } from 'react-number-format';

export default function Suffix() {
    return (
        <>
            <NumericFormat value={123} suffix={"/ -"} />
        </>
    )
}