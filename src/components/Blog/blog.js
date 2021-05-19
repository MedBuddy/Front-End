import { Component } from 'react';
import Header from '../Header/header';
import { ScaleLoader } from 'react-spinners';
import { Media,Form,Input,Button,FormGroup,Label,Modal,ModalBody,ModalHeader,ModalFooter,
         Carousel, CarouselItem, CarouselIndicators, CarouselControl } from 'reactstrap';
import './blog.css'

class BlogComponent extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loading: true,
            blog: [],
            blogModal: false,
            commentModal: false,
            commentIndex: -1,
            files: [],
            removedFiles: [],
            activeIndex: 0,
            animating: false
        }

        this.fetchBlog = this.fetchBlog.bind(this);
        this.postComment = this.postComment.bind(this);
        this.updateBlog = this.updateBlog.bind(this);
        this.deleteBlog = this.deleteBlog.bind(this);
        this.toggleblogModal = this.toggleblogModal.bind(this);
        this.togglecommentModal = this.togglecommentModal.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.updateLike = this.updateLike.bind(this);
        this.handleFileInput = this.handleFileInput.bind(this);
        this.renderEditImages = this.renderEditImages.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.previousSlide = this.previousSlide.bind(this)
        this.nextSlide = this.nextSlide.bind(this)
        this.goToSlide = this.goToSlide.bind(this)
        this.setAnimating = this.setAnimating.bind(this)
    }
    
    componentDidMount()
    {
        this.fetchBlog();
    }

    toggleblogModal()
    {
        this.setState({
            blogModal: !this.state.blogModal,
            removedFiles: [],
        })
    }

    togglecommentModal(index=-1)
    {
        this.setState({
            commentIndex: index,
            commentModal: !this.state.commentModal
        })
    }

    handleFileInput(event)
    {
        this.setState({
            files: event.target.files
        })
    }

    removeImage(index){
        let removed = this.state.removedFiles
        removed.push(index)
        this.setState({
            removedFiles: removed
        })
    }

    renderEditImages(){
        const images = this.state.blog.files.map((image, index) => {
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
    
    updateBlog(event)
    {
        event.preventDefault();
        let fileCount = this.state.files.length + this.state.blog.files.length - this.state.removedFiles.length
        if(fileCount>3){
            alert('Upload a maximum 3 files!!!')
            return
        }
        const userToken = localStorage.getItem('userToken');
        let blog = new FormData()
        blog.append('title', this.editTopic.value)
        blog.append('content', this.editContent.value)
        for(let i=0;i<this.state.files.length;i++)
            blog.append('image', this.state.files[i])
        let removed = ''
        for(let i=0;i<this.state.removedFiles.length;i++)
            removed += this.state.removedFiles[i] + ' '
        removed = removed.substring(0,removed.length-1)
        blog.append('removed', removed)

        fetch('/posts/'+this.state.blog._id,{
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer '+userToken
            },
            body: blog
        })
        .then((response) => {
            if(response.ok)
            {
                console.log('Updated succesfully');
                this.toggleblogModal();
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
                    <span className="pr-3" onClick={this.toggleblogModal}>
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

    previousSlide(){
        if(this.state.animating) return
        let blog = this.state.blog
        if(blog.files.length > 1){
            let index = this.state.activeIndex
            index = (index === 0 ? blog.files.length : index) - 1
            this.setState({
                activeIndex: index
            })
        }
    }

    nextSlide(){
        if(this.state.animating) return
        let blog = this.state.blog
        if(blog.files.length > 1){
            let index = this.state.activeIndex
            index = (index === blog.files.length - 1 ? 0 : index + 1)
            this.setState({
                activeIndex: index
            })
        }
    }

    goToSlide(index){
        if(this.state.animating) return
        this.setState({
            activeIndex: index
        })
    }

    setAnimating(animating){
        this.setState({
            animating: animating
        })
    }

    renderBlogFiles(blog)
    {
        if(blog)
        {
            if(blog.files.length){
                let slides = blog.files.map(file => {
                    return (
                        <CarouselItem key={file} onExiting={() => this.setAnimating(true)} onExited={() => this.setAnimating(false)}>
                            <img src={file} alt={blog.title} className="carousel-img" />
                        </CarouselItem>
                    )
                })

                return(
                    <>
                        <Carousel key={blog._id} activeIndex={this.state.activeIndex} next={this.nextSlide} previous={this.previousSlide} 
                                  className="carousel-container">
                            <CarouselIndicators items={blog.files} activeIndex={this.state.activeIndex} onClickHandler={this.goToSlide} />
                                                { slides }
                            <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previousSlide} />
                            <CarouselControl direction="next" directionText="Next" onClickHandler={this.nextSlide} />
                        </Carousel>
                    </>
                )
            }
        }
        else
        {
            return( 
                <div className="ml-5"></div>
            )
        }
    }

    renderLikeIcon()
    {
        const username = localStorage.getItem("username");
        if(this.state.blog.likes.includes(username))
        {
            return(
                <span class="material-icons pr-1 news-like-icon">favorite</span> 
            )
        }
        else
        {
            return(
                <span class="material-icons pr-1">favorite_border</span>
            )
        }
    }
    updateLike()
    {
        let blog = this.state.blog;
        const userToken = localStorage.getItem('userToken');
        
        fetch('/posts/'+blog._id+'/likes',{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+userToken,
            },
            
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
                blog: response.post,
            })
        })
        .catch(error => {
            console.log(error)
        })
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
            const blogImgs = 7
            let curImg = Math.floor(Math.random() * blogImgs) + 1
            let left = Math.floor(Math.random() * 2)
            let w = 'full-width'
            if(blog.files.length === 0)
                w = 'small-width'

            return(
                <>
                    <div className={(w === 'full-width'?'d-none':(left?'float-left':'float-right'))}>
                        <img src={`/images/blog${curImg}.svg`} alt="blog-img" className="blog-default-img" />
                    </div>
                    <div className={"news-blog-container overflow-hidden " + w + (left?" ml-auto":" mr-auto")}>
                        <div className="mr-4">
                            {this.renderBlogFiles(blog)}
                        </div>
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
                                    <span className="news-icons d-flex aligm-items-center" onClick={this.updateLike}>
                                        {this.renderLikeIcon(blog)} 
                                        {blog.likes.length} Likes
                                    </span>
                                </div>
                                
                                <div className="ml-auto pr-3">
                                    ~ {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(d)+' ⏰'+time}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
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
                                        <Input type="textarea" placeholder="Add a public comment" className="discussion-answer-textarea" rows="3" id="blogComment" name="blogComment" required
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

                    <Modal isOpen={this.state.blogModal} toggle={this.toggleblogModal}>
                        <ModalHeader toggle={this.toggleblogModal} className="forum-modal-header">
                            Edit Blog
                        </ModalHeader>
                        <ModalBody className="forum-modal-body">
                            <Form onSubmit={this.updateBlog} id="updateBlogForm">
                                <FormGroup>
                                    <Label htmlFor="editTopic">Topic</Label>
                                    <Input type="text" id="editTopic" name="editTopic" maxLength="20" autoComplete="off" required
                                        defaultValue={this.state.blog.title} innerRef={(input) => this.editTopic = input} />
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="editContent">Question</Label>
                                    <Input className="forum-modal-textarea" type="textarea" id="editContent" rows="3" required  
                                        defaultValue={this.state.blog.content} name="editContent" autoComplete="off" innerRef={(input) => this.editContent = input} />
                                </FormGroup>
                                { this.renderEditImages() }
                                <FormGroup>
                                    <Label htmlFor="newImage">New Images (optional)</Label>
                                    <Input type="file" id="newImage" name="newImage" multiple onChange={this.handleFileInput} accept="image/*" />
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter className="forum-modal-footer">
                            <Button color="primary" type="submit" form="updateBlogForm">Submit</Button>
                            <Button color="danger" onClick={this.toggleblogModal}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.commentModal} toggle={() => this.togglecommentModal()}>
                        <ModalHeader toggle={() => this.togglecommentModal()} className="forum-modal-header" >
                            Edit your Comment
                        </ModalHeader>
                        <ModalBody className="forum-modal-body">
                            <Form onSubmit={this.updateComment} id="editCommentForm">
                                <FormGroup>
                                    <Label htmlFor="editComment">Your Comment</Label>
                                    <Input type="textarea" className="discussion-answer-textarea" rows="4" id="editComment" name="editComment" required
                                        defaultValue={(this.state.commentIndex === -1)?'':this.state.blog.comments[this.state.commentIndex].content} innerRef={(input) => this.editComment = input} />
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter className="forum-modal-footer">
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