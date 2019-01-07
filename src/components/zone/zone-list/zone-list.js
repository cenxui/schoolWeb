import React from "react";
import './zone-list.scss';
import AppHeader from '../../app-header'
import Sidenav from '../../sidenav';
import Paper from '@material-ui/core/Paper';
import { Row, Col } from 'react-flexbox-grid';
import API from '../../../utils/API';
import MaterialTable from 'material-table';
import {withRouter} from 'react-router-dom';

class ZoneList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            devicesData: [],
            userRole:'',
            userOrg: '',
            childOrg: [],
            isAuthenticating: true
        }
    }

    async componentDidMount() {
        await this.userAuth();
        const dataLength = this.props.match.params.dataLength;
        API.getAllDevices(dataLength)
        .then(res => res.json()
        .then((res) => {
            const devices = res.Items
            console.log('devices', devices);
            this.setState({
                devicesData: devices
            })
            console.log(this.state.devicesData);
            this.formatData();
        }))
        // .catch(err => alert(err))
    }

    async userAuth(){
        // await Auth.currentSession()
        // .then((user)=>{
        //     this.setState({userRole: user.idToken.payload['cognito:groups'], userOrg: user.idToken.payload['custom:org']})
        //     if(this.state.userOrg !== "All"){
        //     API.getOrg(this.state.userOrg)
        //     .then(res => res.json()
        //     .then((res) => {
        //         // console.info(res)
        //         // if(res.Item.Children !== undefined){
        //         // this.setState({childOrg: res.Item.Children.SS})
        //         // console.log('user org', this.state.userOrg)
        //         // this.setState({ isAuthenticating: false });}
        //     }))}
        //     this.setState({ isAuthenticating: false });
        // })
    }

    filterDeviceData(deviceList){
        console.log('devicelist', deviceList)
        let filteredDevices = [];
        {deviceList.map(device => {
            if(device.Organization !== undefined){
                if(device.Organization === this.state.userOrg || this.state.userOrg === "All" || this.state.childOrg.includes(device.Organization)){
                    filteredDevices.push(device)
                }
            }
        })}
        console.log('filtered devices', filteredDevices);
        return filteredDevices;
    }

    formatData = () => {
        let formattedData = [];
        this.state.devicesData.map(devices => {
            if(devices.org === undefined){
                devices.org = {S:''}
            }
            formattedData.push(
                    {
                        'DeviceID': devices.deviceId.S,
                        'DeviceType': devices.deviceType.S,
                        'HostName': devices.host_name.S,
                        'OSVersion': devices.operating_system_version.S,
                        'Organization': devices.org.S
                    }
                )
        })
        this.setState({
            devicesData: formattedData
        });
        return formattedData;
    }

    viewDetails(deviceId, deviceType) {
        this.props.history.push('/device/' + deviceId + '/'+ deviceType, { email: 'state' });
    }


    render () {
        return(
            !this.state.isAuthenticating &&
            <div className="app-container">
                <AppHeader />
                <Row lg={12}>
                    <Col lg={2} className="sidenav-container">
                        <Sidenav />
                    </Col>
                    <Col lg={10} className="main-container">
                        <Paper className="main-paper">
                            <MaterialTable
                                columns={[
                                    { title: 'Device ID', field: 'DeviceID' },
                                    { title: 'Device Type', field: 'DeviceType' },
                                    { title: 'Host Name', field: 'HostName' },
                                    { title: 'OS Version', field: 'OSVersion' },
                                    { title: 'Organization', field: 'Organization' }
                                ]}
                                title="Devices"
                                data={this.filterDeviceData(this.state.devicesData)}
                                actions={[
                                    {
                                        icon: 'info',
                                        tooltip: 'Show Device Info',
                                        onClick: (event, rowData) => { this.viewDetails(rowData.DeviceID, rowData.DeviceType)}
                                    }
                                ]}
                                options={{
                                    selection: false,
                                }}
                            />
                        </Paper>
                    </Col>
                </Row>
            </div>
        );
    };

}

export default withRouter(ZoneList);
