import React, { FormEvent, useContext, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { v4 as uuid } from 'uuid'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'

interface IProps {
    activity: IActivity;
}

const ActivityForm: React.FC<IProps> = ({activity: initialFormActivity}) => {
    const activityStore = useContext(ActivityStore);
    const {createActivity, editActivity, submitting, cancelFormOpen} = activityStore;
    
    const initializeForm = () => {
        if(initialFormActivity){
            return initialFormActivity;
        } 
        return {
            id: "",
            title: "",
            category: "",
            description: "",
            date: "",
            city: "",
            venue: ""
        };
    };

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
         setActivity({
             ...activity,
             [name]: value
         });
    }

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    const handleSubmit = () => {
        console.log(activity);
        if(activity.id.length === 0 ){
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        }else{
            editActivity(activity); 
        }
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input onChange={handleInputChange} name='title' placeholder='Title' value={activity.title}/>
                <Form.TextArea onChange={handleInputChange} rows={2} name='description' placeholder='Description' value={activity.description}/>
                <Form.Input onChange={handleInputChange} placeholder='Category' name='category' value={activity.category}/>
                <Form.Input onChange={handleInputChange} type='datetime-local' placeholder='Date' name='date' value={activity.date}/> 
                <Form.Input onChange={handleInputChange} placeholder='City' name='city' value={activity.city}/>
                <Form.Input onChange={handleInputChange} placeholder='Veneu' name='venue' value={activity.venue}/>
                <Button loading={submitting} floated='right' positive type='submit' content='Submit'/>
                <Button onClick={cancelFormOpen} floated='right' content='Cancel'/>
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm)
