import React, {Component} from "react";
import Notifications from 'react-notify-toast'
//import FontAwesome from "react-fontawesome";
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookReader, faFileExcel } from '@fortawesome/free-solid-svg-icons'
import { 
  Dropdown, 
  DropdownToggle, 
  DropdownMenu, 
  DropdownItem,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink
 } from 'reactstrap';
import MyLibrary from "./MyLibrary";
import Search from "./Search";

//consider making links disabled when you're already on that route

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    }
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
    const {logout} = this.props;
    return (
          <Navbar>
            <NavbarBrand><Link to="/">My Catalogue</Link></NavbarBrand>
            <Nav>
              <NavItem><Search /></NavItem>
            
              <NavItem><NavLink><Link to="/bookshelves"> My Library </Link></NavLink></NavItem>
              <NavItem><NavLink><Link to="/myreviews">My Reviews</Link></NavLink></NavItem>
              <NavItem><NavLink onClick={logout}>Sign Out</NavLink></NavItem>
            </Nav>
          </Navbar>
    )
  }
}