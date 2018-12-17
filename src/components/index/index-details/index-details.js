import React from "react";
import './zone-details.scss';
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

class IndexDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            zone: {},
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
                                       Index
                                    </List>
                                </Col>
                            </Row>
                        </Paper>
                    </Col>
                </Row>
            </div>
        );
    };

}

export default withRouter(IndexDetails);
