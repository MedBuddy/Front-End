import React, { Component } from 'react';
import Header from '../Header/header';
import { ScaleLoader } from 'react-spinners';
import  './forum.css';
import { Input,Card,CardBody,CardText,Media,Modal,ModalHeader,ModalBody,ModalFooter,Button,Form,FormGroup,Label } from 'reactstrap';
import { hostUrl } from '../../host';

class Forum extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            allQuestions: [],
            questions: [],
            files:[],
            modal: false,
            discussionType: 1,
            loading: true,
            display: 'none',
        }
        this.searchTopic = this.searchTopic.bind(this);
        this.fetchDiscussions = this.fetchDiscussions.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.postQuestion = this.postQuestion.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
        this.handleFileInput = this.handleFileInput.bind(this);
        this.changeDiscussionType = this.changeDiscussionType.bind(this);
        this.renderModal = this.renderModal.bind(this);
    }

    componentDidMount(){
        this.fetchDiscussions();
        window.addEventListener('scroll', () => {
            let display = 'none'
            if(window.pageYOffset > 550)
                display = 'block'
            this.setState({
                display: display
            })
        })
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
        if(event.charCode === 13 || event.button === 0)
        {
            let i,j;
            let questions = this.state.questions;
            let search = document.getElementById('forumSearchBar').value;
            let searchResults = [];
            if(search.length)
            {
                search = search.toLowerCase().split(" ");
                for(i=0;i<questions.length;i++)
                {
                    let title = questions[i].title.toLowerCase().split(" ");
                    let content = questions[i].content.toLowerCase().split(" ");
                    for(j=0;j<title.length;j++)
                    {
                        if(search.includes(title[j]))
                        {
                            searchResults.push(questions[i]);
                            break;
                        }
                    }
                    if(j===title.length)
                    {
                        for(j=0;j<content.length;j++)
                        {
                            if(search.includes(content[j]))
                            {
                                searchResults.push(questions[i]);
                                break;
                            }
                        }
                    }

                }
                this.setState({
                    questions: searchResults
                })
            }
            else
            {
                this.setState({
                    questions: this.state.allQuestions,
                })
            }
            
        }
    }
    
    fetchDiscussions()
    {
        fetch(hostUrl+'/queries/', {
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
                let questions = response.reverse()
                this.setState({
                    allQuestions: questions,
                    questions: questions,
                })
                setTimeout(() => {
                    this.setState({
                        loading: false,
                    });
                  }, 200);
            })
            .catch(error => console.log(error))
    }
    
    renderDiscussions()
    {
        if(this.state.questions&&this.state.questions.length)
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
                )
            })
            return(
                <Media list className="col-12">
                    {questions}
                </Media>
            )
        }
        else
        {
            return(
                <div className="forum-no-questions">
                    No such questions
                </div>
            )
        }
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
        event.preventDefault();
        const userToken = localStorage.getItem('userToken');
        let question = new FormData()
        question.append('title', this.topic.value)
        question.append('content', this.question.value)
        for(let i=0;i<this.state.files.length;i++)
            question.append('image',this.state.files[i])
        fetch(hostUrl+'/queries/',{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+userToken
            },
            body: question
        })
        .then((response) => {
            if(response.ok)
            {
                this.toggleModal();
                return response.json()
            }
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
        .then((question) => {
            let questions = this.state.allQuestions
            questions.splice(0,0,question);
            console.log(questions)
            this.setState({
                allQuestions: questions,
                questions: questions,
            })
        })
        
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
            /* let d = new Date();
            questions = questions.filter(question => {
                let days = (d - new Date(Date.parse(question.createdAt)))/(1000*60*60*24)
                return (days <= 30)
            }) */
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
            const questionCards = questions.map(question => (
                    <div className="col-3" onClick={() => window.location.href = "/forum/"+question._id}>
                        <Card className="forum-card-container">
                            <CardBody>
                                <CardText className="forum-card-heading">
                                    { question.title }
                                </CardText>
                                <CardText className="forum-card-break">
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
        let s=document.getElementById('forumSearchBar').value;
        if(id !== this.state.discussionType||s)
        {
            let questions = this.state.allQuestions
            if(id === 1)
            {
                questions.sort(
                    (a,b) => {
                        if(new Date(Date.parse(a.createdAt)) > new Date(Date.parse(b.createdAt)))
                            return -1;
                        else if(new Date(Date.parse(a.createdAt)) < new Date(Date.parse(b.createdAt)))
                            return 1;
                        return 0;
                    }
                )
                console.log(questions)
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

    renderModal(){
        return (
            <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal} className="forum-modal-header">
                    Post new question
                </ModalHeader>
                <ModalBody className="forum-modal-body">
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
                <ModalFooter className="forum-modal-footer">
                    <Button color="primary" type="submit" form="postQuestionForm">Submit</Button>
                    <Button color="danger" onClick={this.toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }

    render()
    {
        if(this.state.loading === true)
        {
            return(
                <>
                    <Header />
                    <div className="container loader-container d-flex justify-content-center align-items-center">
                        <ScaleLoader color="white" /> 
                        <div className="forum-loading pl-3"> Fetching data for You</div>
                    </div>
                </>
            )
        }
        else
        {
            return(
                <>
                    <Header />
                    <div className="container forum-container pt-1 pl-5 pr-5 pb-5 mt-4">
                        <div className="row mt-4">
                            <div className="col-md-4 forum-trending-today">
                                Trending Talks
                            </div>
                            <div className="col-md-5 offset-md-2 d-flex align-items-center">
                                
                                <Input type="text" id="forumSearchBar" name="forumSearchBar" autoComplete="off" className="forum-search" placeholder="Search Topics" onKeyPress={this.searchTopic} />
                                
                                <div className="forum-search-button" onClick={this.searchTopic}>
                                    <i className="fa fa-search"></i>
                                </div>
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
                                { this.renderModal() }
                            </div>
                        </div>
                        <div className="row justify-content-center mt-5">
                            {this.renderDiscussions()}
                        </div>
                        <div className="forum-goto-btn" onClick={() => window.scrollTo(0,0)} style={{display: this.state.display}}>
                            <button className="btn btn-primary">⬆️</button>
                        </div>
                    </div>
                </>
            )
        }
    }
}

export default Forum