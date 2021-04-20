import React, { Component } from 'react'
import { Form,FormGroup,Label,Input,Nav,NavItem,TabContent,TabPane } from 'reactstrap'
import '../styles/login.css'

class Login extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            formtype:'login',
            email:'',
            username:'',
            password:'',
            confirmpassword:'',
            logintype:'user'
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.changeForm = this.changeForm.bind(this);
        this.showPassword = this.showPassword.bind(this);
        this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        
        this.setState({
          [name]: value
        });
    }
    handleLoginSubmit(event) {
        alert('Current State is: ' + JSON.stringify(this.state));
        event.preventDefault();
    }
    changeForm(form) {
        this.setState({
            formtype: form,
            email:'',
            username:'',
            password:'',
            confirmpassword:'',
            logintype:'user'
        });
    }
    showPassword(event)
    {
        if(event.target.checked===true)
        {
            document.getElementById('password').type="text"
        }
        else
        {
            document.getElementById('password').type="password"
        }   
    }
    handleSignupSubmit(event)
    {
        let pattern = new RegExp("[a-zA-Z]{1}[a-zA-Z0-9_]{2,}")
        
        if(pattern.test(this.state.username))
        {
            pattern=new RegExp("[a-zA-Z]{1}[a-zA-Z0-9_@#$&]{2,}")
            if(pattern.test(this.state.password))
            {
                if(this.state.password!==this.state.confirmpassword)
                {
                    alert('Password and confirm password does not match')
                }
                else
                {
                    alert('Current State is: ' + JSON.stringify(this.state))
                }
            }
            else
            {
                alert('Password should start with a-z or A-Z and can contain @,#,$,&,_')
            }
        }
        else
        {
            window.alert('Username should start with a-z or A-Z and can contain a-z,A-Z,0-9,_ and should be minimum of 3 characters')
        }
        
        
        event.preventDefault();
    }

    render(){
        return (
            <>
                <div className="container">
                    
                    <div className="row login-style-1-bg mt-3">
                        <div className="col-3">
                            <img src="/images/medbuddy_icon.png" alt="MedBuddy" width="55" height="50" />
                        </div>
                        <div className="col-9 login-style-1">MedBuddy</div>
                    </div>

                    <div className="row justify-content-center align-items-center row-content">
                        <div className="col-4">
                            <img src="/images/login-left.svg" alt="login-leftimg" width="354" height="300" />
                        </div>
                        <div className="col-4 login-form-bg">
                            <div className="row">
                                <Nav className="login-nav">
                                        <NavItem className={(this.state.formtype==='login')?'login-activate-tab col-6':'login-navitem col-6'} onClick={() => this.changeForm('login')} >
                                            Login
                                        </NavItem>
                                        <NavItem className={(this.state.formtype==='signup')?'login-activate-tab col-6':'login-navitem col-6'} onClick={() => this.changeForm('signup')} >
                                            Sign Up
                                        </NavItem>
                                </Nav>
                            </div>
                            <TabContent activeTab={this.state.formtype}>
                                <TabPane tabId='login'>
                                    <Form className="mt-3 login-form-padding" onSubmit={this.handleLoginSubmit}>
                                        {/* <FormGroup row className="justify-content-center mt-2">
                                            <img src="/images/medbuddy_icon.png" alt="MedBuddy" width="116" height="107" className="mt-1" />
                                        </FormGroup> */}
                                        <h1 className="login-form-header"><b>Login</b></h1>
                                        <FormGroup row>
                                                <Label htmlFor="username" className="col-12">Username</Label>
                                                <Input type="text" className="login-input-box col-12" id="username" name="username" placeholder="Username" autoComplete="off" required value={this.state.username} onChange={this.handleInputChange} />
                                        </FormGroup>
                                        <FormGroup row>
                                                <Label htmlFor="password" className="col-12">Password</Label>
                                                <Input type="password" className="login-input-box col-12" id="password" name="password" placeholder="Password" autoComplete="off" required value={this.state.password} onChange={this.handleInputChange} />
                                        </FormGroup>
                                        <FormGroup row>
                                            <Input type="checkbox" className="ml-1" onClick={this.showPassword} />
                                            <Label htmlFor="showpassword" className="ml-4"> Show Password</Label>
                                        </FormGroup>
                                        <FormGroup row className="mt-4">
                                                <Label htmlFor="logintype" className="col-4">Login as</Label>
                                                <Input className="col-8" type="select" id="logintype" name="logintype" required value={this.state.logintype} onChange={this.handleInputChange} >
                                                    <i className="fas fa-chevron-down"></i>
                                                    <option>user</option>
                                                    <option>doctor</option>
                                                    <option>admin</option>
                                                </Input>
                                        </FormGroup>
                                        <FormGroup row className="justify-content-center mt-4">
                                            <Input type="submit" value="Login" className="login-submit-btn mb-3" />
                                        </FormGroup>
                                    </Form>
                                </TabPane>
                                <TabPane tabId='signup'>
                                    <Form className="mt-3 login-form-padding" onSubmit={this.handleSignupSubmit}>
                                        {/* <FormGroup row className="justify-content-center mt-2">
                                            <img src="/images/medbuddy_icon.png" alt="MedBuddy" width="116" height="107" className="mt-1" />
                                        </FormGroup> */}
                                        <h1 className="login-form-header"><b>Sign Up</b></h1>
                                        <FormGroup row>
                                                <Label htmlFor="email" className="col-12">Email Address</Label>
                                                <Input type="email" className="login-input-box col-12" id="email" name="email" placeholder="Email" autoComplete="off" required value={this.state.email} onChange={this.handleInputChange} />
                                        </FormGroup>
                                        <FormGroup row>
                                                <Label htmlFor="username" className="col-12">Username</Label>
                                                <Input type="text" className="login-input-box" id="username" name="username" placeholder="Username" autoComplete="off" required value={this.state.username} onChange={this.handleInputChange} />
                                        </FormGroup>
                                        <FormGroup row>
                                                <Label htmlFor="password" className="col-12">Password</Label>
                                                <Input type="password" className="login-input-box" id="password" name="password" placeholder="Password" autoComplete="off" required value={this.state.password} onChange={this.handleInputChange} />
                                        </FormGroup>
                                        <FormGroup row>
                                                <Label htmlFor="confirmpassword" className="col-12">Confirm Password</Label>
                                                <Input type="password" className="login-input-box" id="confirmpassword" name="confirmpassword" placeholder="Confirm Password" autoComplete="off" required value={this.state.confirmpassword} onChange={this.handleInputChange} />
                                        </FormGroup>
                                        <FormGroup row className="mt-4">
                                                <Label htmlFor="logintype" className="col-4">Type</Label>
                                                <Input className="col-8 ml-auto" type="select" id="logintype" name="logintype" required value={this.state.logintype} onChange={this.handleInputChange} >
                                                    <i className="fas fa-chevron-down"></i>
                                                    <option>user</option>
                                                    <option>doctor</option>
                                                </Input>
                                        </FormGroup>
                                        <FormGroup row className="justify-content-center mt-4">
                                            <Input type="submit" value="Sign up" className="login-submit-btn mb-3" />
                                        </FormGroup>
                                    </Form>
                                </TabPane>
                            </TabContent>
                        </div>
                        <div className="col-4 justify-content-center">
                            <img src="/images/login-right.svg" alt="login-rightimg" width="304" height="281" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <div className="text-center">
                                <a className="btn btn-social-icon btn-facebook" href="http://www.facebook.com/profile.php?id="><i className="fa fa-facebook fa-lg"></i></a>
                                <a className="btn btn-social-icon" href="http://www.instagram.com"><i className="fa fa-instagram fa-lg instagramcss"></i></a>
                                <a className="btn btn-social-icon btn-twitter" href="http://twitter.com/"><i className="fa fa-twitter fa-lg"></i></a>            
                            </div>
                        </div>
                        <div className="col-4 login-copyright">
                            Copyrights © 2021 MedBuddy
                        </div>
                        <div className="col-4">
                            <div className="text-center">
                                <a className="btn btn-social-icon btn-linkedin" href="http://www.linkedin.com/in/"><i className="fa fa-linkedin fa-lg"></i></a>
                                <a className="btn btn-social-icon" href="mailto:"><i className="fa fa-envelope-o text-danger bg-light"></i></a>
                                <a className="btn btn-social-icon" href="http://wa.me/123456789"><i className="fa fa-whatsapp fa-lg whatsappcss"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Login