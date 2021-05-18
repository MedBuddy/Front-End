import React, { Component } from 'react';
import { Navbar,NavbarBrand,Nav,NavItem,Collapse,NavbarToggler,Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import './header.css';

class Header extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            isNavOpen:false,
            username: localStorage.getItem('username'),
            userIcon: localStorage.getItem('userIcon')
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
        localStorage.removeItem('userIcon')
        localStorage.removeItem('loginType')
        this.setState({
            username: null
        })
        localStorage.setItem('info', `Logged out successfully!`)
        window.location.href = '/'
    }

    displayBtns(){      
        if(!this.state.username)
        {
            return (
                <NavItem>
                    <NavLink className="nav-link header-loginbtn" to="/login">
                        <span className="fa fa-sign-in fa-lg"></span> Login
                    </NavLink>
                </NavItem>
            )
        }
        else
        {
            return (
                <>
                    <NavItem>
                        <div className="header-user">
                            <img src={this.state.userIcon} alt="user-img" className="header-img" onClick={ () => window.location.href = '/profile' }></img>
                            <span className="header-username" onClick={ () => window.location.href = '/profile' }>{ this.state.username }</span>
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
    renderAdminNavs()
    {
        if(localStorage.getItem('loginType') === 'admin')
        {
            return(
                <>
                    <NavItem>
                        <NavLink className="nav-link d-flex align-items-center" to="/approval">
                            <span className="material-icons">how_to_reg</span> 
                            <span className="header-style-1"> Approval</span>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="nav-link d-flex align-items-center" to="/feedback">
                            <span className="material-icons pt-1">rate_review</span>
                            <span className="header-style-1"> Feedback</span>
                        </NavLink>
                    </NavItem>
                </>
            )
        }   
        else
        {
            return (
                <NavItem>
                    <NavLink className="nav-link" to="/consult">
                        <span className="fa fa-stethoscope fa-lg"></span> 
                        <span className="header-style-1"> Consult</span>
                    </NavLink>
                </NavItem>
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
                    <Nav navbar className="d-flex align-items-center">
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
                            <NavLink className="nav-link d-flex align-items-center" to="/forum">
                                <span class="material-icons pt-1">question_answer</span>
                                <span className="header-style-1"> Forum</span>
                            </NavLink>
                        </NavItem>
                        {this.renderAdminNavs()}
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