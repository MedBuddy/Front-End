import React, { Component } from 'react'
import './chat.css'
import io from 'socket.io-client'
import { Form, Input, Button } from 'reactstrap'

const socket = io.connect('http://localhost:5001')

class Chat extends Component{

    constructor(props){
        super(props)
        this.state = {
            roomId: this.props.doctor + '-' + this.props.user,
            username: localStorage.getItem('username'),
            messages: []
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.fetchMessages = this.fetchMessages.bind(this)
    }

    componentDidMount(){
        this.fetchMessages()
        socket.emit('connectToRoom', {roomId: this.state.roomId, newUser: this.state.username})
        socket.on('message', data => {
            let messages = this.state.messages
            messages.push(data)
            this.setState({
                messages: messages
            })
            let chatBody = document.getElementById('chat-body')
            chatBody.scrollTop = chatBody.scrollHeight
        })
    }

    fetchMessages(){
        let token = localStorage.getItem('userToken')
        const body = {
            doctor: this.props.doctor,
            user: this.props.user
        }
        fetch('/doctors/messages', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
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
                messages: response
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    sendMessage(event){
        event.preventDefault()
        if(this.msg.value){
            socket.emit('message', {
                roomId: this.state.roomId,
                username: this.state.username,
                msg: this.msg.value
            })
            this.msg.value = ''
        }
    }

    renderMessages(){
        const messages = this.state.messages.map(message => (
            <div className="chat-msg">
                <div className="msg-user">{ message.sender }: </div>
                <div className="msg-content">{ message.message }</div>
            </div>
        ))
        return messages
    }

    render(){
        return (
            <div className={"chat-box "+(this.props.display?'d-block':'d-none')}>
                <div className="chat-header">
                    Chat
                    <div className="close" onClick={this.props.closeChat}>&times;</div>
                </div>
                <div className="chat-body" id="chat-body">
                    { this.renderMessages() }
                </div>
                <div className="chat-form">
                    <Form onSubmit={this.sendMessage}>
                        <Input type="textarea" rows="1" className="chat-input" innerRef={(input) => this.msg = input} />
                        <Button type="submit" className="btn chat-btn" color="primary">
                            <i className="fa fa-paper-plane"></i>
                        </Button>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Chat