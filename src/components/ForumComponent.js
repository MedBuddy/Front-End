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
            files:[],
            modal: false,
            discussionType: 1,
        }
        this.searchTopic = this.searchTopic.bind(this);
        this.fetchDiscussions = this.fetchDiscussions.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.postQuestion = this.postQuestion.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
        this.handleFileInput = this.handleFileInput.bind(this);
        this.changeDiscussionType = this.changeDiscussionType.bind(this);
    }
    handleFileInput(event)
    {
        this.setState({
            files: event.target.files
        })
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
                    questions: response.reverse()
                })
            })
    }

    renderDiscussions()
    {
        
        const questions = this.state.questions.map((question) => {
            let d = new Date(Date.parse(question.createdAt));
            let time = d.getHours() + ":" + d.getMinutes();
            return(
                <Media className="forum-question-render mb-3" key={question._id} onClick={() => window.location.href = "/forum/"+question._id} >
                    <Media left middle className="ml-2 forum-discussion-image-container">
                        <Media object src={question.userIcon.url} alt={question.askedUserName} className="forum-discussion-image" />
                        <Media body>{question.askedUserName}</Media>
                    </Media>
                    <Media body className="ml-5">
                        <Media heading className="pt-2">{question.title}</Media>
                        <p>{question.content}</p>
                    </Media>
                    <Media right className="mt-auto mr-3 forum-discussion-date">
                        <Media>
                            ~ {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(d)+' ⏰'+time}
                        </Media>
                    </Media>
                </Media>
            )}
        )
        return(
            <Media list className="col-12">
                {questions}
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
            window.location.href = '/login'
    }
    postQuestion(event)
    {
        
        const userToken = localStorage.getItem('userToken');
        let question = new FormData()
        question.append('title', this.topic.value)
        question.append('content', this.question.value)
        for(let i=0;i<this.state.files.length;i++)
            question.append('image',this.state.files[i])
        fetch('queries/',{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+userToken
            },
            body: question
        })
        .then((response) => {
            if(response.ok)
            {
                console.log('posted succesfully');
                this.toggleModal();
                window.location.reload();
            }
            else if(response.status === 500 )
            {
                alert('you can upload only 3 files...!!')
            }
            else
            {
                let error = new Error('Error: ' + response.status + ': ' + response.statusText)
                error.response = response
                console.log(typeof(response.status))
                throw error
            }
        }, err => {
            let error = new Error(err)
            throw error
        })
        event.preventDefault()
    }
    findUpvote(replies)
    {
        let i,sum=0;
        for(i=0;i<replies.length;i++)
            sum+=replies.upvotes.length
        return sum;
    }
    changeDiscussionType(event)
    {
        let id = parseInt(event.target.id);
        if(id !== this.state.discussionType)
        {
            
            let questions = this.state.questions
            if(id === 1)
            {
                questions.sort(
                    (a,b) => {
                        if(a.createdAt > b.createdAt)
                            return -1;
                        else if(a.createdAt < b.createdAt)
                            return 1;
                        return 0;
                    }
                )
            }   
            else if(id === 2)
            {
                questions.sort(
                    (a,b) => {
                        let a_up = (a.replies.length)?this.findUpvote(a.replies):0,b_up = (a.replies.length)?this.findUpvote(b.replies):0;
                        if(a_up > b_up)
                            return -1;
                        else if(a_up < b_up)
                            return 1;
                        return 0;
                    }
                )
            }
            else
            {
                questions.sort(
                    (a,b) => {
                        if(a.replies.length > b.replies.length)
                            return -1;
                        else if(a.replies.length < b.replies.length)
                            return 1;
                        return 0;
                    }
                )
            }
            this.setState({
                discussionType: id,
                questions: questions
            })
        }
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
                                            <div className={(this.state.discussionType === 1)?"forum-discussion-sort-heading-active p-1":"forum-discussion-sort-heading p-1"} id="1" onClick={this.changeDiscussionType}>
                                                Latest Talks
                                            </div>
                                        </div>
                                        <div className="col-3 offset-1">
                                            <div className={(this.state.discussionType === 2)?"forum-discussion-sort-heading-active p-1":"forum-discussion-sort-heading p-1"} id="2" onClick={this.changeDiscussionType}>
                                                Highest Votes
                                            </div>
                                        </div>
                                        <div className="col-3 offset-1">
                                            <div className={(this.state.discussionType === 3)?"forum-discussion-sort-heading-active p-1":"forum-discussion-sort-heading p-1"} id="3" onClick={this.changeDiscussionType}>
                                                Most Popular
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
                                    Post new question
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
                                            <Label htmlFor="image">Images (max. 3)</Label>
                                            <Input type="file" id="image" name="image" multiple onChange={this.handleFileInput} accept="image/*"
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
                        <div className="col-12 forum-discussion mb-4">
                            Discussions
                        </div>
                        {this.renderDiscussions()}
                    </div>
                </div>
            </>
        )
    }
}

export default Forum