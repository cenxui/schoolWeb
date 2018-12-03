import React from "react";
import AppHeader from '../../app-header';
import Sidenav from '../../sidenav';
import './add-job.scss';
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

class AddJob extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            jobId: '',
            // target: '', //todo
            firmwareURL: '',
            targetSelection: '',
            description:'',
            thingsData: []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        API.getAllThings()
            .then(res => res.json()
                .then((res) => {
                    console.log(res)
                    const thing = res.Things
                    this.formatData(thing);
                }))
            .catch(err => alert(err))
    }

    formatData = (things) => {
        let formattedData = [];
        things.map(thing => {
            if(thing.ThingTypeName === undefined || thing.ThingTypeName === null ){
                thing.ThingTypeName = ''
            }

            formattedData.push(
                {
                    'ThingArn': thing.ThingArn,
                    'ThingName': thing.ThingName,
                    'ThingTypeName': thing.ThingTypeName,
                    'Version': thing.Version,
                }
            )
            return formattedData;
        })
        this.setState({
            thingsData: formattedData
        });
        console.log(this.state.thingsData);
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
                                { title: 'ThingName', field: 'ThingName' },
                                { title: 'Version', field: 'Version'},
                                { title: 'ThingTypeName', field: 'ThingTypeName' },
                                { title: 'ThingArn', field: 'ThingArn'},
                            ]}
                            data={this.state.thingsData}
                            title="Things"
                            actions={[
                                {
                                    icon: 'done_all',
                                    tooltip: 'Add Things Job',
                                    onClick: (event, rows) => {
                                        let targets = []
                                        rows.forEach((v) => {
                                            targets.push(v.ThingArn)
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

export default withRouter(AddJob);