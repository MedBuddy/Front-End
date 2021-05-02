import React, { Component } from 'react'
import { Card, CardImg, CardBody, CardTitle, CardText, CardFooter, CardLink, Form, FormGroup, Input, Label} from 'reactstrap'
import Header from './HeaderComponent'
import  '../styles/about.css'

const developers = [
    {
        name: 'Aanandan T Ma',
        image: '/images/aanandan.jpg',
        contributions: ['react', 'mongodb', 'node', 'javascript'],
        links: [
                'https://github.com/Aanandan-T-Ma', 
                'https://www.linkedin.com/in/aanandan-t-ma-177086190/', 
                'https://www.instagram.com/aanandan_tma/'
            ],
        mailid: 'aanandan.tma@gmail.com'
    },
    {
        name: 'Prasanth S',
        image: '/images/prasanth.jpg',
        contributions: ['react', 'html', 'css', 'javascript'],
        links: [
                'https://github.com/sprasanth2k', 
                'https://www.linkedin.com/in/prasanth-s-a37842190/', 
                'https://www.instagram.com/__prasanth__senthil_kumar/'
            ],
        mailid: 'sprasanth2k@gmail.com'
    },
    {
        name: 'Vijay K',
        image: '/images/vijay.jpg',
        contributions: ['react', 'html', 'css', 'javascript'],
        links: [
                'https://github.com/Vijay-K06', 
                '', 
                'https://www.instagram.com/vijay.k_tvm/'
            ],
        mailid: 'kvijay.tvm01@gmail.com'
    }
]

const sites = ['github', 'linkedin', 'instagram']

class About extends Component {

    renderDevCards(){
        const cards = developers.map((dev, i) => {

            const contributions = dev.contributions.map(cont => (
                <img src={ "/images/" + cont + ".png" } alt={ cont + "-icon" } />
            ))

            const links = dev.links.map((link, j) => (
                <CardLink className="about-card-link" href={link} target="_blank">
                    <img src={ "/images/" + sites[j] + ".png" } alt={ sites[j] + "-icon" } />
                </CardLink>
            ))

            return (
                <div className={"col-4 d-flex justify-content-center dev-card-"+(i+1)}>
                    <Card className="about-card">
                            <CardImg src={dev.image} className="about-photo" alt="MedBuddy"/>
                            <CardBody>
                                <CardTitle className="about-card-title">{ dev.name }</CardTitle>
                                <CardText className="about-card-text">
                                    <div className="dev-description">
                                        <div className="dev-skills">
                                            <div>Contributions</div>
                                            { contributions }
                                        </div>
                                    </div>
                                </CardText>
                            </CardBody>
                            <CardFooter className="about-card-footer d-flex justify-content-center">
                                { links }
                                <CardLink className="about-card-link" href={"mailto:"+dev.mailid}>
                                    <img src="/images/gmail.png" alt="gmail-icon" />
                                </CardLink>
                            </CardFooter>
                    </Card>
                </div>
            )
        })
        return (
            <div className="row">
                { cards }
            </div>
        )
    }

    renderContactForm(){
        return (
            <Form>
                <FormGroup row>
                        <Label htmlFor="name" className="col-4 about-label">Your Name</Label>
                        <Input type="text" className="col-6" id="name" name="name" autoComplete="off" required
                                innerRef={(input) => this.name = input} />
                </FormGroup>
                <FormGroup row>
                        <Label htmlFor="feedback" className="col-4 about-label">Feedback / Comments</Label>
                        <Input type="textarea" style={{ resize: 'none' }} className="col-8" id="feedback" name="feedback" 
                               rows="5" autoComplete="off" required innerRef={(input) => this.feedback = input} />
                </FormGroup>
                <FormGroup row className="justify-content-center mt-4">
                    <div className="col-4 offset-4">
                        <Input type="submit" value="Submit" className="btn about-submit-button" />
                    </div>
                </FormGroup>
            </Form>
        )
    }

    render(){
        return (
            <>
                <Header />
                <div className="bottom-left-img">
                    <img src="/images/aboutImage2.svg" alt="MedBuddy" className="about-image2"/>
                </div>
                <div className="top-right-img">
                    <img src="/images/aboutImage1.svg" alt="MedBuddy" className="about-image1"/>
                </div>
                <div className="container mt-5 about-container">
                    { this.renderDevCards() }
                </div>
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-4 offset-4">
                            <img src="/images/aboutImage3.svg" alt="MedBuddy" className="about-image3"/>
                        </div>
                    </div>
                </div>
                <div className="container mb-5 about-container">
                    <div className="row pl-3">
                        <div className="col-4 offset-4">
                            <p className="about-heading text-center">Contact Us...</p>
                        </div>
                    </div>
                    <div className="row">
                            <div className="col-7">
                                { this.renderContactForm() }
                            </div>
                            <div className="col-5 d-flex justify-content-center">
                                <img src="/images/aboutImage4.svg" alt="MedBuddy" class="about-image4"/>
                            </div>
                    </div>
                </div>
            </>
        )
    }
}

export default About