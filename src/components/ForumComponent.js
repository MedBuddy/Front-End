import React, { Component } from 'react';
import Header from './HeaderComponent';
import  '../styles/forum.css';
import { Input,Card,CardBody,CardText,Media,Modal,ModalHeader,ModalBody,ModalFooter,Button,Form,FormGroup,Label } from 'reactstrap';

class Forum extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            questions: [],
            modal: false,
        }
        this.searchTopic = this.searchTopic.bind(this);
        this.fetchDiscussions = this.fetchDiscussions.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.postQuestion = this.postQuestion.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
    }

    componentDidMount(){
        this.fetchDiscussions()
    }

    toggleModal()
    {
        this.setState({
            modal: !this.state.modal
        })
    }
    
    searchTopic(event)
    {
        if(event.charCode === 13)
        {
            alert('enter pressed')
        }
    }
    
    fetchDiscussions()
    {
        fetch('queries/', {
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
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    questions: response
                })
            })
    }
    renderDiscussions()
    {
        const questions=this.state.questions;
        console.log(this.state.questions);
        const x = questions.map((question) => 
            <Media>
                <Media body className="ml-5">
                    <Media heading>{question.title}</Media>
                    <p>{question.content}</p>
                    <a href="">View entire discussion</a>
                </Media>
            </Media>
        )
        return(
            <Media list>
                {x}
            </Media>
        )
    }
    checkLogin()
    {
        const userToken = localStorage.getItem('userToken');
        if(userToken)
        {
            this.toggleModal();
        }
        else
            window.location.href = 'login'
    }
    postQuestion(event)
    {
        this.toggleModal();
        const userToken = localStorage.getItem('userToken');
        let question = new FormData()
        question.append('title', this.topic.value)
        question.append('content', this.question.value)
        fetch('queries/',{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+userToken
            },
            body: question
        })
        .then((response) => {
            if(response.ok)
                alert('posted succesfully');
        }, err => {
            let error = new Error(err)
            throw error
        })
        
    }
    render(){
        return (
            <>
                <Header />
                <div className="container">
                    <div className="row mt-4">
                        <div className="col-md-4 forum-trending-today">
                            Trending Today
                        </div>
                        <div className="col-md-5 offset-md-2">
                            
                            <Input type="text" className="forum-search" placeholder="Search Topics" onKeyPress={this.searchTopic} />
                            {/* <i className="fa fa-search"></i> */}
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-md-3">
                            <Card>
                                <CardBody>
                                    <CardText>
                                        Trending question-1
                                    </CardText>
                                    <CardText>
                                        View entire discussion
                                    </CardText>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-md-3 offset-md-1">
                            <Card>
                                <CardBody>
                                    <CardText>
                                        Trending question-2
                                    </CardText>
                                    <CardText>
                                        View entire discussion
                                    </CardText>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-md-3 offset-md-1">
                            <Card>
                                <CardBody>
                                    <CardText>
                                        Trending question-3
                                    </CardText>
                                    <CardText>
                                        View entire discussion
                                    </CardText>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                    <div className="row mt-5 align-items-center">
                        
                            <div className="col-md-8">
                                <div className="forum-discussion-sort">
                                    <div className="row justify-content-center">
                                        <div className="col-3">
                                            <div className="forum-discussion-sort-heading p-1">
                                                Most Popular
                                            </div>
                                        </div>
                                        <div className="col-3 offset-1">
                                            <div className="forum-discussion-sort-heading p-1">
                                                Highest Votes
                                            </div>
                                        </div>
                                        <div className="col-3 offset-1">
                                            <div className="forum-discussion-sort-heading p-1">
                                                Latest Talks
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                        <div className="col-md-3 offset-md-1 ">
                            <div className="forum-ask-question-bg" onClick={this.checkLogin}>
                                <div className="forum-ask-question">
                                    Ask Your question
                                </div>
                            </div>
                            <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                                <ModalHeader toggle={this.toggleModal}>
                                    Post new question:
                                </ModalHeader>
                                <ModalBody>
                                    <Form onSubmit={this.postQuestion} id="postQuestionForm">
                                        <FormGroup>
                                            <Label htmlFor="topic">Topic</Label>
                                            <Input type="text" id="topic" name="topic" maxLength="20" autoComplete="off" required
                                                innerRef={(input) => this.topic = input} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label htmlFor="question">Question</Label>
                                            <Input className="forum-modal-textarea" type="textarea" id="question" name="question" autoComplete="off" required 
                                                innerRef={(input) => this.question = input} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label htmlFor="files">Images (max. 3)</Label>
                                            <Input type="file" id="files" name="files" 
                                                />
                                        </FormGroup>
                                    </Form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" type="submit" form="postQuestionForm">Submit</Button>
                                    <Button color="danger" onClick={this.toggleModal}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12 forum-discussion">
                            Discussions
                        </div>
                        <div className="col-12">
                                {this.renderDiscussions()}

                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Forum