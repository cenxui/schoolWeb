import React, {Component} from 'react';
import './sidenav.scss';
import { Link } from 'react-router-dom';
import { SideNav, Nav } from 'react-sidenav';
import sidenavItems from './sidenav.json';
import MaterialIcon from 'material-icons-react';
import {withRouter} from 'react-router-dom';

class Sidenav extends Component {
    constructor(props){
        super(props);
        this.state = {
            userGroup: []
        }
    }
    componentWillMount() {
        this.userAuth();
        this.setState({ isAuthenticating: true });
    }
    componentWillReceiveProps(){
        this.userAuth();
    }
    async userAuth(){
        this.setState({userGroup: 'SystemAdmin'});
    }

    render(){
        return(
            <SideNav defaultSelectedPath="1">
                {sidenavItems.map(sidenavItem => {
                    // if(sidenavItem.groups.includes(this.state.userGroup[0])){
                        return (
                            <Nav id={sidenavItem.id} key={sidenavItem.id}>
                                <Link to={sidenavItem.navPath} className="nav-item">
                                    <MaterialIcon icon={sidenavItem.icon} />
                                    {sidenavItem.title}
                                </Link>
                            </Nav>
                        );
                    // }
                })}
            </SideNav>
        )
    }
}

export default withRouter(Sidenav);
