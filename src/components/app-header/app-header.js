import React, {Component} from 'react';
import './app-header.scss';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { Auth } from "aws-amplify";
import Button from '@material-ui/core/Button';

import {withRouter} from 'react-router-dom';

class AppHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            isAuthenticated: false,
            userGroup: []
        }
    }

    async componentWillMount() {
        try {
            await Auth.currentSession()
            .then((user)=>{
                this.userHasAuthenticated(true);
                this.setState({userGroup: user.accessToken.payload['cognito:groups']});
            });
        }
        catch(e) {
            if (e !== 'No current user') {
                // alert(e);
            }
        }
    }

    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: authenticated });
    }

    handleLogout = async event => {
        await Auth.signOut();
        this.userHasAuthenticated(false);
        this.setState({userGroup: []});
        this.props.history.push("/");
    }

    render(){
        return(
            <div className="app-header-container" >
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Link to={"/device-directory/300"}><img src="/images/LogitechLogo.png" alt="Logitech Logo" /></Link>
                        <h4>IoT Device Management Console</h4>
                        {this.state.userGroup[0] ? <h4 style={{ flex: 1 }}>{this.state.userGroup[0]}</h4> : null}
                        {this.state.isAuthenticated &&
                        <Button href="/" style={{ flex: 1 }} color="inherit" onClick={this.handleLogout}>Logout</Button>}
                    </Toolbar>
                </AppBar>
            </div>
        )
    }

}

export default withRouter(AppHeader);