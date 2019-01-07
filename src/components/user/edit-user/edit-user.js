import React from "react";
import Sidenav from '../../sidenav';
import './add-user.scss';
import { Row, Col } from 'react-flexbox-grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import {withRouter} from 'react-router-dom';

class EditUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            org: '',
            dept: '',
            value: { name: '', touched: false },
            disable: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }

    handleCheck = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleSubmit() {
        console.log('test');
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
                                    <Col lg={6} className="input-col">
                                        <TextField
                                            name="firstName"
                                            label="First Name"
                                            value={this.state.firstName}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />
                                        <TextField
                                            name="lastName"
                                            label="Last Name"
                                            value={this.state.lastName}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />
                                        <TextField
                                            name="email"
                                            label="Email Address"
                                            value={this.state.email}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />
                                        <TextField
                                            name="userId"
                                            label="User ID"
                                            value={this.state.email}
                                            disabled={true}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />
                                    </Col>
                                    <Col lg={6} className="input-col">
                                        <TextField
                                            name="org"
                                            label="Organization"
                                            value={this.state.org}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />
                                        <TextField
                                            name="dept"
                                            label="Department"
                                            value={this.state.dept}
                                            onChange={this.handleChange}
                                            margin="normal"
                                        />

                                        <Select
                                            name="userRole"
                                            value={this.state.value}
                                            onChange={this.handleChange}
                                            >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            <MenuItem value="superUser">Super User</MenuItem>
                                            <MenuItem value="orgAdmin">Org Admin</MenuItem>
                                            <MenuItem value="orgUser">Org User</MenuItem>
                                            <MenuItem value="resellerAdmin">Reseller Admin</MenuItem>
                                            <MenuItem value="resellerUser">Reseller User</MenuItem>
                                        </Select>
                                        <label>Disable Account?</label><Checkbox
                                            checked={this.state.disable}
                                            onChange={this.handleCheck('disable')}
                                            value="disable"
                                        />
                                    </Col>
                                </form>
                            </Row>
                        </Paper>
                        <div className="submit-button-row">
                            <Button className="submit" variant="contained" >
                                Submit
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    };

}

export default withRouter(EditUser);
