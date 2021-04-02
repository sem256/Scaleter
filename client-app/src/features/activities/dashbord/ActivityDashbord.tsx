import { observer } from 'mobx-react-lite'
import React, {useEffect,useContext} from 'react'
import { Dimmer, Grid, Loader } from 'semantic-ui-react'
import ActivityList from './ActivityList'
import ActivityStore from '../../../app/stores/activityStore'

const ActivityDashbord: React.FC = () => {
    const activityStore = useContext(ActivityStore);

    useEffect(() => {
      activityStore.loadActivities();
    }, [activityStore])
  
    if (activityStore.loadingInitial) {
      return (
        <Dimmer active inverted>
          <Loader inverted content='Loading' />
        </Dimmer>)
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity filtes</h2>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashbord)
