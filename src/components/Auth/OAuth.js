import React, {Component} from "react";
import FontAwesome from "react-fontawesome";
import {API_URL} from "../../config";
import MyLibrary from "../Bookshelves/MyLibrary";
import { observer } from "mobx-react"
import {storeContext} from "../../utils/storeContext"


import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

@observer
class OAuth extends Component {
  state = {
    disabled: ''
  }  

  componentDidMount() {
    const { socket, provider } = this.props
    console.log(socket);
    console.log(provider);
    
        

    socket.on(provider, user => {  
      console.log("??")
      this.popup.close()
      //this.props.addProviderData(provider, providerData, email)
      this.context.addAllAuthData(user);
    })

    // socket.on(`${provider}-error`, msg => {
    //   this.popup.close()
    //   notify.show(msg)
    // })
  }

  // Routinely checks the popup to re-enable the login button
  // if the user closes the popup without authenticating.
  checkPopup = () => {
    const check = setInterval(() => {
      console.log(this.props.socket.id);
      
      const { popup } = this
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check)
        this.setState({ disabled: ''})
      }
    }, 1000)
  }

  // Launches the popup by making a request to the server and then
  // passes along the socket id so it can be used to send back user
  // data to the appropriate socket on the connected client.
  openPopup = () => {
    const { provider, socket } = this.props
    const width = 600, height = 600
    const left = (window.innerWidth / 2) - (width / 2)
    const top = (window.innerHeight / 2) - (height / 2)
    const url = `${API_URL}/${provider}?socketId=${socket.id}`

    return window.open(url, '',
      `toolbar=no, location=no, directories=no, status=no, menubar=no,
      scrollbars=no, resizable=no, copyhistory=no, width=${width},
      height=${height}, top=${top}, left=${left}`
    )
  }

  // Kicks off the processes of opening the popup on the server and listening
  // to the popup. It also disables the login button so the user can not
  // attempt to login to the provider twice.
  startAuth = () => {
    if (!this.state.disabled) {
      //e.preventDefault()
      this.popup = this.openPopup()
      this.checkPopup()
      this.setState({disabled: 'disabled'})
    }
  }
  // bookshelfClick = (id, title) => {
  //   this.setState({bookshelfClicked: true, bookshelfId: id, shelfTitle: title})
  // }

  render() {
    const { provider } = this.props
    const { disabled} = this.state

    return (
              <div className={'button-wrapper fadein-fast w-100 h-100'}>
                <button
                  onClick={this.startAuth}
                  className={`${provider} ${disabled} btn w-100 h-100`}
                > 
                  <FontAwesome
                    name={provider}
                  />      Sign in with Google
                </button>
              </div>
    )
  }
}

OAuth.contextType = storeContext;
export default OAuth;
