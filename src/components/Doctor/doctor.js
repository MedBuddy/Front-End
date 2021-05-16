import React, { Component } from 'react'
import { Button } from 'reactstrap'
import Header from '../Header/header'
import './doctor.css'
import ReactStars from 'react-rating-stars-component'
import { Link } from 'react-router-dom'
import Chat from '../Chat/chat'

class Doctor extends Component {

    constructor(props){
        super(props)
        this.state = {
            doctor: '',
            reviews: '',
            chatDisplay: false
        }
        this.fetchDoctorInfo = this.fetchDoctorInfo.bind(this)
        this.fetchReviews = this.fetchReviews.bind(this)
        this.toggleChat = this.toggleChat.bind(this)
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

    toggleChat(){
        this.setState({
            chatDisplay: !this.state.chatDisplay
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
                            <Button color="primary" className="btn" onClick={this.toggleChat}>Chat</Button>
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

    renderReviews(){
        if(this.state.reviews){
            const reviews = this.state.reviews.map(review => (
                <div>{review.userId.username}</div>
            ))
            return (
                <div className="container doctor-container p-2 pl-3 mt-4">
                    <div className="row">
                        <div className="col">
                            Reviews
                        </div>
                    </div>
                    <div className="row">
                        {reviews}
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

    render(){
        return (
            <>
                <Header />
                { this.renderDoctorInfo() }
                { this.renderReviews() }
                <Chat display={this.state.chatDisplay} closeChat={this.toggleChat} />
            </>
        )
    }
}

export default Doctor