import React from "react";
import AppHeader from '../../app-header';
import Sidenav from '../../sidenav';
import './bulk-provision.scss';
import API from '../../../utils/API';
import Paper from '@material-ui/core/Paper';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {withRouter} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

class BulkProvision extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newDevicesList: [],
            deviceTemplate: { value: '', touched: false },
            template: {
                deviceType: '',
                frequency: '',
                group: '', 
                hardware_model: '', 
                host_name: '',
                memory: '', 
                operating_system_name: '', 
                operating_system_version: '', 
                processor: '',
                region: ''
            },
            edgeUrl: '',
            templatesData: [],
            TemplateName: '',
            TemplateInfo: {},
            provisionType: 'bulk',
            certLink: '',
            hasPreview: false,
            certificateExists: false,
            loading: false
        }     
        this.handleChange = this.handleChange.bind(this);
        this.handleProvision = this.handleProvision.bind(this);
    }

    componentDidMount() {
        API.getAllTemplates()
        .then(res => res.json()
        .then((res) => {
            console.log(res)
            const templates = res.Items;

            this.formatData(templates);
        }))
        .catch(err => alert(err))
    }

    // formats template data for dropdown
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
    
    
    // General handle change for inputs
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ 
          [name]: value
        });
    }


    // POSTS template to API and generates certificate for download
    handleProvision() {
        this.setState({
            loading: true
        })
        console.log(this.state.template);
        const bulkProvisionObject = {
            "TableName" : "LogitechDeviceInformation",
            "Item" : {...this.state.template},
            "provisionType": this.state.provisionType
        };
        API.provisionDevice(bulkProvisionObject)
        .then(res => res.json())
        .then((res) => {
            console.log(res)
            let certObj = res
            this.setState({
                certLink: certObj,
                loading: false,
                certificateExists: true
            })
        })
        .catch(err => {
            alert(err);
        })
    }

    // filters out template attributes based on selected
    selectTemplate = event => {
        this.setState({ [event.target.name]: event.target.value });
        let tempaltesData = this.state.templatesData
        const selectedTemplateObj = tempaltesData.filter(template => {
            return template.TemplateName === event.target.value
        })
        console.log(selectedTemplateObj)
        this.setState({
            template: {
                templateName: selectedTemplateObj[0].TemplateName,
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
            },
            hasPreview: true
        })
    }

    // Gets and triggers download of edge client
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
                            <form className="upload-form">
                                <Col lg={11} className="upload-input-col">
                                    <div className="upload-input-container">
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
                                    </div>
                                </Col>
                            </form>
                        </Paper>
                        {this.state.hasPreview &&
                            <div className="preview-container">
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
                                <div className="submit-button-row">
                                    {!this.state.certificateExists && !this.state.loading &&
                                        <Button className="bulk-submit-button" onClick={this.handleProvision} variant="contained" >
                                            Generate Bulk Certificate
                                        </Button>
                                    }
                                    {this.state.loading &&
                                        <CircularProgress size={50}/>
                                    }
                                    {this.state.certificateExists &&
                                        <div>
                                            <Button className="download-client-button" onClick={this.downloadEdgeClient} variant="contained" >
                                                Download Edge Client
                                            </Button>
                                            <Button className="download-button" href={this.state.certLink} variant="contained" >
                                                Download Certificate
                                            </Button>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </Col>
                </Row>
            </div>
        );
    };

}

export default withRouter(BulkProvision);