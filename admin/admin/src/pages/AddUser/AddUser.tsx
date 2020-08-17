import React, { useState, SyntheticEvent } from 'react';
import './AddUser.css';
import TextField, { TextFieldType } from '../../components/TextField';
import AlertBanner, { AlertBannerType } from '../../components/AlertBanner';
import { API_HOST } from '../../common/constants';

export default function AddUser() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alertState, setAlertState] = useState({
        message: '',
        type: 0
    });

    function onUsernameChange(e: SyntheticEvent) {
        const value = (e.target as HTMLInputElement).value;

        setUsername(value);
    }

    function onPasswordChange(e: SyntheticEvent) {
        const value = (e.target as HTMLInputElement).value;

        setPassword(value);
    }

    async function submitForm() {
        const response = await (await fetch(`${API_HOST}/admin/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        })).json();

        if (response.message) {
            setAlertState({
                type: AlertBannerType.Error,
                message: `Could not add the User. Reason: ${response.message}`
            });     
        }   else {
            setAlertState({
                type: AlertBannerType.Success,
                message: 'Successfully added the User.'
            });
        } 
    }

    return (
        <div className="container add-user-container">
            <div className="row">
                <div className="col col-12">
                    <h2>Add User</h2>
                </div>
            </div>
            <div className="row">
                <div className="col col-6">
                    <TextField label="Username" id="add-user-username" value={username} onChange={onUsernameChange} />
                </div>
            </div>
            <div className="row">
                <div className="col col-6">
                    <TextField label="Password" id="add-user-password" value={password} onChange={onPasswordChange} type={TextFieldType.Password} />
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