import React, { Component } from 'react'
import { Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle } from 'reactstrap'
import Header from '../Header/header'
import './consult.css'
import ReactStars from 'react-rating-stars-component'

class Consult extends Component {

    constructor(props){
        super(props)
        this.state = {
            doctors: [],
            user: []
        }
        this.fetchDoctors = this.fetchDoctors.bind(this)
    }

    componentDidMount(){
        this.checkLogin()
        this.fetchDoctors()
    }

    checkLogin(){
        const userToken = localStorage.getItem('userToken');
        if(!userToken)
            window.location.href = '/login';
    }

    fetchDoctors(){
        let token = localStorage.getItem('userToken')
        fetch('/doctors', {
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
                doctors: response
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    renderDoctors(){
        const doctors = this.state.doctors.map(doctor => {
            return(
                <Card className="consult-card col-3" key={doctor._id} onClick={() => window.location.href = '/consult/'+doctor._id}>
                    <CardImg top className="consult-doctor-img" src={doctor.image.url} alt={doctor.username}></CardImg>
                    <CardBody className="consult-card-body">
                        <CardTitle className="consult-card-title">{doctor.firstname + ' ' + doctor.lastname}</CardTitle>
                        <CardSubtitle className="consult-card-subtitle">{doctor.specialization}</CardSubtitle>
                        <CardText className="text-center">
                            <ReactStars value={doctor.rating} edit={false} size="25" classNames="m-auto" />
                        </CardText>
                    </CardBody>
                </Card>
            )
        })
        return doctors
    }

    render(){
        return (
            <>
                <Header />
                <div className="container consult-container pt-1 pl-5 pr-5 pb-5 mt-4">
                    <div className="row">
                        <div className="col doctor-title">
                            Doctors
                        </div>
                    </div>
                    <div className="row">
                        { this.renderDoctors() }
                    </div>
                </div>
            </>
        )
    }
}

export default Consult