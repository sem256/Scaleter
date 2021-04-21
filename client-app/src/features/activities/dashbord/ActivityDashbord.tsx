import { observer } from 'mobx-react-lite'
import React, {useEffect,useContext} from 'react'
import { Dimmer, Grid, Loader } from 'semantic-ui-react'
import ActivityList from './ActivityList'
import { RootStoreContext } from '../../../app/stores/rootStore'

const ActivityDashbord: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {loadActivities, loadingInitial} = rootStore.activityStore;

    useEffect(() => {
      loadActivities();
    }, [loadActivities])
  
    if (loadingInitial) {
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
