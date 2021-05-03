import React, { Component } from 'react';
import { Navbar,NavbarBrand,Nav,NavItem,Collapse,NavbarToggler,Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import '../styles/header.css';

class Header extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            isNavOpen:false,
            username: localStorage.getItem('username')
        };
        this.toggleNav=this.toggleNav.bind(this);
        this.logout = this.logout.bind(this);
    }
    
    toggleNav()
    {
        this.setState(
            {
                isNavOpen: !this.state.isNavOpen
            }
        );
    }

    logout(){
        localStorage.removeItem('username')
        localStorage.removeItem('userToken')
        this.setState({
            username: null
        })
        window.location.reload()
    }

    displayBtns(){      
        if(!this.state.username){
            return (
                <NavItem>
                    <NavLink className="nav-link header-loginbtn" to="/login">
                        <span className="fa fa-sign-in fa-lg"></span> Login
                    </NavLink>
                </NavItem>
            )
        }
        else{
            return (
                <>
                    <NavItem>
                        <div className="header-user">
                            <img src="http://localhost:4000/images/user-default.jpg" alt="user-img" className="header-img"></img>
                            <span className="header-username">{ this.state.username }</span>
                        </div>
                    </NavItem>
                    <NavItem>
                        <Button className="nav-link logoutbtn" onClick={this.logout}>
                            <span className="fa fa-sign-out fa-lg"></span> Logout
                        </Button>
                    </NavItem>
                </>
            )
        }
    }

    render(){
        return (
            <>
            <Navbar dark expand="md">
                <div className="container">
                    <NavbarToggler onClick={this.toggleNav} />
                    <NavbarBrand href="/">
                        <img src="/images/medbuddy_icon.png" alt="MedBuddy" width="55" height="50" />
                    </NavbarBrand>
                    <Collapse isOpen={this.state.isNavOpen}  navbar>
                    <Nav navbar>
                        <NavItem>
                            <NavLink className="nav-link" to="/home">
                                <span className="fa fa-home fa-lg"></span>
                                <span className="header-style-1"> Home</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="nav-link" to="/news">
                                <span className="fa fa-newspaper-o fa-lg"></span>
                                <span className="header-style-1"> News</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="nav-link" to="/forum">
                                <span className="fa fa-comment fa-lg"></span>
                                <span className="header-style-1"> Forum</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="nav-link" to="/consult">
                                <span className="fa fa-stethoscope fa-lg"></span> 
                                <span className="header-style-1"> Consult</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="nav-link" to="/about">
                                <span className="fa fa-info fa-lg"></span> 
                                <span className="header-style-1"> About</span>
                            </NavLink>
                        </NavItem>
                        
                    </Nav>
                    <Nav navbar className="ml-auto">
                        { this.displayBtns() }
                    </Nav>
                    </Collapse>
                </div>
            </Navbar>
            </>
        )
    }
}

export default Header