import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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
            formtype: 'login',
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
            step: 1,
            otp: '',
            otpError: '',
            userId: '',
            loginPageMsg: '',
            license: '',
            fileError: '',
            viewFileInput: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.changeForm = this.changeForm.bind(this);
        this.showPassword = this.showPassword.bind(this);
        this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
        this.changeStep = this.changeStep.bind(this);
        this.next = this.next.bind(this);
        this.handleOTP = this.handleOTP.bind(this);
        this.handleFileInput = this.handleFileInput.bind(this)
        this.handleFileSubmit = this.handleFileSubmit.bind(this)
    }
    componentDidMount()
    {
        if(localStorage.getItem('userToken'))
            window.location.href = "/";
    }
    getType(type){
        switch(type){
            case 'user': return 1
            case 'doctor': return 2
            case 'admin': return 3
            default: return 0
        }
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        
        this.setState({
          [name]: value
        });
    }

    handleFileInput(event){
        const file = event.target.files[0]
        console.log(file)
        this.setState({
            license: file
        })
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
        if(!userRegex.test(this.state.username)){
            errors.username = 'Invalid Username'
            this.setState({
                errors: errors
            })
        }
        else if(!passRegex.test(this.state.password)){
            errors.password = 'Invalid Password'
            this.setState({
                errors: errors
            })
        }
        else{
            const user = {
                userId: this.state.username,
                password: this.state.password,
                type: this.getType(this.state.logintype)
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
                if(response.resCode === -1){
                    errors.username = response.msg
                    this.setState({
                        errors: errors
                    })
                }
                else if(response.resCode === 0){
                    errors.password = response.msg
                    this.setState({
                        errors: errors
                    })
                }
                else{
                    localStorage.setItem('userToken', response.token)
                    localStorage.setItem('username', response.username)
                    window.location.href = '/'
                }
            })
            .catch(error => {
                console.log(error)
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
            step: 1,
            loginPageMsg: ''
        });
        document.getElementById('showpassword').checked = false
        document.getElementById('password').type="password"
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
        
        if(errors.password === '' && errors.confirmpassword === ''){
            const user = {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
                type: this.getType(this.state.logintype)
            }
            console.log(user)
            fetch('account/signup', {
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
                let step = 3
                let userId = ''
                if(response.resCode === 0){
                    errors.email = response.msg
                    step = 1
                }
                else if(response.resCode === -1){
                    errors.username = response.msg
                    step = 1
                }
                else{
                    step = 3
                    userId = response.msg
                }
                this.setState({
                    step: step,
                    errors: errors,
                    userId: userId
                })
            })
            .catch(error => {
                console.log(error)
            })
        }
        else{
            this.setState({
                errors: errors
            })
        }
    }

    changeStep(step){
        this.setState({
            step: step
        })
    }

    next(){
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
        if(errors.username === '' && errors.email === '')
            this.changeStep(2)
        else{
            this.setState({
                errors: errors
            })
        }
    }

    handleOTP(event){
        const otpRegex = /^[0-9]{6}$/
        if(!otpRegex.test(this.state.otp)){
            this.setState({
                otpError: 'Invalid OTP'
            })
        }
        else{
            const req = {
                userId: this.state.userId,
                otp: this.state.otp,
                type: this.getType(this.state.logintype)
            }
            fetch('account/otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
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
                if(response.resCode === 0){
                    this.setState({
                        otpError: 'Invalid OTP'
                    })
                }
                else{
                    if(req.type === 1){
                        this.changeForm('login')
                        this.setState({
                            loginPageMsg: 'Account created successfully!',
                            userId: '',
                            otpError: ''
                        })
                    }
                    else{
                        this.setState({
                            otpError: '',
                            loginPageMsg: 'OTP verified!',
                            viewFileInput: true
                        })
                    }
                }
            })
            .catch(error => {
                console.log(error)
            })
        }
        event.preventDefault()
    }

    handleFileSubmit(){
        if(this.state.license === ''){
            this.setState({
                fileError: 'No file selected!'
            })
            return
        }
        let req = new FormData()
        req.append('userId', this.state.userId)
        req.append('license', this.state.license)
        fetch('doctors/license', {
            method: 'POST',
            body: req
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
        .then(response => {
            this.changeForm('login')
            this.setState({
                loginPageMsg: 'Doctor account created! You will be notified as soon as your license is verified',
                userId: ''
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    displayStepper(){
        if(this.state.step === 1)
        {
            return (
                <div className="container mt-3">
                    <div className="row justify-content-center">
                        <div className="signup-completed-steps">1</div>
                        <div className="align-self-center">
                            <div className="signup-line"></div>
                        </div>
                        <div className="signup-steps">2</div>
                        <div className="align-self-center">
                            <div className="signup-line"></div>
                        </div>
                        <div className="signup-steps">3</div>
                    </div>
                </div> 
            )
        }
        else if(this.state.step === 2)
        {
            return (
                <div className="container mt-3">
                    <div className="row justify-content-center">
                    <div className="signup-completed-steps"><i class="fa fa-check"></i></div>
                        <div className="align-self-center">
                            <div className="signup-completed-line"></div>
                        </div>
                        <div className="signup-completed-steps">2</div>
                        <div className="align-self-center">
                            <div className="signup-line"></div>
                        </div>
                        <div className="signup-steps">3</div>
                    </div>
                </div> 
            )
        }
        else
        {
            return (
                <div className="container mt-3">
                    <div className="row justify-content-center">
                    <div className="signup-completed-steps"><i class="fa fa-check"></i></div>
                        <div className="align-self-center">
                            <div className="signup-completed-line"></div>
                        </div>
                        <div className="signup-completed-steps"><i class="fa fa-check"></i></div>
                        <div className="align-self-center">
                            <div className="signup-completed-line"></div>
                        </div>
                        <div className="signup-completed-steps">3</div>
                    </div>
                </div> 
            )
        }
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
                        <Label htmlFor="s-username" className="col-12">Username</Label>
                        <Input type="text" className="login-input-box" id="s-username" name="username" 
                                placeholder="Username" autoComplete="off" value={this.state.username} 
                                onChange={this.handleInputChange} />
                        <span className="col-12 error">{ this.state.errors.username }</span>
                    </FormGroup>
                    <FormGroup row className="mt-4">
                        <Label htmlFor="signuptype" className="col-4">Type</Label>
                        <Input className="col-8 ml-auto" type="select" id="signuptype" name="logintype" 
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
                        <Label htmlFor="s-password" className="col-12">Password</Label>
                        <Input type="password" className="login-input-box" id="s-password" name="password" 
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
        else if(this.state.step === 3){
            return (
                <div className="signup-form-content">
                    <div className="row mb-3">
                        <div className="col text-center">
                            <b>Enter the otp sent to the registered email to activate your account</b>
                        </div>
                    </div>
                    <Form id="otp-form" onSubmit={this.handleOTP}>
                        <FormGroup row className="mb-0">
                            <Input type="text" className="login-input-box col-6 offset-3" id="otp" name="otp" 
                                    placeholder="OTP" autoComplete="off" value={this.state.otp} 
                                    onChange={this.handleInputChange} />
                            <span className="col-12 error text-center">{ this.state.otpError }</span>
                            <span className="col-12 text-center login-page-msg">{ this.state.loginPageMsg }</span>
                        </FormGroup>
                        <FormGroup row className="justify-content-center">
                            <div className="col-4">
                                <Button type="submit"  className={this.state.viewFileInput?"btn-disabled":"btn login-btns"} 
                                        form="otp-form" onClick={this.handleOTP} disabled={this.state.viewFileInput}>
                                    Activate
                                </Button>
                            </div>
                        </FormGroup>
                    </Form>
                    <div style={{display: this.state.viewFileInput?'block':'none'}}>
                        <FormGroup row className="mb-0">
                            <div className="col-12 text-center">
                                <b>Upload your Legal Medical License to use the Doctor account</b>
                            </div>
                            <Label htmlFor="license" className="license-upload">
                                {(this.state.license === '')? 'Choose file':'File choosen!'}
                            </Label>
                            <div className="col-12 text-center">{ this.state.license.name }</div>
                            <Input type="file" id="license" name="license" onChange={this.handleFileInput} hidden />
                            <span className="col-12 error text-center">{ this.state.fileError }</span>
                        </FormGroup>
                        <FormGroup row className="justify-content-center">
                            <div className="col-4">
                                <Button className="btn login-btns" onClick={this.handleFileSubmit}>Submit</Button>
                            </div>
                        </FormGroup>
                    </div>
                </div>
            )
        }
    }

    displaySignupButtons(){
        if(this.state.step === 3)
            return <></>
        return (
            <FormGroup row className="justify-content-center mt-4">
                <div className="col-3">
                    <Button className={this.state.step === 2?"btn login-btns":"btn-disabled"} 
                            disabled={this.state.step !== 2} onClick={() => this.changeStep(1)}>
                        <i class="fa fa-arrow-left"></i>
                    </Button>
                </div>
                <div className="col-5">
                    <Input type="submit" value="Sign up" className={this.state.step === 2?"btn login-btns":"btn-disabled"} 
                            disabled={this.state.step !== 2} form="signup-form" />
                </div>
                <div className="col-3">
                    <Button className={this.state.step === 1?"btn login-btns":"btn-disabled"} 
                            disabled={this.state.step !== 1} onClick={this.next}>
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
                <div className="row">
                    <div className="col-12 text-center">
                        { this.state.loginPageMsg }
                    </div>
                </div>
            </Form>
        )
    }

    render(){
        return (
            <>
                <div className="container">
                    <Link to="/" className="login-icon-link">
                        <div className="row login-style-1-bg mt-3">
                            <div className="col-3">
                                <img src="/images/medbuddy_icon.png" alt="MedBuddy" width="55" height="50" />
                            </div>
                            <div className="col-9 login-style-1">MedBuddy</div>
                        </div>
                    </Link>
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
                                    <Form className="mt-3 login-form-padding" id="signup-form" onSubmit={this.handleSignupSubmit}>
                                        { this.signupForm() }
                                        { this.displaySignupButtons() }
                                    </Form>
                                </TabPane>
                            </TabContent>
                        </div>
                        <div className="col-4 justify-content-center">
                            <img src="/images/login-right.svg" alt="login-rightimg" width="304" height="281" />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Login