import React, { Component } from 'react'
import { Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle } from 'reactstrap'
import Header from '../Header/header'
import './consult.css'
import ReactStars from 'react-rating-stars-component'
import Chat from '../Chat/chat'
import { Link } from 'react-router-dom'
import { ScaleLoader } from 'react-spinners'
import { hostUrl } from '../../host'

class Consult extends Component {

    constructor(props){
        super(props)
        this.state = {
            doctors: [],
            users: [],
            loginType: '',
            chatDisplay: false,
            loading: true,
            chatUser: 0
        }
        this.fetchDoctors = this.fetchDoctors.bind(this)
        this.fetchUsers = this.fetchUsers.bind(this)
        this.toggleChat = this.toggleChat.bind(this)
        this.changeChatUser = this.changeChatUser.bind(this)
    }

    componentDidMount(){
        this.checkLogin()
        this.setState({
            loginType: localStorage.getItem('loginType')
        }, () => {
            if(this.state.loginType === 'user')
                this.fetchDoctors()
            else
                this.fetchUsers()
        })
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

    fetchDoctors(){
        let token = localStorage.getItem('userToken')
        fetch(hostUrl+'/doctors', {
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
            setTimeout(() => {
                this.setState({
                    loading: false,
                });
              }, 300);
        })
        .catch(error => {
            console.log(error)
        })
    }

    fetchUsers(){
        let token = localStorage.getItem('userToken')
        fetch(hostUrl+'/doctors/chats', {
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
                users: response
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

    renderDoctors(){
        const doctors = this.state.doctors.map(doctor => {
            return(
                <Card className="consult-card col-3 m-4" key={doctor._id} onClick={() => window.location.href = '/consult/'+doctor._id}>
                    <CardImg top className="consult-doctor-img" src={doctor.image.url} alt={doctor.username}></CardImg>
                    <CardBody className="consult-card-body">
                        <CardTitle className="consult-card-title">{doctor.firstname + ' ' + doctor.lastname}</CardTitle>
                        <CardSubtitle className="consult-card-subtitle">{doctor.specialization || <br></br>}</CardSubtitle>
                        <CardText className="text-center">
                            <ReactStars value={doctor.rating} isHalf={true} edit={false} size="25" classNames="m-auto" />
                        </CardText>
                    </CardBody>
                </Card>
            )
        })
        return (
            <>
                <div className="row">
                    <div className="col doctor-title">
                        Doctors
                    </div>
                </div>
                <div className="row">
                    { doctors }
                </div>
            </>
        )
    }

    changeChatUser(index){
        this.setState({
            chatUser: index
        })
    }

    renderUsers(){
        const users = this.state.users.map((user, index) => {
            return(
                <>
                    <Card className="consult-user-card col-3" key={user._id}>
                        <CardImg top className="consult-doctor-img" src={user.image.url} alt={user.username}></CardImg>
                        <CardBody className="consult-card-body">
                            <CardTitle className="consult-card-title">{user.firstname + ' ' + user.lastname}</CardTitle>
                            <CardSubtitle className="consult-card-subtitle">{user.email}</CardSubtitle>
                            <CardText className="d-flex justify-content-around mt-3">
                                <Button color="primary" className="btn consult-user-btn" onClick={() => {this.toggleChat(true);this.changeChatUser(index)}}>
                                    Chat
                                </Button>
                                <Link className="btn btn-primary consult-user-btn" to="/videoCall" target="_blank">
                                    Video Call
                                </Link>
                            </CardText>
                        </CardBody>
                    </Card>
                    <Chat display={this.state.chatDisplay && this.state.chatUser === index} closeChat={() => this.toggleChat(false)}
                            doctor={localStorage.getItem('username')} user={user.username} />
                </>
            )
        })

        return (
            <>
                <div className="row">
                    <div className="col doctor-title">
                        Your Chats
                    </div>
                </div>
                <div className="row">
                    { users }
                </div>
            </>
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
                        <div className="forum-loading ml-3"> Loading details</div>
                    </div>
                </>
            )
        }
        else
        {
            let doc_user = ''
            if(this.state.loginType === 'user')
                doc_user = this.renderDoctors()
            else if(this.state.loginType === 'doctor')
                doc_user = this.renderUsers()
            return (
                <>
                    <Header />
                    <div className="container consult-container pt-1 pl-5 pr-5 pb-5 mt-4">
                        { doc_user }
                    </div>
                </>
            )
        }
    }
}

export default Consult