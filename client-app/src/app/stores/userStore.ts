import { makeObservable, runInAction } from 'mobx';
import { RootStore } from './rootStore';
import { IUser, IUserFormValues } from './../models/IUres';
import { action, computed, observable } from 'mobx';
import agent from "../api/agent"
import { history } from '../..';

export default class UserStore {
    rootStore: RootStore;
  
    constructor(rootStore: RootStore){
      this.rootStore = rootStore;

      makeObservable(this);
    }

    @observable user: IUser | null = null;

    @computed get isLoggedIn(){
        return !!this.user
    }

    @action login = async (values: IUserFormValues) => {
        try{
            const user = await agent.User.login(values);
            runInAction(()=>{
                this.user = user;
            })
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push('/activities')
        }catch(e){
            throw e;
        }
    }

    @action register = async (valuse: IUserFormValues) => { 
        try{
            const user = await agent.User.register(valuse);
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push('/activities')
        } catch (e) {
            throw e;
        } 
    }

    @action getUser = async () => {
        try {
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            });
        } catch (e) {
            console.log(e);
        }
    }

    @action logout = () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/');
    }

    
}