import React, {Component} from "react";
import Notifications from 'react-notify-toast'
//import FontAwesome from "react-fontawesome";
import { Route, NavLink, Link, BrowserRouter as Router, Switch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookReader, faFileExcel } from '@fortawesome/free-solid-svg-icons'
import { 
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem
 } from 'reactstrap';
import MyLibrary from "../Bookshelves/MyLibrary";
import Search from "../Search/Search";
import { storeContext } from "../../utils/storeContext";
import OAuth from "../Auth/OAuth"
import {socket, provider} from "../../utils/auth"
import { observer } from "mobx-react"

//consider making links disabled when you're already on that route

@observer
class Header extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    }
  }

  toggle() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  }

  render() {
    const {logout} = this.props;
    return (
          <Navbar className="pb-0 mb-3 px-lg-5 fixed-top" light expand="md">
            <NavbarBrand tag="span"><NavLink className="nav-link" to="/">My Catalogue</NavLink></NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} className="justify-content-end" navbar>
              <Nav navbar>
                <NavItem className="justify-content-center align-items-center flex-wrap"><Search /></NavItem>
                { this.context.authData.id ?
                  <React.Fragment>
                    <NavItem className="justify-content-center mx-2"><NavLink className="nav-link w-100 text-center" to="/bookshelves"> My Library </NavLink></NavItem>
                    <NavItem className="justify-content-center mx-2"><NavLink className="nav-link w-100 text-center" to="/myreviews"> My Reviews </NavLink></NavItem>
                    <NavItem className="justify-content-center mx-2"><NavLink  className="nav-link w-100 text-center" id="sign-out" to="/" onClick={logout}>Sign Out</NavLink></NavItem>
                  </React.Fragment>
                  :
                  <NavItem className="justify-content-center"><NavLink  className="nav-link w-100 text-center p-0 mx-3" to="/"><OAuth
                  socket={socket}
                  key={provider}
                  provider={provider}
                  />
                  </NavLink>
                  </NavItem>
                }
              </Nav>
            </Collapse>
          </Navbar>
    )
  }
}

Header.contextType = storeContext;
export default Header;