import { Component } from 'react';
import Header from '../Header/header';
import { ScaleLoader } from 'react-spinners';
import { Media,Form,Input,Button,FormGroup,Label,Modal,ModalBody,ModalHeader,ModalFooter } from 'reactstrap';
import './blog.css'

class BlogComponent extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loading: true,
            blog: [],
            commentModal: false,
            commentIndex: -1,
        }

        this.fetchBlog = this.fetchBlog.bind(this);
        this.postComment = this.postComment.bind(this);
        /* this.editBlog = this.editBlog.bind(this); */
        this.deleteBlog = this.deleteBlog.bind(this);
        this.togglecommentModal = this.togglecommentModal.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
    }
    
    componentDidMount()
    {
        this.fetchBlog();
    }

    togglecommentModal(index=-1)
    {
        this.setState({
            commentIndex: index,
            commentModal: !this.state.commentModal
        })
    }

    checkLogin()
    {
        const userToken = localStorage.getItem('userToken');
        if(!userToken)
            window.location.href = '/login';
    }
    
    fetchBlog()
    {
        let id = this.props.id; 
        fetch('/posts/'+id, {
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
                blog: response
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
    
    deleteBlog()
    {
        const userToken = localStorage.getItem('userToken');
        fetch('/posts/'+this.state.blog._id,{
            method: 'DELETE',
            headers :{
                'Authorization': 'Bearer '+userToken
            }
        })
        .then(response => {
            if(response.ok){
                window.location.href = "/news"
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

    renderBlogUpdateIcons()
    {
        const username = localStorage.getItem('username');
        if(this.state.blog.postedUserName === username)
        {
            return(
                <div className="ml-auto">
                    <span className="pr-3">
                        <i className="discussion-replies-edit fa fa-edit fa-md"></i>
                    </span>
                    <span className="pr-4" onClick={this.deleteBlog}>
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

    renderBlogFiles(blog)
    {
        if(blog)
        {
            return(
                <div className="mr-4">
                    <img src={blog.userIcon.url} alt={blog.userIcon.url} />
                </div>
            )
        }
        else
        {
            return( 
                <div className="ml-5"></div>
            )
        }
    }

    renderBlog()
    {
        let blog = this.state.blog;
        if(!blog)
        {
            return <></>
        }
        else
        {
            let d = new Date(Date.parse(blog.createdAt));
            let hh = parseInt(d.getHours());
            let mm = parseInt(d.getMinutes());
            if(hh<10) hh = '0'+hh;
            if(mm<10) mm = '0'+mm;
            let time = hh + ":" + mm;
            return(
                <div className="news-blog-container">
                    {this.renderBlogFiles(blog)}
                    <div className="news-content-container mt-2">
                        <div className="d-flex mb-auto">
                            <div>
                                <img className="news-blog-profile-img mr-1" src={blog.userIcon.url} alt={blog.postedUserName} />
                                {blog.postedUserName}
                            </div>
                            {this.renderBlogUpdateIcons(blog)}
                        </div>
                        <div className="mb-auto">
                            <h3>{blog.title}</h3>
                            <p>{blog.content}</p>
                        </div>
                        <div className="d-flex mb-auto">
                            <div className="">
                                <span className="news-comment-icon">
                                    <i className="fa fa-thumbs-up fa-lg pr-1 "></i>{blog.likes.length} Likes
                                </span>
                            </div>
                            
                            <div className="ml-auto pr-3">
                                ~ {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(d)+' ⏰'+time}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    deleteComment(commentId)
    {
        const userToken = localStorage.getItem('userToken');
        fetch('/posts/'+this.props.id+'/comments/'+commentId,{
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
                blog: response.post
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    updateComment(event)
    {
        event.preventDefault();
        const commentId = this.state.blog.comments[this.state.commentIndex]._id
        const userToken = localStorage.getItem('userToken');
        const content = { content: this.editComment.value }
        fetch('/posts/'+this.props.id+'/comments/'+commentId,{
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
                    this.togglecommentModal()
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
                blog: response.post
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    commentUpdateIcons(index)
    {
        let comment = this.state.blog.comments[index];
        const username = localStorage.getItem('username');
        console.log('username: '+username);
        if(username === comment.author)
        {
            return(
                <div className="discussion-replies-update mb-2">
                    <span className="pr-3" onClick={() => this.togglecommentModal(index)}>
                        <i className="discussion-replies-edit fa fa-edit fa-md"></i>
                    </span>
                    <span onClick={() => this.deleteComment(comment._id)}>
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

    renderComments()
    { 
        if(this.state.blog&&this.state.blog.comments.length)
        {   
            const comments = this.state.blog.comments.map((comment,index) => {
                let d = new Date(Date.parse(comment.createdAt));
                let hh = parseInt(d.getHours());
                let mm = parseInt(d.getMinutes());
                if(hh<10) hh = '0'+hh;
                if(mm<10) mm = '0'+mm;
                let time = hh + ":" + mm;
                
                return(
                    <div className="row align-items-center mt-3">
                        <div className="col-10 offset-1">
                            <Media className="blog-comment-container d-flex align-items-center">
                                <Media left middle className="col-2 discussion-image-container text-center">
                                    <Media object src={comment.userIcon.url} alt={comment.author} className="discussion-image" />
                                    <Media body>{comment.author}</Media>
                                </Media>
                                <Media body className="discusssion-reply-content">
                                    <p>{comment.content}</p>
                                </Media>
                                
                                <Media right className="mt-auto mr-3">
                                    {this.commentUpdateIcons(index)}
                                    <Media className="discussion-date">
                                        ~ {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(d)+' ⏰'+time}
                                    </Media>
                                </Media>
                            </Media>
                        </div>
                    </div>
                )
            })
            return(
                <>
                    {comments}
                </>
            )
        }
        else
        {
            return <></>
        }
    }
    postComment(event)
    {
        event.preventDefault()
        const userToken = localStorage.getItem('userToken');
        const content = { content:this.blogComment.value }
        fetch('/posts/'+this.props.id+'/comments',{
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
                    this.blogComment.value = '';
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
                blog: response
            })
        })
        .catch(error => {
            console.log(error)
        })
    }
    render(){
        this.checkLogin();
        if(this.state.loading === true)
        {
            return(
                <>
                    <Header />
                    <div className="container loader-container d-flex justify-content-center align-items-center">
                        <ScaleLoader color="white" /> 
                        <div className="forum-loading ml-3"> Loading Article</div>
                    </div>
                </>
            )
        }
        else
        {
            return(
                <>
                    <Header />
                    <div className ="container news-container p-4 mt-4 mb-4">
                        <div className="row">
                            <div className="col-12">
                                {this.renderBlog()}
                            </div>
                        </div>
                    </div>
                    <div className ="container news-container p-4 mt-4 mb-4">
                        <div className="row mt-2">
                            <div className="offset-1 col-10">
                                <Form className="m-3 blog-comment-form" id="postCommentForm" onSubmit={this.postComment}>
                                    <FormGroup>
                                        <Label htmlFor="blogComment" className="blog-comment-form-label">Add a public comment</Label>
                                        <Input type="textarea" className="discussion-answer-textarea" rows="3" id="blogComment" name="blogComment" required
                                            innerRef={(input) => this.blogComment = input} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Button color="primary" type="submit" form="postCommentForm">Submit</Button>
                                    </FormGroup>
                                </Form>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                {this.renderComments()}
                            </div>
                        </div>
                    </div>
                    <Modal isOpen={this.state.commentModal} toggle={() => this.togglecommentModal()}>
                        <ModalHeader toggle={() => this.togglecommentModal()}>
                            Edit your Comment
                        </ModalHeader>
                        <ModalBody>
                            <Form onSubmit={this.updateComment} id="editCommentForm">
                                <FormGroup>
                                    <Label htmlFor="editComment">Your Comment</Label>
                                    <Input type="textarea" className="discussion-answer-textarea" rows="4" id="editComment" name="editComment" required
                                        defaultValue={(this.state.commentIndex === -1)?'':this.state.blog.comments[this.state.commentIndex].content} innerRef={(input) => this.editComment = input} />
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit" form="editCommentForm">Submit</Button>
                            <Button color="danger" className="ml-2" onClick={() => this.togglecommentModal()}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </>
            )

        }   
    }
}
export default BlogComponent;