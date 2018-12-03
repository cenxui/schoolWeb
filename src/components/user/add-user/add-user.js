import React from "react";
import AppHeader from '../../app-header';
import Sidenav from '../../sidenav';
import './add-user.scss';
import { Row, Col } from 'react-flexbox-grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import {withRouter} from 'react-router-dom';
import { Auth } from 'aws-amplify';
import API from '../../../utils/API';
import AWS from 'aws-sdk';
import config from "../../../config";

class AddUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            org: '',
            dept: '',
            userRole: '',
            userName: '',
            value: { name: '', touched: false },
            disable: false,
            loggedInUser: {
                email: '',
                org: '',
                role: ''
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.confirmUser = this.confirmUser.bind(this);
        this.addUserToGroup = this.addUserToGroup.bind(this);
        this.setUserOrg = this.setUserOrg.bind(this);
    }
    componentDidMount(){
        var cognitoUser = Auth.currentAuthenticatedUser();
        if (cognitoUser != null) {
            Auth.currentSession()
            .then((user)=>{
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'us-east-1:3a1afec3-e04d-4fa0-9cbe-1f5aeb54870c',
                    AccountId: '638670203470',
                    Region: 'us-east-1',
                    Logins: {
                        'cognito-idp.us-east-1.amazonaws.com/us-east-1_kERTVbjkm': user.getIdToken().getJwtToken(),
                    }
                });
                AWS.config.credentials.refresh((error) => {
                    if (error) {
                        console.error(error);
                    }
                    });
                    var config = new AWS.Config({
                        accessKeyId: user.accessKeyId,
                        secretAccessKey: user.secretAccessKey,
                        region: 'us-east-1'
                    });
                    this.setState({loggedInUser: { email: user.idToken.payload.email, org: user.idToken.payload['custom:org'], role: user.idToken.payload['cognito:groups']}})
                    this.setState({org: this.state.loggedInUser.org })
            }
            );
        }
    }
    setUserOrg(){
        if(!this.state.loggedInUser.org===undefined || this.state.loggedInUser.org==="Logitech" || this.state.loggedInUser.org==="All"){
            this.setState({org: this.state.loggedInUser.org })
        }
    }
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleCheck = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    async confirmUser(){
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        let confirmParams={
            UserPoolId: config.cognito.USER_POOL_ID,
            Username: this.state.email
        }
        cognitoidentityserviceprovider.adminConfirmSignUp(confirmParams, function(err, data) {
            if (err) console.log(err, err.stack);
        })
        await this.addUserToGroup();
    }

    addUserToGroup(){
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        let groupParams={
            GroupName: this.state.userRole,
            UserPoolId: config.cognito.USER_POOL_ID,
            Username: this.state.userName
        }
        cognitoidentityserviceprovider.adminAddUserToGroup(groupParams, function(err, data) {
            if (err) console.log(err, err.stack);

        });
    }

    async handleSubmit() {
        let newUser = {
            "TableName": "LogitechDeviceUser",
            "Item":
            {
                    "firstName" : {"S" : this.removeWhiteSpace(this.state.firstName)},
                    "lastName": {"S" : this.removeWhiteSpace(this.state.lastName)},
                    "org": {"SS" : [this.removeWhiteSpace(this.state.org)]},
                    "dept": {"S" : this.removeWhiteSpace(this.state.dept)},
                    "userRole": {"S" : this.removeWhiteSpace(this.state.userRole)},
                    "EmailAddress": {"S" : this.removeWhiteSpace(this.state.email)}
                }
        }
        await Auth.signUp({
            username: this.state.email,
            password: 'P@ssw0rd',
            attributes: {
                'email': this.state.email,
                'name': this.removeWhiteSpace(this.state.firstName) + ' ' + this.removeWhiteSpace(this.state.lastName),
                'custom:org': this.removeWhiteSpace(this.state.org),
            }
            })
            .then(data => {this.setState({userName:data.userSub})})
            .catch(err => console.log('error', err));
            this.confirmUser();
        API.addUser(newUser)
        .catch(err => console.log(err));
    }
    removeWhiteSpace(str) {
        str = str.replace(/\s+/g, '');
        return str;
    }

    render () {
        return(
            <div className="app-container">
                <AppHeader />
                <Row lg={12}>
                    <Col lg={2} className="sidenav-container">
                        <Sidenav />
                    </Col>
                    <Col lg={10} className="main-container">
                        <Paper className="main-paper">
                            <Row lg={12}>
                                <form>
                                    <Col lg={12}>
                                        <Row lg={12}>
                                            <Col lg={4} className="input-col">
                                                <TextField
                                                    name="firstName"
                                                    label="First Name"
                                                    value={this.state.firstName}
                                                    onChange={this.handleChange}
                                                    margin="normal"
                                                />
                                                <TextField
                                                    name="lastName"
                                                    label="Last Name"
                                                    value={this.state.lastName}
                                                    onChange={this.handleChange}
                                                    margin="normal"
                                                />
                                            </Col>
                                            <Col lg={4} className="input-col">
                                                {this.state.loggedInUser.role.includes("ResellerAdmin") || this.state.loggedInUser.role.includes("SystemAdmin")  ?
                                                <TextField
                                                    name="org"
                                                    label="Organization"
                                                    value={this.state.org}
                                                    onChange={this.handleChange}
                                                    margin="normal"
                                                /> :
                                                <TextField
                                                    disabled
                                                    id="filled-disabled"
                                                    name="org"
                                                    label="Organization"
                                                    value={this.state.org}
                                                    onChange={this.handleChange}
                                                    margin="normal"
                                                />
                                                }
                                                <TextField
                                                    name="dept"
                                                    label="Department"
                                                    value={this.state.dept}
                                                    onChange={this.handleChange}
                                                    margin="normal"
                                                />
                                            </Col>
                                            <Col lg={4} className="input-col">
                                                <TextField
                                                    name="email"
                                                    label="Email Address"
                                                    value={this.state.email}
                                                    onChange={this.handleChange}
                                                    margin="normal"
                                                />
                                                <TextField
                                                    name="userId"
                                                    label="User ID"
                                                    value={this.state.email}
                                                    disabled={true}
                                                    onChange={this.handleChange}
                                                    margin="normal"
                                                />
                                            </Col>
                                        </Row>
                                        <Row lg={11}>
                                            <Select
                                                name="userRole"
                                                value={this.state.userRole}
                                                onChange={this.handleChange}
                                                input={<Input name="userRole" id="user-role" />}
                                                >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                <MenuItem value="SystemAdmin">Super User</MenuItem>
                                                <MenuItem value="CustomerAdmin">Org Admin</MenuItem>
                                                <MenuItem value="CustomerViewer">Org User</MenuItem>
                                                <MenuItem value="ResellerAdmin">Reseller Admin</MenuItem>
                                                <MenuItem value="ResellerViewer">Reseller User</MenuItem>
                                            </Select>
                                        </Row>
                                    </Col>
                                </form>
                            </Row>
                        </Paper>
                        <div className="submit-button-row">
                            <Button onClick={this.handleSubmit} className="submit" variant="contained" >
                                Submit
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    };

}

export default withRouter(AddUser);