import React from 'react'
import { Button, Card, Image } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'

interface IProps {
    activity: IActivity;
    setEditMode: (editMode: boolean) => void;
    setSelectedActivity: (activity: IActivity | null) => void;
}

export const ActivityDetails: React.FC<IProps> = ({activity, setEditMode, setSelectedActivity}) => {
    return (
        <Card>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content>
                <Button.Group widths={3}>
                    <Button basic color='blue' content='Edit' onClick={()=> setEditMode(true)}/>
                    <Button basic color='grey' content='Cancel' onClick={() => {setSelectedActivity(null)}} />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}
