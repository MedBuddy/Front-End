import React, { Component } from 'react'
import { Form,FormGroup,Label,Input,Nav,NavItem,TabContent,TabPane,Button } from 'reactstrap'
import '../styles/login.css'

const emailRegex = [
    {
        regex: /.+/,
        error: 'Email is required'
    },
    {
        regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        error: 'Invalid Email'
    }
]
const usernameRegex = [
    {
        regex: /.+/,
        error: 'Username is required'
    },
    {
        regex: /^[a-zA-Z].*$/,
        error: 'Username should start with a letter'
    },
    {
        regex: /^.{8,}$/,
        error: 'Username should contain atleast 8 characters'
    },
    {
        regex: /^[a-zA-Z0-9_]*$/,
        error: 'Username should contain only letters, numbers and underscore(_)'
    }
]
const passwordRegex = [
    {
        regex: /.+/,
        error: 'Password is required'
    },
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
            },
            step: 1
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.changeForm = this.changeForm.bind(this);
        this.showPassword = this.showPassword.bind(this);
        this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
        this.changeStep = this.changeStep.bind(this);
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        
        this.setState({
          [name]: value
        });
    }
    handleLoginSubmit(event) {
        const userRegex = /^[a-zA-Z][a-zA-Z0-9]{7,}$/
        const passRegex = /^[a-zA-Z0-9_@#$&]{8,}$/
        let errors = {
            username: '',
            password: '',
            email: '',
            confirmpassword: ''
        }
        if(!userRegex.test(this.state.username))
            errors.username = 'Invalid Username'
        else if(!passRegex.test(this.state.password))
            errors.password = 'Invalid Password'
        else{
            let type
            switch(this.state.logintype){
                case 'user': type = 1; break;
                case 'doctor': type = 2; break;
                case 'admin': type = 3; break;
                default: break;
            }
            const user = {
                userId: this.state.username,
                password: this.state.password,
                type: type
            }
            fetch('account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => {
                if(response.ok)
                    return response
                else{
                    let error = new Error('Error: ' + response.status + ': ' + response.statusText)
                    error.response = response
                    throw error
                }
            }, err => {
                let error = new Error(err)
                throw error
            })
            .then(response => response.json())
            .then(response => {
                if(response.resCode === -1)
                    errors.username = response.msg
                else if(response.resCode === 0)
                    errors.password = response.msg
                else{
                    localStorage.setItem('userToken', response.token)
                    localStorage.setItem('username', response.username)
                    window.location.href = '/'
                }
            })
        }
        event.preventDefault()
    }
    changeForm(form) {
        if(form === this.state.formtype)
            return
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
            errors: errors,
            step:1
        });
        document.getElementById('showpassword').checked=false
    }
    showPassword(event)
    {
        if(event.target.checked)
            document.getElementById('password').type="text"
        else
            document.getElementById('password').type="password"
        
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
        if(this.state.confirmpassword === '')
            errors.confirmpassword = 'Password is required'
        else if(this.state.confirmpassword !== this.state.password)
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

    changeStep(step){
        this.setState({
            step: step
        })
    }

    displayStepper(){
        return (
            <div className="container mt-3">
                <div className="row justify-content-center">
                    <div className={(this.state.step>=1)?"signup-completed-steps":"signup-steps"}>1</div>
                    <div className="align-self-center">
                        <div className={(this.state.step>=2)?"signup-completed-line":"signup-line"}></div>
                    </div>
                    <div className={(this.state.step>=2)?"signup-completed-steps":"signup-steps"}>2</div>
                    <div className="align-self-center">
                        <div className={(this.state.step>=3)?"signup-completed-line":"signup-line"}></div>
                    </div>
                    <div className={(this.state.step>=3)?"signup-completed-steps":"signup-steps"}>3</div>
                </div>
            </div> 
        )
    }

    signupForm(){
        if(this.state.step === 1)
        {
            return (
                <div className="signup-form-content">
                    <FormGroup row>
                        <Label htmlFor="email" className="col-12">Email Address</Label>
                        <Input type="text" className="login-input-box col-12" id="email" name="email" 
                                placeholder="Email" autoComplete="off" value={this.state.email} 
                                onChange={this.handleInputChange} />
                        <span className="col-12 error">{ this.state.errors.email }</span>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="username" className="col-12">Username</Label>
                        <Input type="text" className="login-input-box" id="username" name="username" 
                                placeholder="Username" autoComplete="off" value={this.state.username} 
                                onChange={this.handleInputChange} />
                        <span className="col-12 error">{ this.state.errors.username }</span>
                    </FormGroup>
                    <FormGroup row className="mt-4">
                        <Label htmlFor="logintype" className="col-4">Type</Label>
                        <Input className="col-8 ml-auto" type="select" id="logintype" name="logintype" 
                                value={this.state.logintype} onChange={this.handleInputChange} >
                            <i className="fas fa-chevron-down"></i>
                            <option>user</option>
                            <option>doctor</option>
                        </Input>
                    </FormGroup>
                </div>
            )
        }
        else if(this.state.step === 2)
        {
            return(
                <div className="signup-form-content">
                    <FormGroup row>
                        <Label htmlFor="password" className="col-12">Password</Label>
                        <Input type="password" className="login-input-box" id="password" name="password" 
                                placeholder="Password" autoComplete="off" value={this.state.password} 
                                onChange={this.handleInputChange} />
                        <span className="col-12 error">{ this.state.errors.password }</span>
                    </FormGroup>
                    <FormGroup row>
                        <Label htmlFor="confirmpassword" className="col-12">Confirm Password</Label>
                        <Input type="password" className="login-input-box" id="confirmpassword" name="confirmpassword" 
                                placeholder="Confirm Password" autoComplete="off" value={this.state.confirmpassword} 
                                onChange={this.handleInputChange} />
                        <span className="col-12 error">{ this.state.errors.confirmpassword }</span>
                    </FormGroup>        
                </div>
            )
        }
    }

    displaySignupButton(){
        return (
            <FormGroup row className="justify-content-center mt-4">
                <div className="col-3">
                    <Button className={this.state.step !== 1?"btn login-btns":"btn-disabled"} 
                            disabled={this.state.step === 1} onClick={() => this.changeStep(1)}>
                        <i class="fa fa-arrow-left"></i>
                    </Button>
                </div>
                <div className="col-5">
                    <Input type="submit" value="Sign up" className={this.state.step !== 1?"btn login-btns":"btn-disabled"} 
                            disabled={this.state.step === 1} />
                </div>
                <div className="col-3">
                    <Button className={this.state.step === 1?"btn login-btns":"btn-disabled"} 
                            disabled={this.state.step !== 1} onClick={() => this.changeStep(2)}>
                        <i class="fa fa-arrow-right"></i>
                    </Button>
                </div>
            </FormGroup>
        )
    }

    loginForm(){
        return (
            <Form className="mt-3 login-form-padding signup-form-content" onSubmit={this.handleLoginSubmit}>
                <FormGroup row>
                        <Label htmlFor="username" className="col-12">Username</Label>
                        <Input type="text" className="login-input-box col-12" id="username" name="username" 
                                placeholder="Username" autoComplete="off" value={this.state.username} 
                                onChange={this.handleInputChange} />
                        <span className="col-12 error">{ this.state.errors.username }</span>
                </FormGroup>
                <FormGroup row>
                        <Label htmlFor="password" className="col-12">Password</Label>
                        <Input type="password" className="login-input-box col-12" id="password" name="password" 
                                placeholder="Password" autoComplete="off" value={this.state.password} 
                                onChange={this.handleInputChange} />
                        <span className="col-12 error">{ this.state.errors.password }</span>
                </FormGroup>
                <FormGroup row>
                    <Input type="checkbox" id="showpassword" className="ml-1" onClick={this.showPassword} />
                    <Label htmlFor="showpassword" className="ml-4"> Show Password</Label>
                </FormGroup>
                <FormGroup row className="mt-2">
                    <Label htmlFor="logintype" className="col-4">Login as</Label>
                    <Input className="col-8" type="select" id="logintype" name="logintype" 
                            value={this.state.logintype} onChange={this.handleInputChange}>
                        <i className="fas fa-chevron-down"></i>
                        <option>user</option>
                        <option>doctor</option>
                        <option>admin</option>
                    </Input>
                </FormGroup>
                <FormGroup row className="justify-content-center mt-4">
                    <div className="col-5">
                        <Input type="submit" value="Login" className="btn login-btns mb-3" />
                    </div>
                </FormGroup>
            </Form>
        )
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
                                <TabPane tabId='login' className="login-form-height">
                                    { this.loginForm() }
                                </TabPane>
                                <TabPane tabId='signup' className="login-form-height">
                                    {this.displayStepper() }
                                    <Form className="mt-3 login-form-padding" onSubmit={this.handleSignupSubmit}>
                                        { this.signupForm() }
                                        { this.displaySignupButton() }
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