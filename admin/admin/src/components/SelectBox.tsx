import React, { SyntheticEvent } from 'react';

interface SelectBoxProps {
    id: string;
    label: string;
    options: SelectOptionProps[];
    onChange?: (e: SyntheticEvent) => void;
};

interface SelectOptionProps {
    label: string;
    value: string;
    selected?: boolean;
};

export default function SelectBox(props: SelectBoxProps) {
    const {
        id,
        label,
        onChange,
        options
    } = props;

    let key = 1;
    
    const selectedOption = options.find(o => o.selected);

    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <select id={id} className="form-control" onChange={onChange} defaultValue={selectedOption ? selectedOption.value : undefined}>
                {
                    options.map(o =>
                        <option value={o.value} defaultValue={o.selected ? o.value : undefined} key={`option-${key++}`}>
                            {o.label}
                        </option>)
                }
            </select>
        </div>
    );
}
