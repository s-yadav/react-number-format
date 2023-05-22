import React from 'react';
import { NumericFormat } from 'react-number-format';

export default function Type() {
    return (
        <>
            <div>
                Text: <NumericFormat type="text" value={123} />
            </div>
            <div>
                Tel: <NumericFormat type="tel" value={123456} />
            </div>
            <div>
                Password: <NumericFormat type="password" value={1212121} />
            </div>
        </>
    )
}