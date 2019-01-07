import React, {Component} from 'react';
import './app-header.scss';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import Auth  from "../../auth/Auth";
import Button from '@material-ui/core/Button';

import {withRouter} from 'react-router-dom';

class AppHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            userGroup: []
        }
    }

    async componentWillMount() {
        if (Auth.isUserSignedIn()) {
            this.setState({userGroup: 'SystemAdmin'});
        }
    }

    handle = async event => {
        if (Auth.isUserSignedIn()) {
            await Auth.signOut();
            this.setState({userGroup: []});
            event.target.innerHTML = 'Login'
            alert("sign out")
        }else {
            await Auth.getSession();
            alert("sign in")
            event.target.innerHTML = 'Logout'
        }
    }

    render(){
        return(
            <div className="app-header-container" >
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Link to={"/device-directory/300"}><img src="/images/LogitechLogo.png" alt="Logitech Logo" /></Link>
                        <h4>IoT Device Management Console</h4>
                        {this.state.userGroup[0] ? <h4 style={{ flex: 1 }}>{this.state.userGroup[0]}</h4> : null}
                        <Button href="/" style={{ flex: 1 }} color="inherit" onClick={this.handle}>Login</Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }

}

export default withRouter(AppHeader);
