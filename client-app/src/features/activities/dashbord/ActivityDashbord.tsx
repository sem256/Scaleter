import React, { SyntheticEvent } from 'react'
import { Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { ActivityDetails } from '../details/ActivityDetails'
import { ActivityForm } from '../form/ActivityForm'
import { ActivityList } from './ActivityList'

interface IProps {
    activities: IActivity[];
    selectActivity: (id: string) => void;
    selectedActivity: IActivity | null;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    setSelectedActivity: (activity: IActivity | null) => void;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    deleteActivity: (e:SyntheticEvent<HTMLButtonElement> ,id: string) => void;
    submitting: boolean;
    target: string;
}

export const ActivityDashbord: React.FC<IProps> = (props) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList 
                    activities={props.activities} 
                    selectActivity={props.selectActivity}
                    deleteActivity={props.deleteActivity}
                    submitting={props.submitting} 
                    target={props.target}/>
            </Grid.Column>
            <Grid.Column width={6}>
                {props.selectedActivity
                    && !props.editMode
                    && <ActivityDetails 
                            activity={props.selectedActivity} 
                            setEditMode={props.setEditMode} 
                            setSelectedActivity={props.setSelectedActivity}/>}
                {props.editMode  
                    && <ActivityForm  
                            key = {props.selectedActivity?.id}
                            setEditMode={props.setEditMode}
                            activity={props.selectedActivity!} 
                            createActivity={props.createActivity}
                            editActivity={props.editActivity}
                            submitting={props.submitting}/>}
            </Grid.Column>
        </Grid>
    )
}
