import { NumericFormat } from "react-number-format";
import React, { useState } from "react";

export default function PropsValue({ value, onChange, ...rest }) {
    const [internalValue, setInternalValue] = useState(value);

    const _onChange = (e) => {
      setInternalValue(e.target.value);
      if (onChange) onChange(e);
    };
    
    return <NumericFormat value={internalValue} onChange={_onChange} {...rest} />
}