import React, { useState, SyntheticEvent, useEffect } from 'react';
import { API_HOST } from '../../common/constants';
import AlertBanner, { AlertBannerType } from '../../components/AlertBanner';
import TextField from '../../components/TextField';
import SelectBox from '../../components/SelectBox';

export default function AddClassroom() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [alertState, setAlertState] = useState({
        message: '',
        type: 0
    });
    const [teachers, setTeachers] = useState([]);
    const [teacherId, setTeacherId] = useState(0);

    useEffect(() => {
        const getData = async () => {
            const data = await (await fetch(`${API_HOST}/teacher/list/all`)).json();

            if (data.teachers.length === 0)
                return;
            
            setTeachers(data.teachers);
        };

        getData();
    }, []);

    useEffect(() => {
        if (teachers.length === 0)
            return;
        
        setTeacherId((teachers[0] as any).id);
    }, [teachers])

    function onNameChange(e: SyntheticEvent) {
        const value = e.target as HTMLInputElement;
        
        setName(value.value);
    }

    function onSlugChange(e: SyntheticEvent) {
        const value = e.target as HTMLInputElement;

        setSlug(value.value);
    }

    async function submitForm() {
        const response = await (await fetch(`${API_HOST}/classroom`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, slug, teacherId})
        })).json();

        if (response.message) {
            setAlertState({
                type: AlertBannerType.Error,
                message: `Could not add the classroom. Reason: ${response.message}`
            });     
        }   else {
            setAlertState({
                type: AlertBannerType.Success,
                message: 'Successfully added the classroom.'
            });
        } 
    }

    function onTeacherChange(e: SyntheticEvent) {
        const select = e.target as HTMLSelectElement;

        const selected = select.options.item(select.selectedIndex);

        if (!selected)
            return;

        setTeacherId(parseInt(selected.value));
    }

    const options = teachers.map((t: any) => ({
        label: `${t.firstName} ${t.lastName}`,
        value: t.id,
        selected: teacherId === t.id
    }));

    return (
        <div className="add-classroom container">
            <div className="row">
                <div className="col col-12">
                    <h2>Add Classroom</h2>
                </div>
            </div>
            <div className="row">
                <div className="col col-6">
                    <TextField id="add-classroom-name" label="Name" value={name} onChange={onNameChange} />
                </div>
            </div>
            <div className="row">
                <div className="col col-6">
                    <TextField id="add-classroom-slug" label="Slug" value={slug} onChange={onSlugChange} />
                </div>
            </div>
            <div className="row">
                <div className="col col-6">
                    <SelectBox id="add-classroom-teacher" label="Teacher" options={options} onChange={onTeacherChange} />
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
