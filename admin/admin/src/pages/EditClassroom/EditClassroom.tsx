import React, { useState, useEffect, SyntheticEvent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { API_HOST } from '../../common/constants';
import AlertBanner, { AlertBannerType } from '../../components/AlertBanner';
import TextField from '../../components/TextField';
import SelectBox from '../../components/SelectBox';

interface EditClassroomProps extends RouteComponentProps {};

export default function EditClassroom(props: EditClassroomProps) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [id, setId] = useState(0);
    const [alertState, setAlertState] = useState({
        message: '',
        type: 0
    });
    const [teachers, setTeachers] = useState([]);
    const [teacherId, setTeacherId] = useState(0);
    const [options, setOptions] = useState([] as any);

    useEffect(() => {
        setId((props.match.params as any).id);
    }, []);

    useEffect(() => {
        if (id === 0)
            return;

        const fetchedClassroom = async () => {
            const teachers = await (await fetch(`${API_HOST}/teacher/list/all`)).json();
            const data = await (await fetch(`${API_HOST}/classroom/${id}`)).json();
            
            setName(data.name);
            setSlug(data.slug);
            setTeacherId(data.teacherId);

            if (teachers.teachers.length === 0)
                setTeachers([]);
            else
                setTeachers(teachers.teachers);
        };

        fetchedClassroom();
    }, [id]);

    useEffect(() => {
        setOptions(teachers.map((t: any) => ({
            label: `${t.firstName} ${t.lastName}`,
            value: t.id,
            selected: teacherId === t.id
        })));
    }, [teachers, teacherId]);

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
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, name, slug, teacherId})
        })).json();

        console.log(response);

        if (response.message) {
            setAlertState({
                type: AlertBannerType.Error,
                message: `Could not update the classroom. Reason: ${response.message}`
            });     
        }   else {
            setAlertState({
                type: AlertBannerType.Success,
                message: 'Successfully updated the classroom.'
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

    return (
        <div className="edit-classroom container">
            <div className="row">
                <div className="col col-12">
                    <h2>Edit Classroom</h2>
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