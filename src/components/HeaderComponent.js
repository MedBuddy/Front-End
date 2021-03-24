import React, { Component } from 'react';
import { Navbar,NavbarBrand,Nav,NavItem,Collapse,NavbarToggler } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import '../styles/header.css';

class Header extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            isNavOpen:false
        };
        this.toggleNav=this.toggleNav.bind(this);
    }
    
    toggleNav()
    {
        this.setState(
            {
                isNavOpen: !this.state.isNavOpen
            }
        );
    }
    render(){
        return (
            <>
            <Navbar dark expand="md">
                <div className="container">
                    <NavbarToggler onClick={this.toggleNav} />
                    <NavbarBrand href="/">
                        <img src="images/medbuddy_icon.png" alt="MedBuddy" width="55" height="50" />
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
                        <NavItem>
                            <NavLink className="nav-link loginbtn" to="/login">
                                <span className="fa fa-sign-in fa-lg"></span> Login
                            </NavLink>
                        </NavItem>

                    </Nav>
                    </Collapse>
                </div>
            </Navbar>
            </>
        )
    }
}

export default Header