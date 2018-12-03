import React from "react";
import AppHeader from '../../app-header';
import Sidenav from '../../sidenav';
import './org-list.scss';
import Paper from '@material-ui/core/Paper';
import { Row, Col } from 'react-flexbox-grid';
import {withRouter} from 'react-router-dom';
import API from '../../../utils/API';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { Auth } from "aws-amplify";


class OrgList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orgsData: [],
            userRole: '',
            userOrg: '',
        }
    }
    async componentDidMount() {
        await this.userAuth();
        API.getAllOrgs()
        .then(res => res.json()
        .then((res) => {
            console.log(res)
            const orgs = res.Items
            this.formatData(orgs);
        }))
        .catch(err => alert(err))
    }

    userAuth(){
        Auth.currentSession()
        .then((user)=>{
            this.setState({userRole: user.idToken.payload['cognito:groups'], userOrg: user.idToken.payload['custom:org']})
            console.log('state', this.state)
        })
    }

    formatData = (orgs) => {
        let formattedData = [];
        orgs.map(org => {
            formattedData.push(
                {
                    orgName: org.orgName.S,
                    OrgID: org.OrgID.S,
                    orgType: org.orgType.S,
                    address: org.address.S,
                    country: org.country.S,
                    parent: org.parent.S,
                }
            )
            return formattedData;
        })
        this.setState({
            orgsData: formattedData
        });
        console.log(this.state.orgsData);
    }

    filterOrgData(orgList){
        let filteredOrgs = [];
        {orgList.map(org => {
            if(org.orgName.includes(this.state.userOrg) || org.parent.includes(this.state.userOrg) || this.state.userOrg === "All"){
                filteredOrgs.push(org)
            }
        })}
        console.log('filtered orgs', filteredOrgs);
        return filteredOrgs;
    }

    viewDetails(orgName) {
        console.log(orgName);
        // this.props.history.push('/org/' + orgName, { email: 'state' });
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
                                    { title: 'Org Name', field: 'orgName' },
                                    { title: 'Org ID', field: 'OrgID' },
                                    { title: 'Org Type', field: 'orgType' },
                                    { title: 'Address', field: 'address' },
                                    { title: 'Country', field: 'country' },
                                    { title: 'Parent', field: 'parent' }
                                ]}
                                title="Orgs"
                                data={this.filterOrgData(this.state.orgsData)}
                            />
                        </Paper>
                        <Row lg={12} className="add-button-row">
                            <Link to={"/add-org"}>
                                <Button className="add-org-button" variant="contained" >
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

export default withRouter(OrgList);