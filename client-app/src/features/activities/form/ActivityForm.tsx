import React, { FormEvent, useContext, useState, useEffect } from 'react'
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { v4 as uuid } from 'uuid'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'

interface DetailParams{
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {
    const activityStore = useContext(ActivityStore);
    const {createActivity, 
        editActivity, 
        submitting, 
        activity: initialFormActivity, 
        loadActivity,
        clearActivity
    } = activityStore;
    
    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
         setActivity({
             ...activity,
             [name]: value
         });
    }

    const [activity, setActivity] = useState<IActivity>({
        id: "",
        title: "",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: ""
    });

    useEffect(() => {
        if (match.params.id && activity.id.length === 0) {
            loadActivity(match.params.id).then(()=> initialFormActivity && setActivity(initialFormActivity))
        }
        return () => {
            clearActivity();
        }
    }, [loadActivity, clearActivity, match.params.id, initialFormActivity, activity.id.length]);

    const handleSubmit = () => {
        console.log(activity);
        if(activity.id.length === 0 ){
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity).then(() => {
                history.push(`/activities/${newActivity.id}`)
            });
        }else{
            editActivity(activity).then(() => {
                history.push(`/activities/${activity.id}`)
            }); 
        }
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <Form onSubmit={handleSubmit}>
                        <Form.Input onChange={handleInputChange} name='title' placeholder='Title' value={activity.title} />
                        <Form.TextArea onChange={handleInputChange} rows={2} name='description' placeholder='Description' value={activity.description} />
                        <Form.Input onChange={handleInputChange} placeholder='Category' name='category' value={activity.category} />
                        <Form.Input onChange={handleInputChange} type='datetime-local' placeholder='Date' name='date' value={activity.date} />
                        <Form.Input onChange={handleInputChange} placeholder='City' name='city' value={activity.city} />
                        <Form.Input onChange={handleInputChange} placeholder='Veneu' name='venue' value={activity.venue} />
                        <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
                        <Button onClick={() => history.push('/activities')} floated='right' content='Cancel' />
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityForm)
