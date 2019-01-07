import React from "react";
import AppHeader from '../../app-header';
import Sidenav from '../../sidenav';
import './user-list.scss';
import Paper from '@material-ui/core/Paper';
import { Row, Col } from 'react-flexbox-grid';
import {withRouter} from 'react-router-dom';
import API from '../../../utils/API';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            userRole:'',
            userOrg: '',
            childOrg: [],
            isAuthenticating: true
        }
    }

    async componentDidMount() {
        await this.userAuth()
        API.getAllUsers()
        .then(res => res.json()
        .then((res) => {
            const users = res.Items
            this.formatData(users);
        }))
        .catch(err => alert(err))
    }
    async userAuth(){

        //todo
        this.setState({userGroup: 'SystemAdmin', loggedIn: true});

        this.setState({userRole: 'SystemAdmin', userOrg: 'Org'})
        if(this.state.userOrg !== "All"){
            API.getOrg(this.state.userOrg)
                .then(res => res.json()
                    .then((res) => {
                        console.log('res', res)
                        if(res.Item.Children !== undefined){
                            this.setState({childOrg: res.Item.Children.SS})
                            this.setState({ isAuthenticating: false });}
                    }))}
        this.setState({ isAuthenticating: false });
    }

    formatData = (users) => {
        let formattedData = [];
        users.map(user => {
            formattedData.push(
                {
                    firstName: user.firstName.S,
                    lastName: user.lastName.S,
                    email: user.EmailAddress.S,
                    dept: user.dept.S,
                    org: user.org.S,
                    role: user.userRole.S,
                }
            )
            return formattedData;
        })
        this.setState({
            userData: formattedData
        });
    }

    viewDetails(userName) {
        console.log(userName);
        // this.props.history.push('/org/' + orgName, { email: 'state' });
    }

    filterUserData(userList){
        console.log("child org", this.state.childOrg)
        let filteredUsers = [];
        {userList.map(user => {
            if(user.org.includes(this.state.userOrg) || this.state.userOrg === "All" || this.state.childOrg.includes(user.org)){
                filteredUsers.push(user)
            }
        })}
        console.log('filtered users', filteredUsers);
        return filteredUsers;
    }


    render () {
        return(
            !this.state.isAuthenticating &&
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
                                    { title: 'First Name', field: 'firstName' },
                                    { title: 'Last Name', field: 'lastName' },
                                    { title: 'Email', field: 'email' },
                                    { title: 'Department', field: 'dept' },
                                    { title: 'Organization', field: 'org' },
                                    { title: 'User Role', field: 'role' }
                                ]}
                                title="Users"
                                data={this.filterUserData(this.state.userData)}
                            />
                        </Paper>
                        <Row lg={12} className="add-button-row">
                            <Link to={"/add-user"}>
                                <Button className="add-user-button" variant="contained" >
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

export default withRouter(UserList);
