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
  Navbar,
  NavbarBrand
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
            <NavbarBrand href="/">My Catalogue</NavbarBrand>
            <Search />
            <Dropdown direction="left" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle
              tag="span"
              data-toggle="dropdown"
              aria-expanded={this.state.dropdownOpen}
              >
              <FontAwesomeIcon icon={faBookReader} />
              </DropdownToggle>
              <DropdownMenu
              style={{marginTop: "20px", backgroundColor: "rgba(255, 255, 255, 0.5)"}}
              >
                <DropdownItem>View Profile</DropdownItem>
                <DropdownItem><Link to="/bookshelves"> My Library </Link></DropdownItem>
                <DropdownItem><Link to="/myreviews">My Reviews</Link></DropdownItem>
                <DropdownItem onClick={logout}>Sign Out</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Navbar>
    )
  }
}