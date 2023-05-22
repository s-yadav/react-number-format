import React from 'react';
import { NumericFormat } from 'react-number-format';

export default function PropsType() {
    return (
        <>
            <p>
                Text: <NumericFormat type="text" value={123} />
            </p>
            <p>
                Tel: <NumericFormat type="tel" value={123456} />
            </p>
            <p>
                Password: <NumericFormat type="password" value={1212121} />
            </p>
        </>
    )
}