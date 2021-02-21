import React, { useState, useEffect, Fragment, SyntheticEvent } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import { NavBar } from '../../features/nav/NavBar';
import { ActivityDashbord } from '../../features/activities/dashbord/ActivityDashbord';
import { Activities } from '../api/agent';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(x => x.id === id)[0]);
    setEditMode(false);
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);
    Activities.create(activity).then(() => {
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  }

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    Activities.update(activity).then(() => {
      setActivities([...activities.filter(x => x.id !== activity.id), activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false))
  }

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmitting(true)
    setTarget(event.currentTarget.name)
    Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
    }).then(() => setSubmitting(false))
  }

  useEffect(() => {
    Activities.list()
      .then(response => {
        let activities: IActivity[] = [];
        response.forEach((activity) => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity)
        })
        setActivities(activities);
      });
  }, [])

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashbord
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </Container>
    </Fragment>
  )
}

export default App;
