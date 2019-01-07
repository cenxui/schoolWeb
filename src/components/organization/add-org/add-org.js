import React from "react";
import Sidenav from '../../sidenav';
import './add-org.scss';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@material-ui/core/Button';
import {withRouter} from 'react-router-dom';
import API from "../../../utils/API";

class AddOrg extends React.Component {
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
            parentToUpdate: '',
            value: { name: '', touched: false },
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            org: {...this.state.org,
                [name]: value
            }
        });
    }

    handleSubmit() {
        const newOrg = {
            "TableName" : "LogitechDeviceOrg",
            "Item" : {
                "orgName": {"S" : this.removeWhiteSpace(this.state.org.orgName)},
                "OrgID": {"S" : this.removeWhiteSpace(this.state.org.orgId)},
                "orgType": {"S" : this.removeWhiteSpace(this.state.org.orgType)},
                "address": {"S" : this.removeWhiteSpace(this.state.org.address)},
                "country": {"S" : this.removeWhiteSpace(this.state.org.country)},
                "parent": {"S" : this.removeWhiteSpace(this.state.org.parent)}
            }
        }
        const parentOrg = {
            "TableName" : "LogitechDeviceOrg",
            "Item" : {
                "OrgID": {"S": this.state.org.parent},
                "Children": {"SS": [this.removeWhiteSpace(this.state.org.orgId)]}
            }
        }
        console.log(newOrg);
        API.addOrg(newOrg)
        .then(() => {
            console.log('posted:', newOrg);
            // API.getOrg(this.state.org.parent)
            // .then(res => res.json()
            // .then((res) => {
            //     console.log('res', res)
            //     API.addOrg(parentOrg)
            //     .then(() => {
            //         console.log('updated:', newOrg)})
        // }))

            this.props.history.push('/org-manager', { email: 'state' })
        })
    }

    removeWhiteSpace(str) {
        str = str.replace(/\s+/g, '');
        return str;
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
                            <Row lg={12}>
                                <form>
                                    <Col lg={4} className="input-col">
                                        <TextField
                                            name="orgName"
                                            label="Org Name"
                                            value={this.state.org.orgName}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />
                                        <TextField
                                            name="orgId"
                                            label="Org ID"
                                            value={this.state.org.orgId}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />
                                    </Col>
                                    <Col lg={4} className="input-col">
                                        <TextField
                                            name="address"
                                            label="Address"
                                            value={this.state.org.address}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />
                                        <TextField
                                            name="country"
                                            label="Country"
                                            value={this.state.org.country}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />
                                    </Col>
                                    <Col lg={4} className="input-col">
                                        <TextField
                                            name="orgType"
                                            label="Org Type"
                                            value={this.state.org.orgType}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />
                                        <TextField
                                            name="parent"
                                            label="Parent Org"
                                            value={this.state.org.parent}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />
                                    </Col>
                                </form>
                            </Row>
                        </Paper>
                        <div className="submit-button-row">
                            <Button className="submit" variant="contained" onClick={this.handleSubmit}>
                                Submit
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    };

}

export default withRouter(AddOrg);
