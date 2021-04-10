import React, { useContext, useState, useEffect } from 'react'
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
import { ActivityFormValues } from '../../../app/models/activity'
import { v4 as uuid } from 'uuid'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'
import { Form as FinalForm, Field } from 'react-final-form'
import { TextInput } from '../../../app/common/form/TextInput'
import TestAreaInput from '../../../app/common/form/TestAreaInput'
import { SelectInput } from '../../../app/common/form/SelectInput'
import { category } from '../../../app/common/options/CategoryOptions'
import { DateInput } from '../../../app/common/form/DateInput'
import { combineDateTime } from '../../../app/common/util/util'
import { combineValidators, composeValidators, hasLengthGreaterThan, isRequired } from 'revalidate'

const validate = combineValidators({
    title: isRequired({message: 'The event title is required'}),
    category: isRequired({message: 'Category'}),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message: 'Description needs to be at leest 5 characters'})
    )(),
    city: isRequired("City"),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
});

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
    const activityStore = useContext(ActivityStore);
    const { createActivity,
        editActivity,
        submitting,
        loadActivity
    } = activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id).then(
                (activity) => setActivity(new ActivityFormValues(activity)))
                .finally(() => setLoading(false));
        }
    }, [loadActivity, match.params.id]);

    const handleFinalFormSubmit = (values: any) => {
        var dateTime = combineDateTime(values.date, values.time);
        const { date, time, ...activity } = values;
        activity.date = dateTime;
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        validate={validate}
                        initialValues={activity}
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit, invalid, pristine }) => {
                            return (
                                <Form onSubmit={handleSubmit} loading={loading}>
                                    <Field
                                        name='title'
                                        placeholder='Title'
                                        value={activity.title}
                                        component={TextInput} />
                                    <Field
                                        rows={2} name='description'
                                        placeholder='Description'
                                        value={activity.description}
                                        rowa={3}
                                        component={TestAreaInput} />
                                    <Field
                                        component={SelectInput}
                                        options={category}
                                        placeholder='Category'
                                        name='category'
                                        value={activity.category} />
                                    <Form.Group width="equal">
                                        <Field
                                            component={DateInput}
                                            placeholder='Date'
                                            name='date'
                                            isDate={true}
                                            value={activity.date} />
                                        <Field
                                            component={DateInput}
                                            placeholder='Time'
                                            name='time'
                                            isDate={false}
                                            value={activity.time} />
                                    </Form.Group>
                                    <Field
                                        component={TextInput}
                                        placeholder='City'
                                        name='city'
                                        value={activity.city} />
                                    <Field
                                        component={TextInput}
                                        placeholder='Veneu'
                                        name='venue'
                                        value={activity.venue} />
                                    <Button loading={submitting} 
                                        disabled={loading || invalid || pristine} 
                                        floated='right' 
                                        positive  
                                        type='submit' 
                                        content='Submit' />
                                    <Button onClick={
                                        activity.id ?
                                        () => history.push(`/activities/${activity.id}`) : 
                                        () => history.push('/activities')} 
                                        disabled={loading || invalid || pristine} 
                                        floated='right' 
                                        content='Cancel' />
                                </Form>)
                        }}
                    />

                </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityForm)
