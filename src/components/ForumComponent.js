import React, { Component } from 'react';
import Header from './HeaderComponent';
import  '../styles/forum.css';
import { Input,Card,CardBody,CardText,Media,Modal,ModalHeader,ModalBody,ModalFooter,Button,Form,FormGroup,Label } from 'reactstrap';

class Forum extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            allQuestions: [],
            questions: [],
            files:[],
            myquestions:[],
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

    componentDidMount(){
        this.fetchDiscussions();
    }
    
    handleFileInput(event)
    {
        this.setState({
            files: event.target.files
        })
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
                    allQuestions: response.reverse(),
                    questions: response.reverse()
                })
            })
    }
    
    renderDiscussions()
    {
        
        const questions = this.state.questions.map((question) => {
            let d = new Date(Date.parse(question.createdAt));
            let hh = parseInt(d.getHours());
            let mm = parseInt(d.getMinutes());
            if(hh<10) hh = '0'+hh;
            if(mm<10) mm = '0'+mm;
            let time = hh + ":" + mm;
            return(
                <Media className="forum-question-render mb-3" key={question._id} onClick={() => window.location.href = "/forum/"+question._id} >
                    <Media left middle className="col-2 text-center forum-discussion-image-container">
                        <Media object src={question.userIcon.url} alt={question.askedUserName} className="forum-discussion-image" />
                        <Media body>{question.askedUserName}</Media>
                    </Media>
                    <Media body className="question-break">
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
    checkLogin(x)
    {
        const userToken = localStorage.getItem('userToken');
        if(userToken)
        {
            if(x)
                this.toggleModal();
            else
            {
                const username = localStorage.getItem('username')
                let questions = this.state.allQuestions.filter(q => q.askedUserName === username)
                this.setState({
                    questions: questions,
                    discussionType: 4
                })
            }
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
            sum+=replies[i].upvotes.length
        return sum;
    }
    renderCards()
    {
        if(this.state.questions)
        {
            let questions = this.state.allQuestions;
            let d = new Date();
            questions.forEach(q => console.log((d - new Date(Date.parse(q.createdAt)))/(1000*60*60*24)))
            console.log(d)
            questions = questions.filter(question => {
                let days = (d - new Date(Date.parse(question.createdAt)))/(1000*60*60*24)
                return (days <= 10)
            })
            questions.sort(
                (a,b) => {
                    if(a.replies.length > b.replies.length)
                        return -1;
                    else if(a.replies.length < b.replies.length)
                        return 1;
                    return 0;
                }
            )
            questions = questions.slice(0,3);
            console.log(questions)
            const questionCards = questions.map(question => (
                    <div className="col-3" onClick={() => window.location.href = "/forum/"+question._id}>
                        <Card className="forum-card-container">
                            <CardBody>
                                <CardText className="forum-card-heading">
                                    { question.title }
                                </CardText>
                                <CardText>
                                    { question.content }
                                </CardText>
                            </CardBody>
                        </Card>
                    </div>
            ))
            return (
                <div className="row mt-5 justify-content-around">
                    { questionCards }
                </div>
            )
        }
        else{
            return <></>
        }
    }
    changeDiscussionType(id)
    {
        if(id !== this.state.discussionType)
        {
            let questions = this.state.allQuestions
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
                        let a_up = this.findUpvote(a.replies);
                        let b_up = this.findUpvote(b.replies);
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
                <div className="container forum-container pt-1 pl-5 pr-5 pb-5 mt-4">
                    <div className="row mt-4">
                        <div className="col-md-4 forum-trending-today">
                            Trending Today
                        </div>
                        <div className="col-md-5 offset-md-2 d-flex align-items-center">
                            
                            <Input type="text" className="forum-search" placeholder="Search Topics" onKeyPress={this.searchTopic} />
                            {/* <i className="fa fa-search"></i> */}
                        </div>
                    </div>
                    {this.renderCards()}
                </div>
                
                <div className="container forum-container pl-5 pr-5 mb-4 pt-3 mt-5">
                    <div className="row align-items-center">
                        <div className="col-9 forum-discussion mb-4">
                            Discussions
                        </div> 
                        <div className="col-3">
                            <div className="forum-ask-question-bg" onClick={() => this.checkLogin(1)}>
                                <div className="forum-ask-question">
                                    <i className="fa fa-question-circle"></i> Ask Your question
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <div className="forum-discussion-sort">
                                <div className="row justify-content-center">
                                    <div className="col-3">
                                        <div className={(this.state.discussionType === 1)?"forum-discussion-sort-heading-active p-1":"forum-discussion-sort-heading p-1"} onClick={() => this.changeDiscussionType(1)}>
                                            Latest Talks
                                        </div>
                                    </div>
                                    <div className="col-3 offset-1">
                                        <div className={(this.state.discussionType === 2)?"forum-discussion-sort-heading-active p-1":"forum-discussion-sort-heading p-1"} onClick={() => this.changeDiscussionType(2)}>
                                            Highest Votes
                                        </div>
                                    </div>
                                    <div className="col-3 offset-1">
                                        <div className={(this.state.discussionType === 3)?"forum-discussion-sort-heading-active p-1":"forum-discussion-sort-heading p-1"} onClick={() => this.changeDiscussionType(3)}>
                                            Most Popular
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-3 offset-md-1">
                            <div className={(this.state.discussionType === 4)?"forum-my-question-bg":"forum-ask-question-bg"} onClick={() => this.checkLogin(0)}>
                                <div className={(this.state.discussionType === 4)?"forum-my-question":"forum-ask-question"}>
                                    My Questions
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
                                            <Input className="forum-modal-textarea" type="textarea" id="question" rows="3" required  
                                                    name="question" autoComplete="off" innerRef={(input) => this.question = input} />
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
                    <div className="row mt-5">
                        {this.renderDiscussions()}
                    </div>
                </div>
            </>
        )
    }
}

export default Forum