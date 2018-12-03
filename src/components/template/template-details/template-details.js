import React from "react";
import './template-details.scss';
import Sidenav from '../../sidenav';
import AppHeader from '../../app-header';
import { Row, Col } from 'react-flexbox-grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import API from '../../../utils/API';
import { withRouter } from 'react-router-dom';

class TemplateDetails extends React.Component {

    // Initiates states for template and telemetry
    constructor(props) {
        super(props);
        this.state = {
            template: {
                templateName: '',
                deviceType: '',
                operating_system_version: '',
                host_name: '',
                frequency: '',
                timestamp: '',
                memory: '',
                operating_system_name: '',
                group: '',
                processor: '',
                hardware_model: '',
                region: '',
            },
        }
    }
    
    // Gets templates, sets template state to api get result
    componentDidMount() {
        let templateName = this.props.match.params.template;
        API.getTemplate(templateName)
        .then(res => res.json()
        .then((res) => {
            console.log(res);
            this.setState({ 
                template: {
                    templateName: res.Item.TemplateName.S,
                    deviceType: res.Item.TemplateInfo.M.deviceType.S,
                    operating_system_version: res.Item.TemplateInfo.M.operating_system_version.S,
                    host_name: res.Item.TemplateInfo.M.host_name.S,
                    frequency: res.Item.TemplateInfo.M.frequency.S,
                    memory: res.Item.TemplateInfo.M.memory.S,
                    operating_system_name: res.Item.TemplateInfo.M.operating_system_name.S,
                    group: res.Item.TemplateInfo.M.group.S,
                    processor: res.Item.TemplateInfo.M.processor.S,
                    hardware_model: res.Item.TemplateInfo.M.hardware_model.S,
                    region: res.Item.TemplateInfo.M.region.S,
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
                <AppHeader />
                <Row lg={12}>
                    <Col lg={2} className="sidenav-container">
                        <Sidenav />
                    </Col>
                    <Col lg={10} className="main-container">
                        <Paper className="main-paper">
                            <Col lg={12}>
                                <Row lg={12}>
                                    <Col lg={12}>
                                        <List className="templates-list">
                                            <ListItem>
                                                <ListItemText primary={this.state.template.templateName}/>
                                            </ListItem>
                                            <Divider></Divider>
                                        </List>
                                    </Col>
                                    <Col lg={6}>
                                        <List className="templates-list">
                                            <ListItem>
                                                <ListItemText primary="OS Version" />
                                                <ListItemSecondaryAction>
                                                    {this.state.template.operating_system_version}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider></Divider>
                                            <ListItem>
                                                <ListItemText primary="Host Name" />
                                                <ListItemSecondaryAction>
                                                    {this.state.template.host_name}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider></Divider>
                                            <ListItem>
                                                <ListItemText primary="Device Type" />
                                                <ListItemSecondaryAction>
                                                    {this.state.template.deviceType}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider></Divider>
                                            <ListItem>
                                                <ListItemText primary="Frequency" />
                                                <ListItemSecondaryAction>
                                                    {this.state.template.frequency}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider></Divider>
                                            <ListItem>
                                                <ListItemText primary="Region" />
                                                <ListItemSecondaryAction>
                                                    {this.state.template.region}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </List>
                                    </Col>
                                    <Col lg={6}>    
                                        <List className="details-list">
                                                <ListItem>
                                                <ListItemText primary="Memory" />
                                                <ListItemSecondaryAction>
                                                    {this.state.template.memory}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider></Divider>
                                            <ListItem>
                                                <ListItemText primary="OS Name" />
                                                <ListItemSecondaryAction>
                                                    {this.state.template.operating_system_name}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider></Divider>
                                            <ListItem>
                                                <ListItemText primary="Group" />
                                                <ListItemSecondaryAction>
                                                    {this.state.template.group}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider></Divider>
                                            <ListItem>
                                                <ListItemText primary="Processor" />
                                                <ListItemSecondaryAction>
                                                    {this.state.template.processor}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider></Divider>
                                            <ListItem>
                                                <ListItemText primary="Hardware Model" />
                                                <ListItemSecondaryAction>
                                                    {this.state.template.hardware_model}
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