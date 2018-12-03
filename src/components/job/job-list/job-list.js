import React from "react";
import AppHeader from '../../app-header';
import Sidenav from '../../sidenav';
import './job-list.scss';
import Paper from '@material-ui/core/Paper';
import { Row, Col } from 'react-flexbox-grid';
import API from '../../../utils/API';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import { Link, withRouter } from 'react-router-dom';

class JobList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobsData: []
        }
    }

    componentDidMount() {
        API.getAllJobs()
        .then(res => res.json()
        .then((res) => {
            console.log(res)
            const jobs = res.Jobs
            this.formatData(jobs);
        }))
        .catch(err => alert(err))
    }

    formatData = (jobs) => {
        let formattedData = [];
        jobs.map(job => {
            formattedData.push(
                {
                    'JobId': job.JobId,
                    'JobArn': job.JobArn,
                    'CreatedAt': job.CreatedAt,
                    'LastUpdatedAt': job.LastUpdatedAt,
                    'Status': job.Status,
                    'TargetSelection': job.TargetSelection,
                    'ThingGroupName':job.ThingGroupName,
                    'ThingGroupId':job.ThingGroupId,
                }
            )
            return formattedData;
        })
        this.setState({
            jobsData: formattedData
        });
        console.log(this.state.jobsData);
    }

    viewDetails(jobName) {
        console.log(jobName);
        //todo
        this.props.history.push('/job-details/' + jobName);
    }

    filterJobsData(jobList){
        console.log('joblist', jobList)
        let filteredJob = [];
        {jobList.map(job => {
            if(job.ThingGroupId === null || job.ThingGroupId === undefined){
                job.ThingGroupId = ''
            }

            if(job.ThingGroupName === null || job.ThingGroupName === undefined){
                job.ThingGroupName = ''
            }

            filteredJob.push(job)
        })}
        console.log('filtered jobs', filteredJob);
        return filteredJob;
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
                                    { title: 'Job Id', field: 'JobId' },
                                    {
                                        title: 'Status',
                                        field: 'Status',
                                        cellStyle: data => {
                                            if (data === 'COMPLETED') {
                                                return {
                                                    color: 'black',
                                                }
                                            }else if (data === 'IN_PROGRESS') {
                                                return {
                                                    color: 'green',
                                                }
                                            }else if (data === 'CANCELED' || data === 'DELETION_IN_PROGRESS') {
                                                return {
                                                    color: 'red',
                                                }
                                            }

                                        },
                                    },
                                    { title: 'CreatedAt', field: 'CreatedAt' },
                                    { title: 'LastUpdatedAt', field: 'LastUpdatedAt' },
                                    { title: 'TargetSelection', field: 'TargetSelection' },
                                    { title: 'ThingGroupId', field: 'ThingGroupId' },
                                    { title: 'ThingGroupName', field: 'ThingGroupName' },
                                    { title: 'Job Arn', field: 'JobArn' }
                                ]}
                                title="Jobs"
                                data={this.filterJobsData(this.state.jobsData)}
                                actions={[
                                    {
                                      icon: 'info',
                                      tooltip: 'Show job Info',
                                      onClick: (event, rowData) => { this.viewDetails(rowData.JobId)}
                                    }
                                ]}
                                options={{
                                    selection: false,
                                }}
                            />    
                        </Paper>
                        <Row lg={12} className="add-button-row">
                            <Link to={"/add-job"}>
                                <Button className="add-template-button" variant="contained" >
                                    Add Things Job
                                </Button>
                            </Link>
                            <Link to={"/add-group-job"}>
                                <Button className="add-template-button" variant="contained" >
                                    Add Groups Job
                                </Button>
                            </Link>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    };

}

export default withRouter(JobList);