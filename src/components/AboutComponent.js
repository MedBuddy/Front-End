import React, { Component } from 'react'
import { Card,CardBody,CardTitle,CardText,Form,Input,Label} from 'reactstrap'
import Header from './HeaderComponent'
import  '../styles/about.css'

class About extends Component {
    render(){
        return (
            <>
                <Header />
                <div className="container pt-3 about-container1">
                    <div className="row">
                        <div className="col-3 first-card">
                    <div className="row">
                        <Card className="about-card">
                                <CardBody>
                                    <CardTitle className="about-card-title"><img src="/images/running.png" className="about-photo" alt="MedBuddy"/></CardTitle>
                                    <CardText className="about-card-text">
                                        <p>Aanandan T.Ma</p>
                                        <ul className="about-list"><li>Back-End Developer</li></ul>
                                    </CardText>
                                </CardBody>
                        </Card>
                    </div>
                    <div className="row">
                        <img src="/images/aboutImage2.svg" alt="MedBuddy" className="about-image2"/>
                    </div>
                        </div>
                        <div className="col-3 offset-1 second-card">
                        <Card className="about-card">
                                <CardBody>
                                    <CardTitle className="about-card-title"><img src="/images/running.png" className="about-photo" alt="MedBuddy"/></CardTitle>
                                    <CardText className="about-card-text">
                                        <p>Prasanth S</p>
                                        <ul className="about-list"><li>Front-End Developer</li></ul>
                                    </CardText>
                                </CardBody>
                        </Card>
                        </div>
                        <div className="col-3">
                            <div className="row">
                            <img src="/images/aboutImage1.svg" alt="MedBuddy" className="about-image1"/>
                            </div>
                            <div className="row">
                                <div className="col-6 third-card">
                                <Card className="about-card">
                                <CardBody>
                                    <CardTitle className="about-card-title"><img src="/images/running.png" className="about-photo" alt="MedBuddy"/></CardTitle>
                                    <CardText className="about-card-text">
                                        <p>Vijay K</p>
                                        <ul className="about-list"><li>Enna sollalam?</li></ul>
                                    </CardText>
                                </CardBody>
                                </Card>
                                </div> 
                            </div>
                        </div> 
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-4 offset-4">
                            <img src="/images/aboutImage3.svg" alt="MedBuddy" className="about-image3"/>
                        </div>
                    </div>
                </div>
                <div className="container pb-5 about-container2">
                    <div className="row pl-3">
                        <div className="col-4 offset-4">
                            <p className="about-heading">Contact Us...</p>
                        </div>
                    </div>
                    <div className="row">
                            <div className="col-2">
                                <div className="row">
                                    <Form>
                                        <Label className="about-label1">Your Name</Label>
                                    </Form>
                                </div>
                                <div class="row pt-3">
                                    <Form>
                                        <Label className="about-label2">Feedback /Comments</Label>
                                    </Form>
                                </div>
                            </div>
                            <div className="col-5">
                                <div className="row">
                                    <div className="col-7">
                                        <Form>
                                            <Input type="Text" className="about-input1" name="username"/>
                                        </Form>
                                    </div>
                                </div>
                                <div className="row pt-3">
                                    <div className="col-12">
                                        <Form>
                                            <Input type="Textarea" className="about-input2" name="feedback"/>
                                        </Form>
                                    </div>
                                </div>
                                <div className="row pt-4">
                                    <div class="col-4 offset-4">
                                        <Form>
                                            <Input type="submit" value="Submit" name="about-submit" className="about-submit-button"/>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-5">
                                <img src="/images/aboutImage4.svg" alt="MedBuddy" class="about-image4"/>
                            </div>
                    </div>
                </div>
            </>
        )
    }
}

export default About