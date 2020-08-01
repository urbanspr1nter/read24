import React, { SyntheticEvent } from 'react';

interface TextFieldProps {
    id: string;
    label: string;
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (e: SyntheticEvent) => void;
};

export default function TextField(props: TextFieldProps) {
    const {
        id,
        label,
        placeholder,
        value,
        defaultValue,
        onChange
    } = props;

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input 
                type="text"
                className="form-control" 
                id={id} 
                placeholder={placeholder || undefined}
                defaultValue={defaultValue || undefined}
                value={value || undefined}
                onChange={onChange}
            />
        </div>
    );
}
