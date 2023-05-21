import React from 'react';
import { TextField } from '@mui/material';
import { NumericFormat } from 'react-number-format';

const materialUITextFieldProps = {
    id: "filled-multiline-flexible",
    label: "Multiline",
    multiline: true,
    maxRows: 4,
    variant: "filled"
};

export default function PropsCustomInput() {
    
    return (
        <>
            <p>Use <code>customInput</code> field to reference any custom text fields.</p>
            <p>
                <NumericFormat
                    value={12323}
                    prefix="$"
                    thousandSeparator
                    customInput={TextField}
                />
            </p>
            <p>
                You can also pass all the props relevant to the custom text field as
                props to <code>NumericFormat</code>
            </p>
            <p>
                <NumericFormat
                    value={12323}
                    prefix="$"
                    thousandSeparator
                    customInput={TextField}
                    {...materialUITextFieldProps}
                />
            </p>
        </>
    )
}
