import React from "react";
import './device-details.scss';
import Sidenav from '../../sidenav';
import AppHeader from '../../app-header';
import { Row, Col } from 'react-flexbox-grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import API from '../../../utils/API';
import LineChart from '../../line-chart';
import Button from '@material-ui/core/Button';
import {withRouter} from 'react-router-dom';
import Switch from '@material-ui/core/Switch';

class DeviceDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            device: {},
            telemetry: '',
            certLink: '',
            bluetooth: false,
            camera: false,
            containsShadow: false,
            edgeUrl: ''
        }
        this.downloadCertificate.bind(this);
        this.handleSwitch.bind(this);
    }
    
    
    componentDidMount = () => {
        let id = this.props.match.params.id;
        let type = this.props.match.params.type;
        this.getDeviceDetails(id, type)
    }

    // Gets shadow status
    getShadowStatus(certId) {
        API.getShadowStatus(certId)
        .then(res => res.json()
        .then((res) => {
            console.log(res);
            this.setState({
                containsShadow: true
            })
            if(res.state.desired) {
                this.convertToBoolean(res.state.desired.bluetooth, 'bluetooth');
                this.convertToBoolean(res.state.desired.camera, 'camera');
            } else {
                this.convertToBoolean(res.state.reported.bluetooth, 'bluetooth');
                this.convertToBoolean(res.state.reported.camera, 'camera');
            }
        })
        .catch(function (err) {
            console.log(err);
        }));
    }

    // Gets devices, sets device state to api result
    getDeviceDetails(id, type) {
        API.getDevice(id, type)
        .then(res => res.json()
        .then((res) => {
            console.log(res);
            this.setState({ 
                device: {
                    deviceId: id,
                    deviceType: res.Item.deviceType.S,
                    frequency: res.Item.frequency.S,
                    group: res.Item.group.S, 
                    hardware_model: res.Item.hardware_model.S, 
                    host_name: res.Item.host_name.S,
                    memory: res.Item.memory.S, 
                    operating_system_name: res.Item.operating_system_name.S, 
                    operating_system_version: res.Item.operating_system_version.S, 
                    processor: res.Item.processor.S,
                    region: res.Item.region.S
                },
            })
            if (res.Item.certId) {
                this.setState({
                    device: {...this.state.device,
                        certId: res.Item.certId.S
                    }
                });
                this.getShadowStatus(this.state.device.certId);
            }
            if (res.Item.telemetry) {
                let prettyTimestamp = new Date(parseInt(res.Item.timestamp.N) * 1000).toLocaleString();
                this.setState({
                    device: {...this.state.device,
                        timestamp: prettyTimestamp
                    },
                    telemetry: res.Item.telemetry.L
                })
                this.formatData();
            }
        })
        .catch(function (err) {
            console.log(err);
        }));
    }


    // formats telemetry data for graphing
    formatData() {
        let formattedData = [[
            { type: 'date', label: 'Time' },
            'CPU Usage',
            'Memory Usage',
        ]];
        let unformattedData = this.state.telemetry
        unformattedData.map(data => {
            return formattedData.push([
                new Date(parseInt(data.M.timestamp.S) * 1000), 
                parseFloat(data.M.cpuUsage.N), 
                parseFloat(data.M.memUsage.N), 
            ])
        });
        this.setState({
            telemetry: formattedData
        })
    }

    // calls the api to generate the certificate then opens the link to initiate download
    downloadCertificate = () => {
        let certIdObj = {"certificateId": String(this.state.device.certId)};
        API.getCerts(certIdObj)
        .then(res => res.json())
        .then((res) => {
            let certObj = res
            this.setState({
                certLink: certObj
            })
        })
        .then(() => {
            window.open(this.state.certLink);
        })
    }

    // calls the api to generate the edge client then opens the link to initiate download
    downloadEdgeClient = () => {
        if (this.state.edgeUrl === '') {
            API.getEdgeClient()
            .then(res => res.json())
            .then((res) => {
                let edgeUrl = res
                console.log('test', edgeUrl);
                this.setState({
                    edgeUrl: edgeUrl
                })
            })
            .then(() => {
                window.open(this.state.edgeUrl);
            })
        }
        else {
            window.open(this.state.edgeUrl);
        }
    }
        
    // converts shadow status 'on' or 'off' to true or false
    convertToBoolean(status, state) {
        let stateObj = {};
        if (status === 'on') {
            stateObj[state] = true;
            this.setState(stateObj);
        } else {
            stateObj[state] = false;
            this.setState(stateObj);
        }
        console.log(status, state);
        console.log(this.state[state]);
    }

    // updates state based on checked status of switch
    handleSwitch = name => event => {
        this.setState({ [name]: event.target.checked},
            () => this.updateShadowStatus()
        );
    };

    // shows 'on' or 'off' in UI instead of true or false 
    formatForOnOff(status) {
        if (status === true) {
            return 'on'
        } else {
            return 'off'
        }
    }

    updateShadowStatus() {
        const shadowObj = {
            "deviceId" : this.state.device.certId,
            "function" : "Update",
            "CameraStatus" : this.formatForOnOff(this.state.camera),
            "BluetoothStatus" : this.formatForOnOff(this.state.bluetooth)
        }
        API.updateShadowStatus(shadowObj)
        .then(res => res.json())
        .then(res => console.log(res))
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
                            <Row>
                                <Col lg={6}>
                                    <List className="details-list">
                                        <ListItem>
                                            <ListItemText primary="Device ID" />
                                            <ListItemSecondaryAction>
                                                {this.state.device.deviceId}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider></Divider>
                                        <ListItem>
                                            <ListItemText primary="OS Version" />
                                            <ListItemSecondaryAction>
                                                {this.state.device.operating_system_version}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider></Divider>
                                        <ListItem>
                                            <ListItemText primary="Host Name" />
                                            <ListItemSecondaryAction>
                                                {this.state.device.host_name}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider></Divider>
                                        <ListItem>
                                            <ListItemText primary="Device Type" />
                                            <ListItemSecondaryAction>
                                                {this.state.device.deviceType}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider></Divider>
                                        <ListItem>
                                            <ListItemText primary="Frequency" />
                                            <ListItemSecondaryAction>
                                                {this.state.device.frequency}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider></Divider>
                                        <ListItem>
                                            <ListItemText primary="Timestamp" />
                                            <ListItemSecondaryAction>
                                                {this.state.device.timestamp}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider></Divider>
                                        {this.state.containsShadow &&
                                            <ListItem>
                                                <ListItemText primary="Camera" />
                                                <ListItemSecondaryAction>
                                                    <Switch
                                                        checked={this.state.camera}
                                                        onChange={this.handleSwitch("camera")}
                                                        value="camera"
                                                        color="primary"
                                                        name="camera"
                                                        defaultChecked={this.state.camera}
                                                    />
                                                    {this.formatForOnOff(this.state.camera)}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        }
                                    </List>
                                </Col>
                                <Col lg={6}>    
                                    <List className="details-list">
                                            <ListItem>
                                            <ListItemText primary="Memory" />
                                            <ListItemSecondaryAction>
                                                {this.state.device.memory}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider></Divider>
                                        <ListItem>
                                            <ListItemText primary="OS Name" />
                                            <ListItemSecondaryAction>
                                                {this.state.device.operating_system_name}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider></Divider>
                                        <ListItem>
                                            <ListItemText primary="Group" />
                                            <ListItemSecondaryAction>
                                                {this.state.device.group}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider></Divider>
                                        <ListItem>
                                            <ListItemText primary="Processor" />
                                            <ListItemSecondaryAction>
                                                {this.state.device.processor}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider></Divider>
                                        <ListItem>
                                            <ListItemText primary="Hardware Model" />
                                            <ListItemSecondaryAction>
                                                {this.state.device.hardware_model}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider></Divider>
                                        <ListItem>
                                            <ListItemText primary="Region" />
                                            <ListItemSecondaryAction>
                                                {this.state.device.region}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider></Divider>
                                        {this.state.containsShadow &&
                                            <ListItem>
                                                <ListItemText primary="Bluetooth" />
                                                <ListItemSecondaryAction>
                                                    <Switch
                                                        checked={this.state.bluetooth}
                                                        onChange={this.handleSwitch("bluetooth")}
                                                        value="bluetooth"
                                                        color="primary"
                                                        name="bluetooth"
                                                        defaultChecked={this.state.bluetooth}
                                                    />
                                                    {this.formatForOnOff(this.state.bluetooth)}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        }
                                    </List>
                                </Col>
                            </Row>
                        </Paper>
                        {this.state.telemetry !== '' &&
                            <Card className="chart-container main-paper">
                                <LineChart 
                                    deviceData={this.state.telemetry} 
                                    deviceId={this.state.device.deviceId}
                                ></LineChart>
                            </Card>
                        }
                        <Button className="download-client-button" onClick={this.downloadEdgeClient} variant="contained" >
                            Download Edge Client
                        </Button>
                        <Button className="download-cert-button" onClick={this.downloadCertificate} variant="contained" >
                            Download Certificate
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    };

}

export default withRouter(DeviceDetails);