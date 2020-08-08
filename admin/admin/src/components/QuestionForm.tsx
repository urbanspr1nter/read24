import React, { SyntheticEvent } from 'react';
import TextField from './TextField';
import ChoiceForm from './ChoiceForm';
import { ChoiceItem } from '../common/types';
import './QuestionForm.css';

interface QuestionFormProps {
    questionKey: string;
    content: string;
    choices: Map<string, ChoiceItem>;
    onChange: (e: SyntheticEvent) => void;
    onDelete: (e: SyntheticEvent) => void;
    onAddChoice: (e: SyntheticEvent) => void;
    onDeleteChoice: (e: SyntheticEvent) => void;
    onChoiceFieldChange: (e: SyntheticEvent) => void;
    onChoiceSelectChange: (e: SyntheticEvent) => void;
};

export default function QuestionForm(props: QuestionFormProps) {
    const {
        questionKey,
        content,
        choices,
        onChange,
        onDelete,
        onAddChoice,
        onDeleteChoice,
        onChoiceFieldChange,
        onChoiceSelectChange
    } = props;

    const choiceElements = [];
    for(const k of Array.from(choices.keys())) {
        const c = choices.get(k);

        if (!c || c.delete)
            continue;

        choiceElements.push(
            <ChoiceForm
                key={k}
                questionKey={questionKey}
                choiceKey={k.toString()}
                content={c.content}
                answer={c.answer}
                onDeleteChoice={onDeleteChoice}
                onFieldChange={onChoiceFieldChange}
                onSelectChange={onChoiceSelectChange}
            />
        );
    }

    return (
        <div className="container question-form-container">
            <div className="row">
                <h1>Question</h1>
            </div>
            <div className="row">
                <TextField label="Content" onChange={onChange} id={questionKey} defaultValue={content} />
            </div>
            <div className="row">
                <div className="container">
                    <div className="row">
                        <div className="col-2">
                            <button type="button" data-questionkey={questionKey} className="btn btn-secondary" onClick={onAddChoice}>Add Choice</button>
                        </div>
                        <div className="col-2">
                            <button type="button" data-questionkey={questionKey} className="btn btn-danger" onClick={onDelete}>Delete Question</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {choiceElements}
                </div>
            </div>
        </div>
    );
}
