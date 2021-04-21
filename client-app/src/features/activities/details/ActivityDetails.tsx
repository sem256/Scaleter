import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Dimmer, Grid, Loader } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore'
import ActivityDetailedChat from './ActivityDetailedChat'
import ActivityDetailedHeader from './ActivityDetailedHeader'
import ActivityDetailedInfo from './ActivityDetailedInfo'
import { ActivityDetailedSidebar } from './ActivityDetailedSidebar'

interface DetailParams {
    id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({match}) => {

    const rootStore = useContext(RootStoreContext);
    const {activity, loadActivity, loadingInitial} = rootStore.activityStore;

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id])

    if(loadingInitial) 
    {
        return (<Dimmer active inverted>
            <Loader inverted content='Loading actvivity...' />
        </Dimmer>)
    }

    if(!activity){
        return <h2>Activity not found!</h2>
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity}/>
                <ActivityDetailedInfo  activity={activity}/>
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDetails)
