import React from "react";
import './job-details.scss';
import Sidenav from '../../sidenav';
import AppHeader from '../../app-header';
import { Row, Col } from 'react-flexbox-grid';
import Paper from '@material-ui/core/Paper';
import API from '../../../utils/API';
import { withRouter } from 'react-router-dom';
import MaterialTable from "material-table";

class JobDetails extends React.Component {

    // Initiates states for job and telemetry
    constructor(props) {
        super(props);
        this.state = {
            executions:[]
        }
    }
    
    // Gets jobs, sets job state to api get result
    componentDidMount() {
        let jobName = this.props.match.params.job;
        API.getJob(jobName)
        .then(res => res.json()
        .then((res) => {
            const executions = res.Executions
            this.formatData(executions)
        })
        .catch(function (err) {
            console.log(err);
        }));
    }

    formatData = (execution) => {
        let formattedData = [];
        execution.map(execution => {
            console.info(execution)
            formattedData.push(
                {
                    'ThingName': execution.ThingArn.split("/")[1],
                    'Status': execution.Status,
                    'LastUpdatedAt': execution.LastUpdatedAt,
                    'VersionNumber': execution.VersionNumber,
                }
            )
            return formattedData;
        })
        this.setState({
            executions: formattedData
        });
        console.log(this.state.executions);
    }


    filterExecution(executionList){
        console.log('executionList', executionList)
        let filteredExecution = [];
        {executionList.map(execution => {
            if(execution.LastUpdatedAt === null || execution.LastUpdatedAt === undefined){
                execution.LastUpdatedAt = ''
            }

            filteredExecution.push(execution)
        })}
        console.log('filtered executions', filteredExecution);
        return filteredExecution;
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
                                    { title: 'ThingName', field: 'ThingName' },
                                    {
                                        title: 'Status',
                                        field: 'Status',
                                        cellStyle: data => {
                                            // IN_PROGRESS, QUEUED, FAILED, SUCCEEDED,
                                            // TIMED_OUT, CANCELED, or REJECTED
                                            if (data === 'SUCCEEDED') {
                                                return {
                                                    color: 'green',
                                                }
                                            }else if (data === 'IN_PROGRESS') {
                                                return {
                                                    color: 'red',
                                                }
                                            }else if (data === 'QUEUED') {
                                                return {
                                                    color: 'blue',
                                                }
                                            }

                                        },
                                    },
                                    { title: 'LastUpdatedAt', field: 'LastUpdatedAt' },
                                    { title: 'VersionNumber', field: 'VersionNumber' },
                                ]}
                                title="Things"
                                data={this.filterExecution(this.state.executions)}
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

export default withRouter(JobDetails);