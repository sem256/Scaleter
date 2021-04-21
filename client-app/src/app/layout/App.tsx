import React, { Fragment, useContext, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Container, Dimmer, Loader } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashbord from '../../features/activities/dashbord/ActivityDashbord';
import { observer } from "mobx-react-lite"
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { HomePage } from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
import LoginForm from '../../features/user/LoginForm';
import { RootStoreContext } from '../stores/rootStore';
import ModalContainer from '../common/modals/ModalContainer';

const App: React.FC<RouteComponentProps> = ({location}) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if(token){
      getUser().finally(() => setAppLoaded());
    }else{
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token, appLoaded]);

  if(!appLoaded){
    return (
      <Dimmer active inverted>
        <Loader inverted content='Loading app...' />
      </Dimmer>)
  }

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position='bottom-right'/>
      <Route exact path='/' component={HomePage} />
      <Route path={'/(.+)'} render={() => (
        <Fragment>
          <NavBar />
          <Container style={{ marginTop: "7em" }}>
            <Switch>
              <Route exact path='/activities' component={ActivityDashbord} />
              <Route path='/activities/:id' component={ActivityDetails} />
              <Route path='/login' component={LoginForm} />
              <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
              <Route component={NotFound} />
            </Switch>
          </Container>
        </Fragment>
      )} />
    </Fragment>
  )
}

export default withRouter(observer(App));
