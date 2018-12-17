import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import DeviceDetails from './components/zone/zone-details';
import DeviceList from './components/zone/zone-list';
import AddUser from './components/user/add-user';
import AddOrg from './components/organization/add-org';
import OrgDetails from './components/organization/org-details';
import OrgList from './components/organization/org-list';
import UserList from './components/user/user-list';
import ContactAdmin from './components/user/login/contact-admin';
import { Auth } from "aws-amplify";
import AWS from 'aws-sdk';

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
    AWS.config.region = 'us-east-1';
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
    await Auth.currentSession()
    .then((user)=>{
      this.setState({userGroup: user.accessToken.payload['cognito:groups'], loggedIn: true});
      this.userHasAuthenticated(true);
      console.log(user)
    });
    this.setState({ isAuthenticating: false });
  }
  checkAdmins(){
    return this.state.userGroup.some((item)=>{return item === "ResellerAdmin" || item === "SystemAdmin"})
  }
  checkOrgAdmin(){
    return this.state.userGroup.some((item)=>{return item === "ResellerAdmin" || item === "SystemAdmin" || item === "CustomerAdmin"})
  }
  checkResellerViewer(){
    return this.state.userGroup.some((item)=>{return item === "ResellerAdmin" || item === "SystemAdmin" || item === "CustomerAdmin" || item === "ResellerViewer"})
  }

  render(){
    return (
      !this.state.isAuthenticating &&
      <div className="App">
        <Router>
          <Switch>
            {this.state.userGroup === undefined ? <ContactAdmin /> : null }
            <Redirect exact from="/device-directory" to='/device-directory/300' />
            <Route exact path="/" render={()=>(this.state.loggedIn ? (<Redirect to='/device-directory/300' />) : (null) )}/>
            {this.state.loggedIn ? <Route path="/device-directory/:dataLength" component={DeviceList}/> : null}
            {this.state.loggedIn ? <Route path="/device/:id/:type" component={DeviceDetails} /> : null}
            <Route path="/org-manager" render={()=>(this.checkResellerViewer() ? (<OrgList/>) : (<Redirect to='/device-directory/300' />))}/>
            <Route path="/org-details" render={()=>(this.checkOrgAdmin() ? (<OrgDetails/>) : (<Redirect to='/device-directory/300' />))}/>
            <Route path="/user-manager" render={()=>(this.checkResellerViewer() ? (<UserList/>) : (<Redirect to='/device-directory/300' />))}/>
            <Route path="/add-org" render={()=>(this.checkAdmins() ? (<AddOrg/>) : (<Redirect to='/device-directory/300' />))} />
            <Route path="/add-user" render={()=>(this.checkOrgAdmin() ? (<AddUser/>) : (<Redirect to='/device-directory/300' />))}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
