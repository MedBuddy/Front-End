import React, { Component } from 'react'
import { Form,FormGroup,Label,Input,Nav,NavItem,TabContent,TabPane } from 'reactstrap'
import '../styles/login.css'

const emailRegex = [
    {
        regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        error: 'Invalid Email!'
    }
]
const usernameRegex = [
    {
        regex: /^[a-zA-Z].{7,}$/,
        error: 'Username should start with a letter and contain atleast 8 characters'
    },
    {
        regex: /^[a-zA-Z0-9_]*$/,
        error: 'Username should contain only letters, numbers and underscore(_)'
    }
]
const passwordRegex = [
    {
        regex: /^[a-zA-Z0-9_@#$&]*$/,
        error: 'Password should contain only letters,numbers,_,@,#,$,&'
    },
    {
        regex: /^.{8,}$/,
        error: 'Password should contain atleast 8 characters'
    }
]

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
            logintype:'user',
            errors: {
                email:'',
                username:'',
                password:'',
                confirmpassword:''
            }
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.changeForm = this.changeForm.bind(this);
        this.showPassword = this.showPassword.bind(this);
        this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        
        this.setState({
          [name]: value
        });
    }
    handleLoginSubmit(event) {
        alert('Current State is: ' + JSON.stringify(this.state));
        event.preventDefault();
    }
    changeForm(form) {
        let errors = {
            email: '',
            username: '',
            password: '',
            confirmpassword: ''
        }
        this.setState({
            formtype: form,
            email:'',
            username:'',
            password:'',
            confirmpassword:'',
            logintype:'user',
            errors: errors
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
        event.preventDefault();
        let errors = {
            email: '',
            username: '',
            password: '',
            confirmpassword: ''
        }
        this.setState({
            errors: errors
        })
        for(let i in emailRegex){
            if(!emailRegex[i].regex.test(this.state.email)){
                errors.email = emailRegex[i].error
                break
            }
        }
        for(let i in usernameRegex){
            if(!usernameRegex[i].regex.test(this.state.username)){
                errors.username = usernameRegex[i].error
                break
            }
        }
        for(let i in passwordRegex){
            if(!passwordRegex[i].regex.test(this.state.password)){
                errors.password = passwordRegex[i].error
                break
            }
        }
        if(this.state.confirmpassword !== this.state.password)
            errors.confirmpassword = 'Passwords don\'t match'
        let isError = false
        for(let field in errors){
            if(errors[field] !== ''){
                isError = true
                break
            }
        }
        if(isError){
            this.setState({
                errors: errors
            })
            return
        }

        alert('Current State is: ' + JSON.stringify(this.state))
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
                                        <NavItem className={(this.state.formtype==='login')?'login-activate-tab col-6':'login-navitem col-6'} 
                                                onClick={() => this.changeForm('login')} >
                                            Login
                                        </NavItem>
                                        <NavItem className={(this.state.formtype==='signup')?'login-activate-tab col-6':'login-navitem col-6'} 
                                                onClick={() => this.changeForm('signup')} >
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
                                                <Input type="text" className="login-input-box col-12" id="username" name="username" 
                                                        placeholder="Username" autoComplete="off" required value={this.state.username} 
                                                        onChange={this.handleInputChange} />
                                        </FormGroup>
                                        <FormGroup row>
                                                <Label htmlFor="password" className="col-12">Password</Label>
                                                <Input type="password" className="login-input-box col-12" id="password" name="password" 
                                                        placeholder="Password" autoComplete="off" required value={this.state.password} 
                                                        onChange={this.handleInputChange} />
                                        </FormGroup>
                                        <FormGroup row>
                                            <Input type="checkbox" id="showpassword" className="ml-1" onClick={this.showPassword} />
                                            <Label htmlFor="showpassword" className="ml-4"> Show Password</Label>
                                        </FormGroup>
                                        <FormGroup row className="mt-4">
                                            <Label htmlFor="logintype" className="col-4">Login as</Label>
                                            <Input className="col-8" type="select" id="logintype" name="logintype" required 
                                                    value={this.state.logintype} onChange={this.handleInputChange} >
                                                <i className="fas fa-chevron-down"></i>
                                                <option>user</option>
                                                <option>doctor</option>
                                                <option>admin</option>
                                            </Input>
                                        </FormGroup>
                                        <FormGroup row className="justify-content-center mt-4">
                                            <div className="col-5">
                                                <Input type="submit" value="Login" className="btn login-submit-btn mb-3" />
                                            </div>
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
                                                <Input type="text" className="login-input-box col-12" id="email" name="email" 
                                                        placeholder="Email" autoComplete="off" required value={this.state.email} 
                                                        onChange={this.handleInputChange} />
                                                <span className="col-12 error">{ this.state.errors.email }</span>
                                        </FormGroup>
                                        <FormGroup row>
                                                <Label htmlFor="username" className="col-12">Username</Label>
                                                <Input type="text" className="login-input-box" id="username" name="username" 
                                                        placeholder="Username" autoComplete="off" required value={this.state.username} 
                                                        onChange={this.handleInputChange} />
                                                <span className="col-12 error">{ this.state.errors.username }</span>
                                        </FormGroup>
                                        <FormGroup row>
                                                <Label htmlFor="password" className="col-12">Password</Label>
                                                <Input type="password" className="login-input-box" id="password" name="password" 
                                                        placeholder="Password" autoComplete="off" required value={this.state.password} 
                                                        onChange={this.handleInputChange} />
                                                <span className="col-12 error">{ this.state.errors.password }</span>
                                        </FormGroup>
                                        <FormGroup row>
                                                <Label htmlFor="confirmpassword" className="col-12">Confirm Password</Label>
                                                <Input type="password" className="login-input-box" id="confirmpassword" name="confirmpassword" 
                                                        placeholder="Confirm Password" autoComplete="off" required value={this.state.confirmpassword} 
                                                        onChange={this.handleInputChange} />
                                                <span className="col-12 error">{ this.state.errors.confirmpassword }</span>
                                        </FormGroup>
                                        <FormGroup row className="mt-4">
                                                <Label htmlFor="logintype" className="col-4">Type</Label>
                                                <Input className="col-8 ml-auto" type="select" id="logintype" name="logintype" required 
                                                        value={this.state.logintype} onChange={this.handleInputChange} >
                                                    <i className="fas fa-chevron-down"></i>
                                                    <option>user</option>
                                                    <option>doctor</option>
                                                </Input>
                                        </FormGroup>
                                        <FormGroup row className="justify-content-center mt-4">
                                            <div className="col-5">
                                                <Input type="submit" value="Sign up" className="btn login-submit-btn mb-3" />
                                            </div>
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