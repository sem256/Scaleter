import { RootStore } from './rootStore';
import { toast } from 'react-toastify';
import { IActivity } from './../models/activity';
import { observable, action, makeObservable, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import agent from '../api/agent';
import { history } from '../..';

export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore){
    this.rootStore = rootStore;
    makeObservable(this);
  }

  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()))
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(sortedActivities.reduce((activities, activity) => {
      const date = activity.date.toISOString().split('T')[0];
      activities[date] = activities[date] ? [...activities[date], activity] : [activity];
      return activities;
    }, {} as {[key: string]: IActivity[] }));
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = new Date(activity.date);
          this.activityRegistry.set(activity.id, activity);
        })
        this.loadingInitial = false
      })
    } catch (e) {
      runInAction(() => { this.loadingInitial = false })
    }
  }

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity
      return activity;
    }
    else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction(() => {
          activity.date = new Date(activity.date)
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        
        return activity;
      } catch (e) {
        runInAction(() => {
          this.loadingInitial = false;
        })
        console.log(e)
      }
    }
  }

  @action clearActivity = () => {
      this.activity = null;
  }

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });
      toast.error("Problem submitting error");
      console.log(error);
    }
  }

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (e) {
      runInAction(() => {
        this.submitting = false;
      });
      toast.error("Problem submitting error");
      console.log(e);
    }
  }

  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      })
    } catch (e) {
      runInAction(() => {
        this.submitting = false;
        this.target = '';
      })
      console.log(e);
    }
  }
}