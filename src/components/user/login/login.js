import React from "react";
import './login.scss';
// import { Auth } from "aws-amplify";
import { Row, Col } from 'react-flexbox-grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {withRouter} from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log(name);
        this.setState({
            [name]: value
        });
    }

    handleSubmit = async event => {
        // event.preventDefault();
        // const data = new FormData(event.target.value);
        // console.log(data);
        // try {
        //     await Auth.signIn(this.state.email, this.state.password);
        //     this.props.userHasAuthenticated(true);
        // } catch (e) {
        //     console.log(e.message);
        // }
        // this.props.history.push('/device-directory', { email: 'state' });
    }

    render () {
        return(
            <div className="app-container">
                <Row lg={6}>
                    <Paper className="main-paper login-container">
                        <form onSubmit={this.handleSubmit}>
                            <Col lg={12} className="input-col">
                                <TextField
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    margin="normal"
                                />
                                <TextField
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    margin="normal"
                                />
                                <div className="submit-button-row">
                                    <Button className="submit" variant="contained" onClick={this.handleSubmit}>
                                        Submit
                                    </Button>
                                </div>
                            </Col>
                        </form>
                    </Paper>
                </Row>
            </div>
        );
    };

}

export default withRouter(Login);
