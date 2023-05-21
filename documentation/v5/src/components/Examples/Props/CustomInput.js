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
            <code>Use `customInput` field to reference any custom text fields.</code>
            <p>
                <NumericFormat
                    value={12323}
                    prefix="$"
                    thousandSeparator
                    customInput={TextField}
                />
            </p>
            <code>
                You can also pass all the props relevant to the custom text field as
                props to NumbericFormat
            </code>
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
