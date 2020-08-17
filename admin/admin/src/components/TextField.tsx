import React, { SyntheticEvent } from 'react';

interface TextFieldProps {
    id: string;
    label: string;
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    type?: TextFieldType;
    onChange?: (e: SyntheticEvent) => void;
};

export enum TextFieldType {
    Text = "text",
    Password = "password"
}

export default function TextField(props: TextFieldProps) {
    const {
        id,
        label,
        placeholder,
        value,
        defaultValue,
        type,
        onChange
    } = props;

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input 
                type={type === TextFieldType.Password ? TextFieldType.Password : TextFieldType.Text}
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
