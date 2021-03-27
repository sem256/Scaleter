import React, { useEffect, Fragment, useContext } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Container, Loader, Dimmer } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashbord from '../../features/activities/dashbord/ActivityDashbord';
import ActivityStore from "../stores/activityStore";
import { observer } from "mobx-react-lite"

const App = () => {
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
    <Fragment>
      <Loader inverted content='Loading...' />
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashbord />
      </Container>
    </Fragment>
  )
}

export default observer(App);
