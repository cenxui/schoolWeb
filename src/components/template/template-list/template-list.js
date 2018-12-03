import React from "react";
import AppHeader from '../../app-header';
import Sidenav from '../../sidenav';
import './template-list.scss';
import Paper from '@material-ui/core/Paper';
import { Row, Col } from 'react-flexbox-grid';
import API from '../../../utils/API';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import { Link, withRouter } from 'react-router-dom';

class TemplateList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            templatesData: []
        }
    }

    componentDidMount() {
        API.getAllTemplates()
        .then(res => res.json()
        .then((res) => {
            console.log(res)
            const templates = res.Items
            this.formatData(templates);
        }))
        .catch(err => alert(err))
    }

    formatData = (templates) => {
        let formattedData = [];
        templates.map(template => {
            formattedData.push(
                {   
                    'TemplateName': template.TemplateName.S, 
                    'DeviceType': template.TemplateInfo.M.deviceType.S, 
                }
            )
            return formattedData;
        })
        this.setState({
            templatesData: formattedData
        });
        console.log(this.state.templatesData);
    }

    viewDetails(templateName) {
        console.log(templateName);
        this.props.history.push('/template/' + templateName, { email: 'state' });
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
                            <MaterialTable
                                columns={[
                                    { title: 'Template Name', field: 'TemplateName' },
                                    { title: 'Device Type', field: 'DeviceType' }
                                ]}
                                title="Templates"
                                data={this.state.templatesData}
                                actions={[
                                    {
                                      icon: 'info',
                                      tooltip: 'Show Template Info',
                                      onClick: (event, rowData) => { this.viewDetails(rowData.TemplateName)}
                                    }
                                ]}
                            />    
                        </Paper>
                        <Row lg={12} className="add-button-row">
                            <Link to={"/add-template"}>
                                <Button className="add-template-button" variant="contained" >
                                    Add New
                                </Button>
                            </Link>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    };

}

export default withRouter(TemplateList);