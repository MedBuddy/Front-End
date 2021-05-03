import React, { Component } from 'react'
import Header from './HeaderComponent'
import { Card,CardBody,CardTitle,CardText } from 'reactstrap'
import '../styles/home.css'

class Home extends Component {
    
    render(){
        return (
            <>
                <Header />
                <div className="container">

                    <div className="row mt-3">

                        <div className="col-12 col-md-8 home-style-1">
                            <q> HEALTH is WEALTH </q>
                        </div>

                        <div className="col-12 col-md-3 offset-1">

                            <div className="row home-style-2-bg">
                                    <div className="col-3">
                                        <img src="/images/medbuddy_icon.png" alt="MedBuddy" width="55" height="50" />
                                    </div>
                                    <div className="col-9 home-style-2">MedBuddy</div>
                            </div>

                            <div className="row justify-content-center">
                                <div className="col-12 home-style-3">
                                    Your buddy for health
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="row align-items-center">
                        <div className="col-12 col-md-6">
                            <img src="/images/doctors.png" alt="doctors" />
                        </div>
                        <div className="col-12 offset-md-1 col-md-5 home-style-4">                            
                            Remember when we were going to 
                            hospitals for each & every minor problems 
                            we had? Well...that’s a long time ago.🤒
                            Let’s dive into something which brings
                            the goodness of healthcare and technology 
                            into our hands😉
                        </div>
                    </div>

                    <div className="row justify-content-center mt-md-4 mb-md-5">
                        <div className="col-12 col-md-3 offset-md-1 mt-4">
                            <Card className="home-card">
                                <CardBody>
                                    <CardTitle className="home-style-5">1.5 M+</CardTitle>
                                    <CardText className="home-style-8">Online consultations</CardText>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-12 col-md-3 offset-md-1 mt-4">
                            <Card className="home-card">
                                <CardBody>
                                    <CardTitle className="home-style-6">4+ ★ rated Doctors</CardTitle>
                                    <CardText className="home-style-8">In every specialization</CardText>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-12 col-md-3 offset-md-1 mt-4">
                            <Card className="home-card">
                                <CardBody>
                                    <CardTitle className="home-style-7">User’s 1st choice</CardTitle>
                                    <CardText className="home-style-8">When it comes to health</CardText>
                                </CardBody>
                            </Card>
                        </div>
                    </div>

                </div>
                
            </>
        )
    }
}

export default Home