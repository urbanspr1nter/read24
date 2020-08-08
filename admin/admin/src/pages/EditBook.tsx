import React, { useState, useRef, useEffect, SyntheticEvent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { QuestionItem, BookItem, ChoiceItem } from '../common/types';
import BookForm, { BookFormAction } from '../components/BookForm';
import { API_HOST } from '../common/constants';
import './AddBook.css';
import QuestionForm from '../components/QuestionForm';
import AlertBanner, { AlertBannerType } from '../components/AlertBanner';

interface EditBookProps extends RouteComponentProps {
    id: number;
}

export default function EditBook(props: EditBookProps) {
    const {
        id
    } = props;

    const bookId = id || (props.match.params as any).id;

    const [book, setBook] = useState<BookItem>({
        id: 0,
        title: '',
        fiction: '',
        year: '',
        author: '',
        publisher: '',
        genre: 0,
        isbn: '',
        lexile: 0,
        wordCount: 0
    });
    const [questions, setQuestions] = useState(new Map<string, QuestionItem>());
    const [bannerVisible, setBannerVisible] = useState(false);
    const questionId = useRef(0);

    function onBookChange(e: SyntheticEvent) {
        const idAttr = (e.target as HTMLInputElement).attributes.getNamedItem('id');

        if(!idAttr)
            return;

        const id = idAttr.value;

        const newBook = {...book};
        const inputValue = (e.target as HTMLInputElement).value;
        const selectValue = (e.target as HTMLSelectElement).selectedIndex;

        switch(id) {
            case 'book-title':
                newBook.title = inputValue;
                break;
            case 'book-fiction':
                newBook.fiction = selectValue === 0 ? 'false' : 'true';
                break;
            case 'book-year':
                newBook.year = inputValue;
                break;
            case 'book-author':
                newBook.author = inputValue;
                break;
            case 'book-publisher':
                newBook.publisher = inputValue;
                break;
            case 'book-genre':
                newBook.genre = parseInt((e.target as HTMLSelectElement).options.item(selectValue)?.value || '0');
                break;
            case 'book-isbn':
                newBook.isbn = inputValue;
                break;
            case 'book-lexile':
                newBook.lexile = parseInt(inputValue);
                break;
            case 'book-wordCount':
                newBook.wordCount = parseInt(inputValue);
                break;
            default:
                break;
        }

        setBook(newBook);
    }


    function onAddChoice(e: SyntheticEvent) {
        const questionKey = (e.target as HTMLButtonElement).dataset['questionkey']?.toString() || '';

        if(questionKey === '')
            return;

        const existingQuestion = questions.get(questionKey);

        if (!existingQuestion)
            return;
        
        const maxChoiceKey = (Array.from(existingQuestion.choices.keys()).length).toString();
        const currQuestion = {
            id: existingQuestion.id,
            delete: existingQuestion.delete,
            content: existingQuestion.content,
            choices: new Map(existingQuestion.choices)
        };

        if(currQuestion.choices.size === 0)
            currQuestion.choices.set(maxChoiceKey, {content: '', answer: 'true'});
        else
            currQuestion.choices.set(maxChoiceKey, {content: '', answer: 'false'});

        const newQuestions = new Map(questions);
        newQuestions.set(questionKey, currQuestion);

        setQuestions(newQuestions);
    }

    function onDeleteChoice(e: SyntheticEvent) {        
        const questionKey = (e.target as HTMLButtonElement).dataset['questionkey']?.toString() || '';
        const choiceKey = (e.target as HTMLButtonElement).dataset['choicekey']?.toString() || '-1';
        
        if(questionKey === '' || choiceKey === '-1')
            return;

        const existingQuestion = questions.get(questionKey);

        if(!existingQuestion)
            return;
        
        const newChoice = {...existingQuestion.choices.get(choiceKey)} as ChoiceItem;
        newChoice.delete = true;

        const newChoiceMap = new Map(existingQuestion.choices);
        newChoiceMap.set(choiceKey, newChoice);

        const currQuestion = {
            id: existingQuestion.id,
            delete: existingQuestion.delete,
            content: existingQuestion.content,
            choices: newChoiceMap
        };

        const newQuestions = new Map(questions);
        newQuestions.set(questionKey, currQuestion);

        setQuestions(newQuestions);
    }

    function onChoiceFieldChange(e: SyntheticEvent) {
        const field = (e.target as HTMLInputElement);
        const idAttr = field.attributes.getNamedItem("id");

        if(!idAttr)
            return;

        const questionKey = idAttr.value.split("-")[1];
        const choiceKey = idAttr.value.split("-")[2];

        const existingQuestion = questions.get(questionKey);
        if(!existingQuestion)
            return;

        const currChoice = existingQuestion.choices.get(choiceKey);
        if(!currChoice)
            return;

        const newChoice: ChoiceItem = {
            id: currChoice.id,
            delete: currChoice.delete,
            content: field.value,
            answer: currChoice.answer
        };

        existingQuestion.choices.set(choiceKey, newChoice);

        const newQuestions = new Map(questions);
        newQuestions.set(questionKey, existingQuestion);

        setQuestions(newQuestions);
    }

    function onChoiceSelectChange(e: SyntheticEvent) {
        const select = (e.target as HTMLSelectElement);

        const idAttr = select.attributes.getNamedItem("id");
        if (!idAttr)
            return;

        const questionKey = idAttr.value.split("-")[1];
        const choiceKey = idAttr.value.split("-")[2];

        const existingQuestion = questions.get(questionKey);
        if(!existingQuestion)
            return;

        const currChoice = existingQuestion.choices.get(choiceKey);
        if(!currChoice)
            return;

        const selectedItem = select.options.item(select.selectedIndex);

        if(!selectedItem)
            return;

        const newChoice: ChoiceItem = {
            id: currChoice.id,
            delete: currChoice.delete,
            content: currChoice.content,
            answer: selectedItem.value.toString()
        };

        existingQuestion.choices.set(choiceKey, newChoice);

        const newQuestions = new Map(questions);
        newQuestions.set(questionKey, existingQuestion);

        setQuestions(newQuestions);
    }

    function onChangeQuestion (e: SyntheticEvent) {
        const questionField = (e.target as HTMLInputElement);
        const key = questionField.attributes.getNamedItem('id')?.value?.toString() || '';
        const value = questionField.value;

        const existingQuestion = questions.get(key);
        if(!existingQuestion)
            return;

        const currQuestion = {
            id: existingQuestion.id,
            delete: existingQuestion.delete,
            content: value,
            choices: new Map(existingQuestion.choices)
        };

        const newQuestions = new Map<string, QuestionItem>(questions);
        newQuestions.set(key, currQuestion);

        setQuestions(newQuestions);
    };


    function onAddQuestion() {
        const newQuestions = new Map<string, QuestionItem>(questions);
        newQuestions.set(questionId.current.toString(), {
            content: '',
            choices: new Map<string, ChoiceItem>()
        });
        setQuestions(newQuestions);

        questionId.current++;
    }

    function onDeleteQuestion(e: SyntheticEvent) {
        const button = (e.target) as HTMLButtonElement;

        const questionKey = button.dataset['questionkey']?.toString() || '';

        if(questionKey === '')
            return;

        const newQuestion = {...questions.get(questionKey)} as QuestionItem;
        newQuestion.delete = true;
        
        const newQuestions = new Map(questions);
        newQuestions.set(questionKey, newQuestion);
        setQuestions(newQuestions);
    }

    async function onSubmit(e: SyntheticEvent) {
        const questionData = [];
        const questionKeys = Array.from(questions.keys());

        for(const k of questionKeys) {
            questionData.push({
                id: questions.get(k)?.id,
                delete: questions.get(k)?.delete,
                content: questions.get(k)?.content,
                choices: Array.from(questions.get(k)?.choices.values() || [])
            })
        }

        const data = {
            book,
            questions: questionData
        };

        setBannerVisible(true);

        const jsonResponse = await fetch(`${API_HOST}/admin/quiz/import`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        await jsonResponse.json();
    }

    useEffect(() => {
        const fetchedBook = async () => {
            const data = await (await fetch(`${API_HOST}/admin/quiz/book/${bookId}`)).json();
            const book = data.book;

            setBook({
                id: parseInt(book.id),
                title: book.title,
                fiction: book.fiction ? 'true' : 'false',
                year: book.year,
                author: book.author,
                publisher: book.publisher,
                genre: book.genre,
                isbn: book.isbn,
                lexile: book.lexile,
                wordCount: book.wordCount
            });

            const questions = data.questions;

            const newQuestions = new Map();
            for(const q of questions) {
                const newQuestion = {
                    id: q.id,
                    content: q.content,
                    choices: new Map()
                };

                let choiceKey = 0;
                for(const c of q.choices) {
                    newQuestion.choices.set(choiceKey.toString(), {
                        id: c.id,
                        content: c.content,
                        answer: c.answer
                    });

                    choiceKey++;
                }

                newQuestions.set(questionId.current.toString(), newQuestion);
                questionId.current++;
            }

            setQuestions(newQuestions);
        };

        fetchedBook();
    }, []);

    return (
        <div className="add-book-container container">
            <div className="row">
                <BookForm book={book} onBookChange={onBookChange} formAction={BookFormAction.Edit} />
            </div>
            <hr/>
            <div className="row">
                <div className="col col-md">
                    <button type="button" className="btn btn-secondary" onClick={onAddQuestion}>Add Question</button>
                </div>
                {
                    Array.from(questions.keys()).map(k => {
                        if (questions.get(k)?.delete)
                            return undefined;

                        return <QuestionForm   
                            key={k}
                            onChoiceFieldChange={onChoiceFieldChange}
                            onChoiceSelectChange={onChoiceSelectChange}
                            onAddChoice={onAddChoice}
                            onDelete={onDeleteQuestion}
                            onDeleteChoice={onDeleteChoice}
                            questionKey={k}
                            onChange={onChangeQuestion}
                            content={questions.get(k)?.content || ''}
                            choices={questions.get(k)?.choices || new Map()}
                        />
                    })
                }
            </div>
            <div className="row">
                <div className="col col-12">
                    <AlertBanner type={AlertBannerType.Success} visible={bannerVisible} message={"Submitted the book."} />
                </div>
            </div>
            <div className="row">
                <div className="col col-md">
                    <button type="button" className="btn btn-primary" onClick={onSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

