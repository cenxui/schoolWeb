/*
 *  Copyright (c) 1999-2018 Logitech, Inc.  All Rights Reserved
 *
 *  This program is a trade secret of LOGITECH, and it is not to
 *  be reproduced, published, disclosed to others, copied,
 *  adapted, distributed or displayed without the prior
 *  authorization of LOGITECH.
 *
 *  Licensee agrees to attach or embedded this notice on all copies
 *  of the program, including partial copies or modified versions
 *  thereof.
 *
 *  -------------------------------------------------------------
 *  DESCRIPTION
 *  -------------------------------------------------------------
 *
 *  -------------------------------------------------------------
 *  AUTHOR
 *  -------------------------------------------------------------
 *  Cenxui Lin (clin9@logitech.com)
 *  -------------------------------------------------------------
 *  DATE CREATED
 *  -------------------------------------------------------------
 *  16 July 2018
 */

import React from "react";
import AppHeader from '../../app-header';
import Sidenav from '../../sidenav';
import './add-group-job.scss';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { Row, Col } from 'react-flexbox-grid';
import MaterialTable from 'material-table';
import API from "../../../utils/API";
import { withRouter } from 'react-router-dom';
import Select from 'react-select'

const options = [
    { value: 'SNAPSHOT', label: 'SNAPSHOT' },
    { value: 'CONTINUOUS', label: 'CONTINUOUS' }
];

class AddGroupJob extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            jobId: '',
            firmwareURL: '',
            targetSelection: '',
            description:'',
            groupsData: []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        API.getAllGroups()
            .then(res => res.json()
                .then((res) => {
                    console.log(res)
                    const groups = res.ThingGroups
                    this.formatData(groups);
                }))
            .catch(err => alert(err))
    }

    formatData = (group) => {
        let formattedData = [];
        group.map(thing => {

            formattedData.push(
                {
                    'GroupArn': thing.GroupArn,
                    'GroupName': thing.GroupName,
                }
            )
            return formattedData;
        })
        this.setState({
            groupsData: formattedData
        });
        console.log(this.state.groupsData);
    }

    handleChange = (event) => {
        const name = event.target.name;
        this.setState({
          [name]: event.target.value,
        });
    };

    handleSelectChange = (selectedOption) => {
        this.setState({targetSelection :selectedOption });
        console.log(`Option selected:`, selectedOption);
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
                                            name="jobId"
                                            label="jobId"
                                            value={this.state.jobId}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />

                                    </Col>
                                    <Col lg={4} className="input-col">
                                        <TextField
                                            name="description"
                                            label="description"
                                            value={this.state.description}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />

                                    </Col>
                                    <Col lg={4} className="input-col">
                                        <TextField
                                            name="firmwareURL"
                                            label="Firmware location in s3"
                                            value={this.state.firmwareURL}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />
                                    </Col>
                                    <Col lg={4} className="input-col">
                                        <br/>
                                        <Select
                                            value={this.state.targetSelection}
                                            onChange={this.handleSelectChange}
                                            options={options}
                                        />
                                    </Col>
                                </form>
                            </Row>
                        </Paper>
                        <MaterialTable
                            columns={[
                                { title: 'GroupName', field: 'GroupName' },
                                { title: 'GroupArn', field: 'GroupArn'},
                            ]}
                            data={this.state.groupsData}
                            title="Groups"
                            actions={[
                                {
                                    icon: 'done_all',
                                    tooltip: 'Add Groups Job',
                                    onClick: (event, rows) => {
                                        let targets = []
                                        rows.forEach((v) => {
                                            targets.push(v.GroupArn)
                                        })

                                        const newJob = {
                                            JobId : this.removeWhiteSpace(this.state.jobId),
                                            Targets: targets,
                                            Document: JSON.stringify(
                                                {
                                                    operation: "install",
                                                    data: "${aws:iot:s3-presigned-url:"+this.removeWhiteSpace(this.state.firmwareURL)+"}"}
                                            ),
                                            TargetSelection: this.state.targetSelection["value"], //option
                                            Description: this.removeWhiteSpace(this.state.description),
                                        }

                                        API.addJob(newJob)
                                            .then(() => {
                                                this.props.history.push('/job')
                                            })
                                    },
                                },
                            ]}
                            options={{
                                selection: true,
                            }}
                        />
                    </Col>
                </Row>
            </div>
        );
    };

}

export default withRouter(AddGroupJob);