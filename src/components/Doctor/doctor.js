import React, { Component } from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'
import Header from '../Header/header'
import './doctor.css'
import { Link } from 'react-router-dom'
import Chat from '../Chat/chat'
import ReactStars from 'react-rating-stars-component'

class Doctor extends Component {

    constructor(props){
        super(props)
        this.state = {
            doctor: '',
            reviews: [],
            chatDisplay: false,
            rating: 0,
            myreview: false
        }
        this.fetchDoctorInfo = this.fetchDoctorInfo.bind(this)
        this.fetchReviews = this.fetchReviews.bind(this)
        this.toggleChat = this.toggleChat.bind(this)
        this.changeRating = this.changeRating.bind(this)
        this.postReview = this.postReview.bind(this)
    }

    componentDidMount(){
        this.checkLogin()
        this.fetchDoctorInfo()
        this.fetchReviews()
    }

    checkLogin(){
        const userToken = localStorage.getItem('userToken');
        if(!userToken)
            window.location.href = '/login';
    }

    toggleChat(display){
        this.setState({
            chatDisplay: display
        })
    }

    fetchDoctorInfo(){
        let token = localStorage.getItem('userToken')
        fetch('/doctors/'+this.props.id, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            if(response.ok)
                return response
            else
            {
                let error = new Error('Error: ' + response.status + ': ' + response.statusText)
                error.response = response
                throw error
            }
        }, err => {
            let error = new Error(err)
            throw error
        })
        .then((response) => response.json())
        .then((response) => {
            this.setState({
                doctor: response
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    fetchReviews(){
        let token = localStorage.getItem('userToken')
        fetch('/doctors/'+this.props.id+'/reviews', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => {
            if(response.ok)
                return response
            else
            {
                let error = new Error('Error: ' + response.status + ': ' + response.statusText)
                error.response = response
                throw error
            }
        }, err => {
            let error = new Error(err)
            throw error
        })
        .then((response) => response.json())
        .then((response) => {
            this.setState({
                reviews: response
            }, () => {
                let username = localStorage.getItem('username')
                this.state.reviews.forEach(review => {
                    if(review.userId.username === username){
                        this.setState({
                            myreview: true
                        })
                    }
                })
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    postReview(event){
        event.preventDefault()
        const review = {
            rating: this.state.rating,
            comment: this.comment.value
        }
        let token = localStorage.getItem('userToken')
        fetch('/doctors/'+this.props.id+'/reviews', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        })
        .then((response) => {
            if(response.ok)
                return response
            else
            {
                let error = new Error('Error: ' + response.status + ': ' + response.statusText)
                error.response = response
                throw error
            }
        }, err => {
            let error = new Error(err)
            throw error
        })
        .then((response) => response.json())
        .then((response) => {
            if(response.resCode === 1){
                let reviews = this.state.reviews
                reviews.splice(0, 0, response.review)
                this.setState({
                    reviews: reviews,
                    myreview: true
                })
                console.log(reviews)
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    renderDoctorInfo(){
        let doctor = this.state.doctor
        if(doctor){
            let dob = new Date(doctor.dob)
            return (
                <div className="container doctor-container p-2 pl-3 mt-4">
                    <div className="row align-items-center">
                        <div className="col-2">
                            <img src={doctor.image.url} alt={doctor.username} className="doctor-img" />
                        </div>
                        <div className="col-6 mt-3 doctor-info">
                            <div className="row">
                                <div className="col-4 doctor-field">Name</div>
                                <div className="col doctor-value">{doctor.firstname + ' ' + doctor.lastname}</div>
                            </div>
                            <div className="row">
                                <div className="col-4 doctor-field">Specialization</div>
                                <div className="col doctor-value">{doctor.specialization}</div>
                            </div>
                            <div className="row">
                                <div className="col-4 doctor-field">DOB</div>
                                <div className="col doctor-value">{dob.getDate()+'-'+(dob.getMonth()+1)+'-'+dob.getFullYear()}</div>
                            </div>
                            <div className="row">
                                <div className="col-4 doctor-field">Mobile</div>
                                <div className="col doctor-value">{doctor.mobile}</div>
                            </div>
                            <div className="row">
                                <div className="col-4 doctor-field">Email</div>
                                <div className="col doctor-value">{doctor.email}</div>
                            </div>
                            <div className="row">
                                <div className="col-4 doctor-field">Hospital</div>
                                <div className="col doctor-value">{doctor.hospital}</div>
                            </div>
                        </div>
                        <div className="col-4">
                            <iframe src={doctor.license} title={doctor.license} width="100%" height="250px"></iframe>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 offset-3">
                            <Button color="primary" className="btn" onClick={() => this.toggleChat(true)}>Chat</Button>
                            <Link to="/videoCall" target="_blank" className="btn btn-primary ml-5">Video Call</Link>
                        </div>
                    </div>
                </div>
            )
        }
        else{
            return (
                <></>
            )
        }
    }

    changeRating(rating){
        this.setState({
            rating: rating
        })
    }

    renderReviews(){
        let reviewsDiv = ''
        if(this.state.reviews.length){
            const reviews = this.state.reviews.map(review => (
                <div className="review-container col-6">
                    <div className="row">
                        <div className="col-3 d-flex flex-column align-items-center">
                            <div className="review-user-img">
                                <img src={review.userId.image.url} alt={review.userId.username} />
                            </div>
                            <div className="review-username">
                                { review.userId.username }
                            </div>
                        </div>
                        <div className="col">
                            <div className="review-rating">
                                <ReactStars value={review.rating} edit={false} size={30} />
                            </div>
                            <div className="review-comment">
                                { review.comment }
                            </div>
                        </div>
                    </div>
                </div>
            ))

            reviewsDiv = (
                <>
                    <div className="row">
                        <div className="col reviews-title">
                            Reviews
                        </div>
                    </div>
                    <div className="row p-3">
                        {reviews}
                    </div>
                </>
            )
        }

        return (
            <div className="container doctor-container p-2 pl-3 mt-4 mb-4">
                <div className={"review-form-container "+(this.state.myreview?"d-none":"")}>
                    <Form onSubmit={this.postReview}>
                        <div className="your-review-title">Your Review</div>
                        <FormGroup>
                            <ReactStars value={this.state.rating} size={30} onChange={this.changeRating} />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="comment">Comment</Label>
                            <Input type="textarea" rows="3" id="comment" name="comment" className="review-comment" 
                                    innerRef={(input) => this.comment = input} />
                        </FormGroup>
                        <FormGroup>
                            <Button color="primary" type="submit" className="btn">Submit</Button>
                        </FormGroup>
                    </Form>
                </div>
                <div className="container">
                    { reviewsDiv }
                </div>
            </div>
        )
    }

    render(){
        let chatComp = ''
        if(this.state.doctor){
            chatComp = 
                <Chat display={this.state.chatDisplay} closeChat={() => this.toggleChat(false)} sender={localStorage.getItem('username')}
                      doctor={this.state.doctor.username} user={localStorage.getItem('username')} />
        }
        return (
            <>
                <Header />
                { this.renderDoctorInfo() }
                { this.renderReviews() }
                { chatComp }
            </>
        )
    }
}

export default Doctor