import React, { useState, SyntheticEvent, useEffect } from 'react';
import TextField from '../../components/TextField';
import { API_HOST } from '../../common/constants';
import SelectBox from '../../components/SelectBox';
import AlertBanner, { AlertBannerType } from '../../components/AlertBanner';

export default function AddTeacher() {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userId, setUserId] = useState(0);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [alertState, setAlertState] = useState({
        message: '',
        type: 0
    });

    useEffect(() => {
        const setupAvailableUsers = async () => {
            const users = await (await fetch(`${API_HOST}/admin/user/available`)).json();

            console.log(users);
            if (users.length === 0)
                setAvailableUsers([]);
            else
                setAvailableUsers(users);
        };

        setupAvailableUsers();
    }, []);

    useEffect(() => {
        if (availableUsers.length === 0)
            return;

        setUserId((availableUsers[0] as any).id);
    }, [availableUsers]);

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

    function onAvailableUserChange(e: SyntheticEvent) {
        const select = (e.target as HTMLSelectElement);

        const selectedOption = select.options.item(select.selectedIndex);

        if (!selectedOption)
            return;

        setUserId(parseInt(selectedOption.value));
    }

    async function submitForm() {
        const response = await (await fetch(`${API_HOST}/admin/teacher`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                middleName,
                lastName,
                userId
            })
        })).json();

        if (response.message) {
            setAlertState({
                type: AlertBannerType.Error,
                message: `Could not add the teacher. Reason: ${response.message}`
            });     
        }   else {
            setAlertState({
                type: AlertBannerType.Success,
                message: 'Successfully added the teacher.'
            });
        } 
    }

    const options = availableUsers.map((u: any) => ({
        label: u.username,
        value: u.id,
        selected: false
    }));

    return (
        <div className="container add-teacher-container">
            <div className="row">
                <div className="col col-12">
                    <h2>Add Teacher</h2>
                </div>
            </div>
            <div className="row">
                <div className="col col-6">
                    <TextField label="First Name" id="add-teacher-first-name" value={firstName} onChange={onFirstNameChange} />
                </div>
            </div>
            <div className="row">
                <div className="col col-6">
                    <TextField label="Middle Name" id="add-teacher-middle-name" value={middleName} onChange={onMiddleNameChange} />
                </div>
            </div>
            <div className="row">
                <div className="col col-6">
                    <TextField label="Last Name" id="add-teacher-last-name" value={lastName} onChange={onLastNameChange} />
                </div>
            </div>
            <div className="row">
                <div className="col col-6">
                    <SelectBox id={'add-teacher-available-users'} label={'Available Users'} options={options} onChange={onAvailableUserChange} />
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