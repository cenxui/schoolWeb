import React from "react";
import './index-details.scss';
import Sidenav from '../../sidenav';
import AppHeader from '../../app-header';
import { Row, Col } from 'react-flexbox-grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import {withRouter} from 'react-router-dom';


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
