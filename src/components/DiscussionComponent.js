import React, { Component } from 'react';
import Header from './HeaderComponent';
import { Media } from 'reactstrap';
import  '../styles/discussion.css';

class DiscussionComponent extends Component{
    constructor(props)
    {
        super(props)
        this.state = {
            question: ''
        }
        this.fetchQuestion = this.fetchQuestion.bind(this);
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
    renderQuestion()
    {
        let question = this.state.question;
        if(question === '')
        {
            return <></>
        }
        else{
            let d = new Date(Date.parse(question.createdAt));
            let time = d.getHours() + ":" + d.getMinutes();
            return(
                <Media className="discussion-question-render">
                        <Media left middle className="ml-2 discussion-image-container">
                            <Media object src={question.userIcon.url} alt={question.askedUserName} className="discussion-image" />
                            <Media body>{question.askedUserName}</Media>
                        </Media>
                        <Media body className="ml-5">
                            <Media heading className="pt-2">{question.title}</Media>
                            <p>{question.content}</p>
                        </Media>
                        <Media right className="mt-auto mr-3 discussion-date">
                            <Media>
                                ~ {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(d)+' ⏰'+time}
                            </Media>
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
                <div className="container">
                    <div className="row mt-4">
                        <div className="col-12">
                            {this.renderQuestion()}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default DiscussionComponent;