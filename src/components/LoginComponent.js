import React, { Component } from 'react'
import { Form,FormGroup,Label,Input } from 'reactstrap'
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
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        
        this.setState({
          [name]: value
        });
    }
    handleLogin(event) {
        alert('Current State is: ' + JSON.stringify(this.state));
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

                    <div className="row justify-content-center mt-3">
                        
                        <Form className="login-form-bg" onSubmit={this.handleLogin}>
                            <FormGroup row className="justify-content-center mt-2">
                                <img src="/images/medbuddy_icon.png" alt="MedBuddy" width="116" height="107" />
                            </FormGroup>
                            <FormGroup row>
                                    <Label htmlFor="username">Username</Label>
                                    <Input type="text" className="login-input-box" id="username" name="username" placeholder="Username" autoComplete="off" required value={this.state.username} onChange={this.handleInputChange} />
                            </FormGroup>
                            <FormGroup row>
                                    <Label htmlFor="Password">Password</Label>
                                    <Input type="password" className="login-input-box" id="password" name="password" placeholder="Password" autoComplete="off" required value={this.state.password} onChange={this.handleInputChange} />
                            </FormGroup>
                            <FormGroup row className="mt-4">
                                    <Label htmlFor="logintype">Login as</Label>
                                    <Input className="col-8 ml-auto" type="select" id="logintype" name="logintype" required value={this.state.logintype} onChange={this.handleInputChange} >
                                        <i className="fas fa-chevron-down"></i>
                                        <option>user</option>
                                        <option>doctor</option>
                                        <option>admin</option>
                                    </Input>
                            </FormGroup>
                            <FormGroup row className="justify-content-center mt-4">
                                <Input type="submit" value="Login" className="login-submit-btn" />
                            </FormGroup>
                            <FormGroup row className="justify-content-center">
                                <Label>New User? </Label>
                                <a href="" className="ml-2">Sign Up</a>
                            </FormGroup>
                        </Form>
                    </div>

                </div>
                <div className="footer mt-4">
                    <div className="row">
                        <div className="col-4">
                            <div class="text-center">
                                <a class="btn btn-social-icon btn-facebook" href="http://www.facebook.com/profile.php?id="><i className="fa fa-facebook fa-lg"></i></a>
                                <a class="btn btn-social-icon" href="http://www.instagram.com"><i className="fa fa-instagram fa-lg instagramcss"></i></a>
                                <a class="btn btn-social-icon btn-twitter" href="http://twitter.com/"><i className="fa fa-twitter fa-lg"></i></a>            
                            </div>
                        </div>
                        <div className="col-3 offset-1 login-copyright">
                            Copyrights © 2021 MedBuddy
                        </div>
                        <div className="col-4">
                            <div class="text-center">
                                <a class="btn btn-social-icon btn-linkedin" href="http://www.linkedin.com/in/"><i className="fa fa-linkedin fa-lg"></i></a>
                                <a class="btn btn-social-icon" href="mailto:"><i className="fa fa-envelope-o text-danger bg-light"></i></a>
                                <a class="btn btn-social-icon" href="http://wa.me/123456789"><i className="fa fa-whatsapp fa-lg whatsappcss"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Login