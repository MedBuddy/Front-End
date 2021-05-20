import React, { Component } from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'
import Header from '../Header/header'
import './doctor.css'
import { Link } from 'react-router-dom'
import Chat from '../Chat/chat'
import ReactStars from 'react-rating-stars-component'
import { ScaleLoader } from 'react-spinners'

class Doctor extends Component {

    constructor(props){
        super(props)
        this.state = {
            doctor: '',
            reviews: [],
            chatDisplay: false,
            rating: 0,
            myreview: -1,
            editMode: false,
            loading: true
        }
        this.fetchDoctorInfo = this.fetchDoctorInfo.bind(this)
        this.fetchReviews = this.fetchReviews.bind(this)
        this.toggleChat = this.toggleChat.bind(this)
        this.changeRating = this.changeRating.bind(this)
        this.postReview = this.postReview.bind(this)
        this.deleteReview = this.deleteReview.bind(this)
        this.toggleEdit = this.toggleEdit.bind(this)
        this.editReview = this.editReview.bind(this)
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

    toggleEdit(){
        this.setState({
            editMode: !this.state.editMode,
            rating: this.state.reviews[this.state.myreview].rating
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
            setTimeout(() => {
                this.setState({
                    loading: false,
                });
              }, 200);
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
                reviews: response.reverse()
            }, () => {
                let username = localStorage.getItem('username')
                this.state.reviews.forEach((review, index) => {
                    if(review.userId.username === username){
                        this.setState({
                            myreview: index
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
                    myreview: 0,
                    rating: 0
                })
                this.comment.value = ''
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    editReview(event){
        event.preventDefault()
        const review = {
            rating: this.state.rating,
            comment: this.editcomment.value
        }
        let token = localStorage.getItem('userToken')
        fetch('/doctors/'+this.props.id+'/reviews/'+this.state.reviews[this.state.myreview]._id, {
            method: 'PUT',
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
            let reviews = this.state.reviews
            reviews[this.state.myreview] = response
            this.setState({
                reviews: reviews,
                rating: 0,
                editMode: false
            })
            this.editcomment.value = ''
        })
        .catch(error => { 
            console.log(error)
        })
    }

    deleteReview(){
        let token = localStorage.getItem('userToken')
        fetch('/doctors/'+this.props.id+'/reviews/'+this.state.reviews[this.state.myreview]._id, {
            method: 'DELETE',
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
        .then((response) => {
            let reviews = this.state.reviews
            reviews.splice(this.state.myreview, 1)
            this.setState({
                reviews: reviews,
                myreview: -1
            })
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
            const username = localStorage.getItem('username')
            const reviews = this.state.reviews.map((review, index) => {
                let d = new Date(Date.parse(review.createdAt))
                let hh = d.getHours()
                let mm = d.getMinutes()
                if(hh < 10) hh = '0' + hh
                if(mm < 10) mm = '0' + mm
                let time = hh + ':' + mm
                let signs = ''
                let review_content = (
                    <>
                        <div className="review-rating">
                            <ReactStars key={review._id} value={review.rating} edit={false} size={30} />
                        </div>
                        <div className="review-comment">
                            { review.comment }
                        </div>
                    </>
                )
                let date_time = (
                    <div className="review-date">
                        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(d)+' '+time}
                    </div>
                )
                if(review.userId.username === username){
                    if(this.state.editMode){
                        review_content = (
                            <>
                                <div className="review-rating">
                                    <ReactStars key={index} value={this.state.rating} size={30} onChange={this.changeRating} />
                                </div>
                                <div className="review-comment">
                                    <Form id="review-edit-form" onSubmit={this.editReview}>
                                        <Input type="textarea" rows="2" className="review-comment-edit" defaultValue={review.comment} 
                                            innerRef={(input) => this.editcomment = input} />
                                    </Form>
                                </div>
                                <div className="mt-2">
                                    <Button className="btn" color="info" type="submit" form="review-edit-form">Submit</Button>
                                </div>
                            </>
                        )
                        signs = (
                            <div className="float-right mr-2">
                                <span onClick={this.toggleEdit}>
                                    <i className="fa fa-times review-sign"></i>
                                </span>
                            </div>
                        )
                        date_time = ''
                    }
                    else{
                        signs = (
                            <div className="float-right">
                                <span className="pr-3" onClick={this.toggleEdit}>
                                    <i className="fa fa-edit fa-md review-sign"></i>
                                </span>
                                <span onClick={this.deleteReview}>
                                    <i className="fa fa-trash fa-md review-sign"></i>
                                </span>
                            </div>
                        )
                    }
                }
                return (
                    <div className="col-5 m-4">
                        <div className="review-container">
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
                                    { signs }
                                    { review_content }
                                    { date_time }
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })

            reviewsDiv = (
                <>
                    <div className="row">
                        <div className="col reviews-title">
                            Reviews
                        </div>
                    </div>
                    <div className="row p-3 justify-content-center">
                        {reviews}
                    </div>
                </>
            )
        }

        return (
            <div className="container doctor-container p-2 pl-3 mt-4 mb-4">
                <div className={"review-form-container "+(this.state.myreview > -1?"d-none":"")}>
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
        if(this.state.loading)
        {
            return(
                <>
                    <Header />
                    <div className="container loader-container d-flex justify-content-center align-items-center">
                        <ScaleLoader color="white" /> 
                        <div className="forum-loading ml-3"> Loading Info</div>
                    </div>
                </>
            )
        }
        else
        {
            let chatComp = ''
            if(this.state.doctor){
                chatComp = 
                    <Chat display={this.state.chatDisplay} closeChat={() => this.toggleChat(false)}
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
}

export default Doctor