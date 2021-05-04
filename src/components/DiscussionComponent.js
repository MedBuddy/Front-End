import React, { Component } from 'react';
import Header from './HeaderComponent';
import { Media,Form,FormGroup,Input,Label,Button } from 'reactstrap';
import  '../styles/discussion.css';

class DiscussionComponent extends Component{
    constructor(props)
    {
        super(props)
        this.state = {
            question: '',
            replyForm: false,
        }
        this.fetchQuestion = this.fetchQuestion.bind(this);
        this.toggleReplyForm = this.toggleReplyForm.bind(this);    
        this.postReply = this.postReply.bind(this);
    }
    
    toggleReplyForm()
    {
        this.setState({
            replyForm: !this.state.replyForm
        })
    }
    componentDidMount(){
        this.checkLogin();
        this.fetchQuestion();
    }
    checkLogin()
    {
        const userToken = localStorage.getItem('userToken');
        if(!userToken)
            window.location.href = '/login';
    }
    fetchQuestion()
    {
        let qid = this.props.id; 
        fetch('/queries/'+qid, {
            method:'GET'
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
                question: response
            })
        })
    }
    renderQuestionImages()
    {
        let question = this.state.question;
        if(question === '')
        {
            return <></>
        }
        else
        {
            if(!question.files.length)
            {
                return <></>
            }
            else
            {
                const images = question.files.map((image) => {
                    return(
                        <Media object src={image} alt={question.title} className="col-3 mb-4 question-image" />
                    )
                })
                return(
                    images
                )
            }
        }    
    }
    renderDate()
    {
        const question = this.state.question;
        if(question === '')
        {
            return <></>
        }
        else
        {
            let d = new Date(Date.parse(question.createdAt));
            let time = d.getHours() + ":" + d.getMinutes();
            return(
                <div className="discussion-date">
                    ~ {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(d)+' ⏰'+time}
                </div>
            )
        }
    }
    renderQuestion()
    {
        let question = this.state.question;
        if(question === '')
        {
            return <></>
        }
        else
        {
            return(
                <Media className="mt-3 d-flex align-items-center">
                    <Media left middle className="ml-2 discussion-image-container">
                        <Media object src={question.userIcon.url} alt={question.askedUserName} className="discussion-image" />
                        <Media body>{question.askedUserName}</Media>
                    </Media>
                    <Media body className="ml-5">
                        <Media heading className="pt-2">{question.title}</Media>
                        <p>{question.content}</p>
                    </Media>
                </Media>
            )
        }
    }
    postReply(event)
    {
        const userToken = localStorage.getItem('userToken');
        const content = {
                            content:this.reply.value
                        }
        fetch('/queries/'+this.props.id+'/replies',{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(content)
            
        })
        .then((response) => {
                if(response.ok)
                {
                    this.toggleReplyForm();
                }
                else{
                    let error = new Error('Error: ' + response.status + ': ' + response.statusText)
                    error.response = response
                    throw error
                }
            }, err => {
                let error = new Error(err)
                throw error
        })
    }
    
    render()
    {
        return(
            <>
                <Header />
                <div className="container dicussion-container">
                    <div className="discussion-question-render">
                        <div className="row mt-3">
                        
                            <div className="col-12">
                                {this.renderQuestion()}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <Media className="justify-content-center">
                                    {this.renderQuestionImages()}
                                </Media>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 pl-5 pb-2 reply-left">
                                <span className="dicussion-reply-btn" onClick={this.toggleReplyForm}><i className="fa fa-reply"></i> Reply</span>
                            </div>
                            <div className="col-6 question-date-left pr-5">
                                {this.renderDate()}
                            </div>
                        </div>
                    </div>
                    <div className={(this.state.replyForm)?"row mt-3":"d-none"}>
                        <div className="col-11 offset-1">
                            <div className="discussion-replies">
                                <Form className="w-75 m-3" id="postAnswerForm" onSubmit={this.postReply}>
                                    <FormGroup>
                                        <Label htmlFor="reply">Your Reply</Label>
                                        <Input type="textarea" className="discussion-answer-textarea" rows="4" id="reply" name="reply" required
                                            innerRef={(input) => this.reply = input} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Button color="primary" type="submit" form="postAnswerForm">Submit</Button>
                                        <Button color="danger" className="ml-2" onClick={this.toggleReplyForm}>Cancel</Button>
                                    </FormGroup>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default DiscussionComponent;