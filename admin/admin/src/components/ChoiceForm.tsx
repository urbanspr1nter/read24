import React, { SyntheticEvent } from 'react';
import TextField from './TextField';
import SelectBox from './SelectBox';
import './ChoiceForm.css';

interface ChoiceFormProps {
    questionKey: string;
    choiceKey: string;
    content: string;
    answer: string;
    onDeleteChoice: (e: SyntheticEvent) => void;
    onFieldChange: (e: SyntheticEvent) => void;
    onSelectChange: (e: SyntheticEvent) => void;
};

export default function ChoiceForm(props: ChoiceFormProps) {
    const {
        questionKey,
        choiceKey,
        content,
        answer,
        onDeleteChoice,
        onFieldChange,
        onSelectChange
    } = props;

    const options = [
        {value: 'false', label: 'False', selected: answer === 'false'},
        {value: 'true', label: 'True', selected: answer === 'true'}
    ];

    return (
        <div className="container choice-form-container">
            <div className="row">
                <div className="col col-lg-auto">
                    <h1>Choice</h1>
                </div>
            </div>
            <div className="row">
                <div className="col col-md-auto">
                    <TextField label="Content" id={`content-${questionKey}-${choiceKey}`} onChange={onFieldChange} defaultValue={content} />
                </div>
                <div className="col col-md-auto">
                    <SelectBox label="Is Answer?" id={`answer-${questionKey}-${choiceKey}`} onChange={onSelectChange} options={options} />
                </div>
                <div className="col col-sm-auto">
                    <div className="form-group">
                        <label>Action</label>
                        <div>
                            <button type="button" data-questionkey={questionKey} data-choicekey={choiceKey} onClick={onDeleteChoice} className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>            
    );
}