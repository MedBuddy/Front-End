import React, { Component } from 'react';
import Header from './HeaderComponent';
import { Media } from 'reactstrap';
import  '../styles/discussion.css';

class DiscussionComponent extends Component{
    constructor(props)
    {
        super(props)
        this.state = {
            question: '',
            replyModal: false,
            deleteModal: false,
        }
        this.fetchQuestion = this.fetchQuestion.bind(this);
        
    }
    toggleReplyModal()
    {
        this.setState({
            replyModal: !this.state.replyModal
        })
    }
    toggleDeleteModal()
    {
        this.setState({
            deleteModal: !this.state.deleteModal
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
    render()
    {
        return(
            <>
                <Header />
                <div className="container dicussion-container">
                    <div className="row mt-3">
                        <div className="m-3 discussion-question-render">
                            <div className="col-12">
                                {this.renderQuestion()}
                            </div>
                            <div className="col-12">
                                <Media className="justify-content-center">
                                    {this.renderQuestionImages()}
                                </Media>
                            </div>
                            <div className="col-12 question-date-left">
                                {this.renderDate()}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default DiscussionComponent;