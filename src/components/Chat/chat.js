import React, { Component } from 'react'
import './chat.css'
import io from 'socket.io-client'
import { Form, Input, Button } from 'reactstrap'

const socket = io.connect('http://localhost:5001')

class Chat extends Component{

    constructor(props){
        super(props)
        this.state = {
            roomId: 'doctor-user',
            username: 'user',
            messages: []
        }
        this.sendMessage = this.sendMessage.bind(this)
    }

    componentDidMount(){
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
                <div className="msg-user">{ message.username }: </div>
                <div className="msg-content">{ message.msg }</div>
            </div>
        ))
        return messages
    }

    render(){
        return (
            <div className="chat-box">
                <div className="chat-header">
                    Chat
                    <div className="close">&times;</div>
                </div>
                <div className="chat-body" id="chat-body">
                    { this.renderMessages() }
                </div>
                <div className="chat-form">
                    <Form onSubmit={this.sendMessage}>
                        <Input type="textarea" rows="1" className="chat-input" innerRef={(input) => this.msg = input} />
                        <Button type="submit" className="btn chat-btn" color="primary">
                            <i class="fa fa-paper-plane"></i>
                        </Button>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Chat