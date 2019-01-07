import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import AddUser from './components/user/add-user';
import AddOrg from './components/organization/add-org';
import OrgDetails from './components/organization/org-details';
import OrgList from './components/organization/org-list';
import UserList from './components/user/user-list';
import Index from './components/index/index-details'
import Auth from './auth/Auth'
import Sidenav from './components/sidenav';

import './styles/App.scss';

class App extends Component {
  constructor(props){
    super(props);
    this.state= {
      userGroup: [],
      loggedIn: false,
      isAuthenticated: false,
      isAuthenticating: true
    }
  }
  componentWillMount(){
    this.userAuth();
  }
  componentWillReceiveProps(){
    this.userAuth();
  }
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }
  async userAuth(){
    if (Auth.isUserSignedIn()) {
        this.setState({userGroup: 'SystemAdmin', loggedIn: true});
    }

    this.setState({ isAuthenticating: false });
  }
  checkAdmins(){
    return true;
    // return this.state.userGroup.some((item)=>{return item === "ResellerAdmin" || item === "SystemAdmin"})
  }
  checkOrgAdmin(){
    return true;
    // return this.state.userGroup.some((item)=>{return item === "ResellerAdmin" || item === "SystemAdmin" || item === "CustomerAdmin"})
  }
  checkResellerViewer(){
    return true;
    // return this.state.userGroup.some((item)=>{return item === "ResellerAdmin" || item === "SystemAdmin" || item === "CustomerAdmin" || item === "ResellerViewer"})
  }

  render(){
    return (
      !this.state.isAuthenticating &&
      <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact render={()=> <Redirect to='/index' />}/>
            <Route path="/org-manager" render={()=>(this.checkResellerViewer() ? (<OrgList/>) : (<Redirect to='/index' />))}/>
            <Route path="/org-details" render={()=>(this.checkOrgAdmin() ? (<OrgDetails/>) : (<Redirect to='/index' />))}/>
            <Route path="/user-manager" render={()=>(this.checkResellerViewer() ? (<UserList/>) : (<Redirect to='/index' />))}/>
            <Route path="/add-org" render={()=>(this.checkAdmins() ? (<AddOrg/>) : (<Redirect to='/index' />))} />
            <Route path="/add-user" render={()=>(this.checkOrgAdmin() ? (<AddUser/>) : (<Redirect to='/index' />))}/>
            <Route path="/index" render={() => <Index/>}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
