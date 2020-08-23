import React, { useState, SyntheticEvent, useEffect } from 'react';
import TextField from '../../components/TextField';
import AlertBanner, { AlertBannerType } from '../../components/AlertBanner';
import { RouteComponentProps } from 'react-router-dom';
import { API_HOST } from '../../common/constants';

interface EditTeacherProps extends RouteComponentProps {};

export default function EditTeacher(props: EditTeacherProps) {
    const [id, setId] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [user, setUser] = useState({
        username: '',
        id: 0
    });
    const [alertState, setAlertState] = useState({
        message: '',
        type: 0
    });

    useEffect(() => {
        setId((props.match.params as any).id);
    }, []);

    useEffect(() => {
        // get the teacher
        const getTeacher = async () => {
            const teacher = await (await fetch(`${API_HOST}/teacher/${id}`)).json();

            setFirstName(teacher.firstName);
            setMiddleName(teacher.middleName);
            setLastName(teacher.lastName);
            setUser({
                username: teacher.username,
                id: teacher.userId
            })
        };

        getTeacher();
    }, [id]);

    function onFirstNameChange(e: SyntheticEvent) {
        const value = (e.target as HTMLInputElement).value;

        setFirstName(value);
    }

    function onMiddleNameChange(e: SyntheticEvent) {
        const value = (e.target as HTMLInputElement).value;

        setMiddleName(value);
    }

    function onLastNameChange(e: SyntheticEvent) {
        const value = (e.target as HTMLInputElement).value;

        setLastName(value);
    }

    async function submitForm() {
        const response = await (await fetch(`${API_HOST}/teacher`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                middleName,
                id,
                userId: user.id
            })
        })).json();

        if (response.message) {
            setAlertState({
                type: AlertBannerType.Error,
                message: `Could not update the teacher. Reason: ${response.message}`
            });     
        }   else {
            setAlertState({
                type: AlertBannerType.Success,
                message: 'Successfully updated the teacher.'
            });
        } 
    }

    return (
        <div className="container edit-teacher-container">
            <div className="row">
                <div className="col col-12">
                    <h2>Edit Teacher</h2>
                </div>
            </div>
            <div className="row">
                <div className="col col-6">
                    <TextField id="edit-teacher-first-name" label="First Name" value={firstName} onChange={onFirstNameChange} />
                </div>
            </div>
            <div className="row">
                <div className="col col-6">
                    <TextField id="edit-teacher-middle-name" label="Middle Name" value={middleName} onChange={onMiddleNameChange} />
                </div>
            </div>
            <div className="row">
                <div className="col col-6">
                    <TextField id="edit-teacher-last-name" label="Last Name" value={lastName} onChange={onLastNameChange} />
                </div>
            </div>
            <div className="row">
                <div className="col col-2">
                    <label>
                        <strong>Username</strong>
                    </label>
                </div>
                <div className="col col-4">
                    <label>{user.username}</label>
                </div>
            </div>
            <div className="row">
                <div className="col col-12">
                    {
                        alertState.type 
                            ? <AlertBanner message={alertState.message} type={alertState.type} visible={true} /> 
                            : undefined
                    }
                </div>
            </div>
            <div className="row">
                <div className="col col-2">
                    <button type="button" className="btn btn-primary" onClick={submitForm}>Submit</button>
                </div>
            </div>
        </div>
    );
}