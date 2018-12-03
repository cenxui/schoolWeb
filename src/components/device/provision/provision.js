import React from "react";
import { browserHistory } from 'react-router';
import AppHeader from '../../app-header';
import Sidenav from '../../sidenav';
import './provision.scss';
import {withRouter} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@material-ui/core/Button';
import API from '../../../utils/API';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AWS from 'aws-sdk';
import config from "../../../config";
import { Auth } from 'aws-amplify';

class Provision extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            deviceId: '',
            deviceType: '',
            frequency: '',
            group: '',
            org: '',
            hardware_model: '',
            host_name: '',
            memory: '',
            operating_system_name: '',
            operating_system_version: '',
            processor: '',
            templateSelect: '',
            templatesData: [],
            TemplateName: '',
            TemplateInfo: {},
            provisionType: 'single',
            loggedInUser: {
                email: '',
                org: '',
                role:''
            }
        };
        this.selectTemplate.bind(this);
        this.handleChange.bind(this);
    }

    componentDidMount() {
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
        API.getAllTemplates()
        .then(res => res.json()
        .then((res) => {
            console.log(res)
            const templates = res.Items;

            this.formatData(templates);
        }))
        .catch(err => alert(err))
    }

    formatData = (templates) => {
        let formattedData = [];
        templates.map(template => {
            formattedData.push(
                {
                    TemplateName: template.TemplateName.S,
                    TemplateInfo: template.TemplateInfo.M,
                }
            )
            return formattedData;
        })
        this.setState({
            templatesData: formattedData
        });
        console.log(this.state.templatesData);
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        let newDevice = {
            "TableName" : "LogitechDeviceInformation",
            "Item" : {
                "deviceId" : {"S" : this.removeWhiteSpace(this.state.deviceId)},
                "deviceType": {"S" : this.removeWhiteSpace(this.state.deviceType)},
                "frequency": {"S" : this.removeWhiteSpace(this.state.frequency)},
                "group": {"S" : this.removeWhiteSpace(this.state.group)},
                "hardware_model": {"S" : this.removeWhiteSpace(this.state.hardware_model)},
                "host_name": {"S" : this.removeWhiteSpace(this.state.host_name)},
                "memory": {"S" : this.removeWhiteSpace(this.state.memory)},
                "operating_system_name": {"S" : this.removeWhiteSpace(this.state.operating_system_name)},
                "operating_system_version": {"S" : this.removeWhiteSpace(this.state.operating_system_version)},
                "processor": {"S" : this.removeWhiteSpace(this.state.processor)},
                "region": {"S" : this.removeWhiteSpace(this.state.region)},
                "org": {"S" : this.removeWhiteSpace(this.state.org)}
            },
            "provisionType": this.state.provisionType
        }
        API.provisionDevice(newDevice)
        .then(() => {
            console.log(newDevice)
            this.props.history.push('/device/' + this.removeWhiteSpace(this.state.deviceId) + '/' + this.removeWhiteSpace(this.state.deviceType), { email: 'state' })
        })
        .catch(err => alert(err))
    }

    removeWhiteSpace(str) {
        str = str.replace(/\s+/g, '');
        return str;
    }

    selectTemplate = event => {
        this.setState({ [event.target.name]: event.target.value });
        let tempaltesData = this.state.templatesData
        const selectedTemplateObj = tempaltesData.filter(template => {
            return template.TemplateName === event.target.value
        })
        console.log(selectedTemplateObj)
        this.setState({
            deviceType: selectedTemplateObj[0].TemplateInfo.deviceType.S,
            frequency: selectedTemplateObj[0].TemplateInfo.frequency.S,
            group: selectedTemplateObj[0].TemplateInfo.group.S,
            hardware_model: selectedTemplateObj[0].TemplateInfo.hardware_model.S,
            host_name: selectedTemplateObj[0].TemplateInfo.host_name.S,
            memory: selectedTemplateObj[0].TemplateInfo.memory.S,
            operating_system_name: selectedTemplateObj[0].TemplateInfo.operating_system_name.S,
            operating_system_version: selectedTemplateObj[0].TemplateInfo.operating_system_version.S,
            processor: selectedTemplateObj[0].TemplateInfo.processor.S,
            region: selectedTemplateObj[0].TemplateInfo.region.S
        })
        if (selectedTemplateObj[0].TemplateInfo.org) {
            this.setState({
                org: selectedTemplateObj[0].TemplateInfo.org.S
            })
        }
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
                            <form>
                                <Col lg={12}>
                                    <Row lg={12}>
                                        <Col lg={12}>
                                            <FormControl className="select-template">
                                                <InputLabel htmlFor="templatesSelect">Apply a Template</InputLabel>
                                                <Select
                                                    value={this.state.templatesSelect}
                                                    onChange={this.selectTemplate}
                                                    inputProps={{
                                                        name: 'templatesSelect',
                                                        id: 'templatesSelect',
                                                    }}
                                                >
                                                    {this.state.templatesData.map(template => {
                                                        return (
                                                            <MenuItem key={template.TemplateName} value={template.TemplateName}>{template.TemplateName}</MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </Col>
                                        <Col lg={4} className="input-col">
                                            <TextField
                                                name="deviceId"
                                                label="Device Name"
                                                value={this.state.deviceId}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
                                            <TextField
                                                name="deviceType"
                                                label="Device Type"
                                                value={this.state.deviceType}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
                                            <TextField
                                                name="frequency"
                                                label="Frequency"
                                                value={this.state.frequency}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
                                            <TextField
                                                name="group"
                                                label="Group"
                                                value={this.state.group}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
                                        </Col>
                                        <Col lg={4} className="input-col">
                                            <TextField
                                                name="hardware_model"
                                                label="Hardware Model"
                                                value={this.state.hardware_model}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
                                            <TextField
                                                name="host_name"
                                                label="Host Name"
                                                value={this.state.host_name}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
                                            <TextField
                                                name="memory"
                                                label="Memory"
                                                value={this.state.memory}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
                                            <TextField
                                                name="operating_system_name"
                                                label="OS Name"
                                                value={this.state.operating_system_name}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
                                        </Col>
                                        <Col lg={4} className="input-col">
                                            <TextField
                                                name="operating_system_version"
                                                label="OS Version"
                                                value={this.state.operating_system_version}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
                                            <TextField
                                                name="processor"
                                                label="Processor"
                                                value={this.state.processor}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
                                            <TextField
                                                name="region"
                                                label="Region"
                                                value={this.state.region}
                                                onChange={this.handleChange}
                                                margin="normal"
                                            />
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
                                        </Col>
                                    </Row>
                                    <Row lg={12} className="submit-button-row">
                                        <Button className="submit" variant="contained" onClick={this.handleSubmit}>
                                            Submit
                                        </Button>
                                    </Row>
                                </Col>
                            </form>
                        </Paper>
                    </Col>
                </Row>
            </div>
        );
    };

}

export default withRouter(Provision);