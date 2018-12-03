import React from "react";
import AppHeader from '../../app-header';
import Sidenav from '../../sidenav';
import './add-template.scss';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@material-ui/core/Button';
import API from "../../../utils/API";
import { withRouter } from 'react-router-dom';

class AddTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            templateName: '',
            deviceType: '',
            frequency: '',
            group: '', 
            hardware_model: '', 
            host_name: '',
            memory: '', 
            operating_system_name: '', 
            operating_system_version: '', 
            processor: '',
            region: '', 
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (event) => {
        const name = event.target.name;
        this.setState({
          [name]: event.target.value,
        });
    };

    handleSubmit = () => {
        const newTemplate = {
            "TableName": "TemplateDevice",
            "Item":
            {
                "TemplateInfo": { "M" : {
                    "deviceType": {"S": this.removeWhiteSpace(this.state.deviceType)},
                    "frequency": {"S": this.removeWhiteSpace(this.state.frequency)},
                    "group": {"S": this.removeWhiteSpace(this.state.group)},
                        "hardware_model": {"S": this.removeWhiteSpace(this.state.hardware_model)},
                    "host_name": {"S": this.removeWhiteSpace(this.state.host_name)},
                    "memory": {"S": this.removeWhiteSpace(this.state.memory)},
                    "operating_system_name": {"S": this.removeWhiteSpace(this.state.operating_system_name)},
                    "operating_system_version": {"S": this.removeWhiteSpace(this.state.operating_system_version)},
                    "processor": {"S": this.removeWhiteSpace(this.state.processor)},
                    "region": {"S": this.removeWhiteSpace(this.state.region)}
                }},
                "TemplateName": {
                    "S": this.removeWhiteSpace(this.state.templateName)
                }
            }
        }
        API.addTemplate(newTemplate)
        .then(() => {
            this.props.history.push('/template/' + this.removeWhiteSpace(this.state.templateName), { email: 'state' })
        })
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
                                    <Col lg={4} className="input-col">
                                        <TextField
                                            name="templateName"
                                            label="Template Name"
                                            value={this.state.templateName}
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
                                    </Col>
                                </form>
                            </Row>
                        </Paper>
                        <div className="submit-button-row">
                            <Button className="submit" onClick={this.handleSubmit} variant="contained" >
                                Submit
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    };

}

export default withRouter(AddTemplate);