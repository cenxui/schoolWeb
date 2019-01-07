import React from "react";
import './org-details.scss';
import Sidenav from '../../sidenav';
import { Row, Col } from 'react-flexbox-grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import API from '../../../utils/API';
import {withRouter} from 'react-router-dom';

class TemplateDetails extends React.Component {

    // Initiates states for org and telemetry
    constructor(props) {
        super(props);
        this.state = {
            org: {
                orgName: '',
                orgId: '',
                orgType: '',
                address: '',
                country: '',
                parent: '',
            },
        }
    }

    // Gets orgs, sets org state to api get result
    componentDidMount() {
        let name = this.props.match.params.name;
        API.getOrg(name)
        .then(res => res.json()
        .then((res) => {
            console.log(res);
            this.setState({
                org: {
                    orgName: res.Item.orgName.S,
                    orgId: res.Item.orgId.S,
                    orgType: res.Item.orgType.S,
                    address: res.Item.address.S,
                    country: res.Item.country.S,
                    parent: res.Item.parent.S,
                },
            })
        })
        .catch(function (err) {
        console.log(err);
        }));
    }

    render () {
        return(
            <div className="app-container">
                <Row lg={12}>
                    <Col lg={2} className="sidenav-container">
                        <Sidenav />
                    </Col>
                    <Col lg={10} className="main-container">
                        <Paper className="main-paper">
                            <Col lg={12}>
                                <Row lg={12}>
                                    <Col lg={12}>
                                        <List className="orgs-list">
                                            <ListItem>
                                                <ListItemText primary={this.state.org.orgName}/>
                                            </ListItem>
                                            <Divider></Divider>
                                        </List>
                                    </Col>
                                    <Col lg={6}>
                                        <List className="orgs-list">
                                            <ListItem>
                                                <ListItemText primary="OS Version" />
                                                <ListItemSecondaryAction>
                                                    {this.state.org.orgId}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider></Divider>
                                            <ListItem>
                                                <ListItemText primary="Host Name" />
                                                <ListItemSecondaryAction>
                                                    {this.state.org.orgType}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </List>
                                    </Col>
                                    <Col lg={6}>
                                        <List className="details-list">
                                            <ListItem>
                                                <ListItemText primary="Device Type" />
                                                <ListItemSecondaryAction>
                                                    {this.state.org.address}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider></Divider>
                                            <ListItem>
                                                <ListItemText primary="Frequency" />
                                                <ListItemSecondaryAction>
                                                    {this.state.org.country}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider></Divider>
                                            <ListItem>
                                                <ListItemText primary="Region" />
                                                <ListItemSecondaryAction>
                                                    {this.state.org.parent}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </List>
                                    </Col>
                                </Row>
                            </Col>
                        </Paper>
                    </Col>
                </Row>
            </div>
        );
    };

}

export default withRouter(TemplateDetails);
