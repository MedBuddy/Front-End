import React, { Component } from 'react';
import Header from '../Header/header';
import { Media,Form,FormGroup,Input,Label,Button,Modal,ModalBody,ModalHeader,ModalFooter } from 'reactstrap';
import  './discussion.css';
import { ScaleLoader } from 'react-spinners';
import { hostUrl } from '../../host';

class DiscussionComponent extends Component{
    constructor(props)
    {
        super(props)
        this.state = {
            question: '',
            replyForm: false,
            editModal: false,
            replyIndex: -1,
            editQuestionModal: false,
            files: [],
            loading: true,
            removedFiles: []
        }
        this.fetchQuestion = this.fetchQuestion.bind(this);
        this.toggleReplyForm = this.toggleReplyForm.bind(this);    
        this.postReply = this.postReply.bind(this);
        this.updateVote = this.updateVote.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.updateReply = this.updateReply.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.toggleEditQuestionModal = this.toggleEditQuestionModal.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.handleFileInput = this.handleFileInput.bind(this);
        this.renderEditImages = this.renderEditImages.bind(this);
        this.removeImage = this.removeImage.bind(this);
    }
    
    componentDidMount(){
        this.fetchQuestion();
    }

    handleFileInput(event)
    {
        this.setState({
            files: event.target.files
        })
    }

    toggleEditQuestionModal()
    {
        this.setState({
            editQuestionModal: !this.state.editQuestionModal,
            removedFiles: []
        })
    }

    toggleReplyForm()
    {
        this.setState({
            replyForm: !this.state.replyForm
        })
    }

    toggleEditModal(index=-1)
    {
        this.setState({
            replyIndex: index,
            editModal: !this.state.editModal
        })
    }


    fetchQuestion()
    {
        let qid = this.props.id; 
        fetch(hostUrl+'/queries/'+qid, {
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
    
    updateQuestion(event)
    {
        event.preventDefault();
        let fileCount = this.state.files.length + this.state.question.files.length - this.state.removedFiles.length
        if(fileCount>3){
            alert('Upload a maximum 3 files!!!')
            return
        }
        const userToken = localStorage.getItem('userToken');
        let question = new FormData()
        question.append('title', this.edittopic.value)
        question.append('content', this.editquestion.value)
        for(let i=0;i<this.state.files.length;i++)
            question.append('image', this.state.files[i])
        let removed = ''
        for(let i=0;i<this.state.removedFiles.length;i++)
            removed += this.state.removedFiles[i] + ' '
        removed = removed.substring(0,removed.length-1)
        question.append('removed', removed)

        fetch(hostUrl+'/queries/'+this.state.question._id,{
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer '+userToken
            },
            body: question
        })
        .then((response) => {
            if(response.ok)
            {
                console.log('Updated succesfully');
                this.toggleEditQuestionModal();
                window.location.reload();
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
        .catch(error => {
            console.log(error)
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
                <div className="discussion-question-date">
                    ~ {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(d)+' ⏰'+time}
                </div>
            )
        }
    }
    
    deleteQuestion()
    {
        const userToken = localStorage.getItem('userToken');
        fetch(hostUrl+'/queries/'+this.state.question._id,{
            method: 'DELETE',
            headers :{
                'Authorization': 'Bearer '+userToken
            }
        })
        .then(response => {
            if(response.ok){
                window.location.href = "/forum"
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
        .catch(error => {
            console.log(error)
        })
    }
    renderQuestionUpdateIcons()
    {
        const username = localStorage.getItem('username');
        if(this.state.question.askedUserName === username)
        {
            return(
                <Media>
                    <span className="pr-3" onClick={this.toggleEditQuestionModal}>
                        <i className="discussion-replies-edit fa fa-edit fa-md"></i>
                    </span>
                    <span className="pr-4" onClick={this.deleteQuestion}>
                        <i className="discussion-replies-delete fa fa-trash fa-md"></i>
                    </span>
                </Media>
            )
        }
        else
        {
            return <></>
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
                    {this.renderQuestionUpdateIcons()}
                </Media>
            )
        }
    }
    postReply(event)
    {
        event.preventDefault()
        const userToken = localStorage.getItem('userToken');
        const content = { content:this.reply.value }
        fetch(hostUrl+'/queries/'+this.props.id+'/replies',{
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
                    this.reply.value = '';
                    return response.json()
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
        .then(response => {
            this.setState({
                question: response.query
            })
        })
        .catch(error => {
            console.log(error)
        })
    }
    
    updateVote(replyid,voteType)
    {
        const userToken = localStorage.getItem('userToken');
        const content = { voteType: voteType }
        fetch(hostUrl+'/queries/'+this.props.id+'/replies/'+replyid+'/votes',{
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
                    return response.json();
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
        .then(response => {
            this.setState({
                question: response.query
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    updateReply(event)
    {
        event.preventDefault();
        const replyId = this.state.question.replies[this.state.replyIndex]._id
        const userToken = localStorage.getItem('userToken');
        const content = { content: this.editreply.value }
        fetch(hostUrl+'/queries/'+this.props.id+'/replies/'+replyId,{
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer '+userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(content) 
        })
        .then((response) => {
                if(response.ok)
                {
                    this.toggleEditModal()
                    return response.json()
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
        .then(response => {
            this.setState({
                question: response.query
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    deleteReply(replyId)
    {
        const userToken = localStorage.getItem('userToken');
        fetch(hostUrl+'/queries/'+this.props.id+'/replies/'+replyId,{
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer '+userToken,
            },
        })
        .then((response) => {
                if(response.ok)
                {
                    return response.json()
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
        .then(response => {
            this.setState({
                question: response.query
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    renderDeleteEdit(index)
    {
        let reply = this.state.question.replies[index];
        const username = localStorage.getItem('username');
        if(username === reply.author)
        {
            return(
                <div className="discussion-replies-update mb-2">
                    <span onClick={() => this.toggleEditModal(index)} className="pr-3">
                        <i className="discussion-replies-edit fa fa-edit fa-md"></i>
                    </span>
                    <span onClick={() => this.deleteReply(reply._id)}>
                        <i className="discussion-replies-delete fa fa-trash fa-md"></i>
                    </span>
                </div>
            )
        }
        else
        {
            return <></>
        }
    }

    renderReplies()
    {
        if(this.state.question!==''&&this.state.question.replies.length)
        {
            const replies = this.state.question.replies.map((reply,index) => {
                let d = new Date(Date.parse(reply.createdAt));
                let hh = parseInt(d.getHours());
                let mm = parseInt(d.getMinutes());
                if(hh<10) hh = '0'+hh;
                if(mm<10) mm = '0'+mm;
                let time = hh + ":" + mm;
                
                return(
                    <div className="row align-items-center mt-3">
                        <div className="col-1 offset-1">
                                <div className="discussion-votes">
                                <span onClick={() => this.updateVote(reply._id,"up")} className="discussion-upvote">
                                    <i className="fa fa-caret-up fa-lg"></i>
                                </span>
                                
                                <div className="d-flex">
                                    <div className="discussion-upvote-count pr-1">
                                        <i class="fa fa-angle-up"></i>
                                        {reply.upvotes.length}
                                    </div>
                                    <div className="discussion-downvote-count">
                                        <i class="fa fa-angle-down"></i>
                                        {reply.downvotes.length}
                                    </div>
                                </div>
                                
                                <span onClick={() => this.updateVote(reply._id,"down")} className="discussion-downvote"><i className="fa fa-caret-down fa-lg"></i></span>
                            </div>
                        </div>
                        <div className="col-9">
                            <Media className="discussion-replies d-flex align-items-center">
                                <Media left middle className="col-2 discussion-image-container text-center">
                                    <Media object src={reply.userIcon.url} alt={reply.author} className="discussion-image" />
                                    <Media body>{reply.author}</Media>
                                </Media>
                                <Media body className="discusssion-reply-content">
                                    <p>{reply.content}</p>
                                </Media>
                                
                                <Media right className="mt-auto mr-3">
                                    {this.renderDeleteEdit(index)}
                                    <Media className="discussion-date">
                                        ~ {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(d)+' ⏰'+time}
                                    </Media>
                                </Media>
                            </Media>
                        </div>
                    </div>
                )
            })
            return replies
        }
        else
        {
            return <></>
        }
    }

    removeImage(index){
        let removed = this.state.removedFiles
        removed.push(index)
        this.setState({
            removedFiles: removed
        })
    }
    
    renderEditImages(){
        const images = this.state.question.files.map((image, index) => {
            return (
                <div className={(this.state.removedFiles.includes(index))?"discussion-edit-img-hide":"discussion-edit-img-container"}>
                    <div className="close" onClick={() => this.removeImage(index)}>&times;</div>
                    <img src={image} alt={image} />
                </div>
            )
        })

        return (
            <div className="d-flex justify-content-around mt-3 mb-3">
                { images }
            </div>
        )
    }

    renderEditModal(){
        return (
            <Modal isOpen={this.state.editQuestionModal} toggle={this.toggleEditQuestionModal}>
                <ModalHeader toggle={this.toggleEditQuestionModal} className="forum-modal-header">
                    Edit question
                </ModalHeader>
                <ModalBody className="forum-modal-body">
                    <Form onSubmit={this.updateQuestion} id="updateQuestionForm">
                        <FormGroup>
                            <Label htmlFor="edittopic">Topic</Label>
                            <Input type="text" id="edittopic" name="edittopic" maxLength="20" autoComplete="off" required
                                defaultValue={this.state.question.title} innerRef={(input) => this.edittopic = input} />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="editquestion">Question</Label>
                            <Input className="forum-modal-textarea" type="textarea" id="editquestion" rows="3" required  
                                defaultValue={this.state.question.content} name="editquestion" autoComplete="off" innerRef={(input) => this.editquestion = input} />
                        </FormGroup>
                        { this.renderEditImages() }
                        <FormGroup>
                            <Label htmlFor="newimage">New Images (optional)</Label>
                            <Input type="file" id="newimage" name="newimage" multiple onChange={this.handleFileInput} accept="image/*" />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter className="forum-modal-footer">
                    <Button color="primary" type="submit" form="updateQuestionForm">Submit</Button>
                    <Button color="danger" onClick={this.toggleEditQuestionModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }

    render()
    {
        if(!localStorage.getItem('userToken'))
        {
            window.location.href = '/login';
        }
        else if(this.state.loading === true)
        {
            
            return(
                <>
                    <Header />
                    <div className="container loader-container d-flex justify-content-center align-items-center">
                        <ScaleLoader color="white" /> 
                        <div className="forum-loading ml-3"> Loading Discussion</div>
                    </div>
                </>
            )
        }
        else
        {
            return(
                <>
                    <Header />
                    <div className="container dicussion-container mt-3 pt-2 mb-3 pb-3">
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
                            { this.renderEditModal() }
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
                        <div className={(this.state.question!==''&&this.state.question.replies.length)?"mt-3":"d-none"}>
                            
                            {this.renderReplies()}
                            <Modal isOpen={this.state.editModal} toggle={() => this.toggleEditModal()}>
                                <ModalHeader toggle={() => this.toggleEditModal()} className="forum-modal-header">
                                    Edit your reply
                                </ModalHeader>
                                <ModalBody className="forum-modal-body">
                                    <Form onSubmit={this.updateReply} id="editReplyForm">
                                        <FormGroup>
                                            <Label htmlFor="editreply">Your Reply</Label>
                                            <Input type="textarea" className="discussion-answer-textarea" rows="4" id="editreply" name="editreply" required
                                                defaultValue={(this.state.replyIndex === -1)?'':this.state.question.replies[this.state.replyIndex].content} innerRef={(input) => this.editreply = input} />
                                        </FormGroup>
                                    </Form>
                                </ModalBody>
                                <ModalFooter className="forum-modal-footer">
                                    <Button color="primary" type="submit" form="editReplyForm">Submit</Button>
                                    <Button color="danger" className="ml-2" onClick={() => this.toggleEditModal()}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                    </div>
                </>
            )
        }
    }
}

export default DiscussionComponent;