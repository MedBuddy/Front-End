import React, { Component } from 'react';
import Header from '../Header/header';
import './news.css';
import { Input,Modal,ModalHeader,ModalBody,ModalFooter,Button,Form,FormGroup,Label, 
        Carousel, CarouselItem, CarouselIndicators, CarouselControl } from 'reactstrap';
import { ScaleLoader } from 'react-spinners';

class News extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            blogModal: false,
            allBlogs: [],
            blogs: [],
            files: [],
            loading: true,
            blogType: 'My Blogs',
            activeIndex: [],
            animating: []
        }
        this.toggleBlogModal = this.toggleBlogModal.bind(this);   
        this.fetchBlogs = this.fetchBlogs.bind(this);
        this.postBlog = this.postBlog.bind(this);
        this.handleFileInput = this.handleFileInput.bind(this);
        this.changeBlogType = this.changeBlogType.bind(this);
        this.updateLike = this.updateLike.bind(this);
        this.previousSlide = this.previousSlide.bind(this)
        this.nextSlide = this.nextSlide.bind(this)
        this.goToSlide = this.goToSlide.bind(this)
        this.setAnimating = this.setAnimating.bind(this)
    }
    componentDidMount()
    {
        this.fetchBlogs();
    }
    
    changeBlogType()
    {
        if(this.state.blogType === 'All Blogs')
        {
            let indexes = []
            let animating = []
            this.state.allBlogs.forEach(b => {
                indexes.push(0)
                animating.push(false)
            })
            this.setState({
                blogType: 'My Blogs',
                blogs: this.state.allBlogs,
                activeIndex: indexes,
                animating: animating
            })
        }
        else
        {
            const username = localStorage.getItem('username')
            let blogs = this.state.allBlogs.filter(q => q.postedUserName === username)
            let indexes = []
            let animating = []
            blogs.forEach(b => {
                indexes.push(0)
                animating.push(false)
            })
            this.setState({
                blogType: 'All Blogs',
                blogs: blogs,
                activeIndex: indexes,
                animating: animating
            })
        }
    }
    toggleBlogModal()
    {
        this.setState({
            blogModal: !this.state.blogModal
        })
    }
    handleFileInput(event)
    {
        this.setState({
            files: event.target.files
        })
    }
    fetchBlogs()
    {
        fetch('/posts',{
            method: 'GET'
        })
        .then((response) => {
            if(response.ok)
                return response.json()
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
        .then((response) => {
            let blogs = response.reverse();
            let indexes = []
            let animating = []
            blogs.forEach(b => {
                indexes.push(0)
                animating.push(false)
            })
            this.setState({
                blogs: blogs,
                allBlogs: blogs,
                activeIndex: indexes,
                animating: animating
            })
            setTimeout(() => {
                this.setState({
                    loading: false,
                });
              }, 200);
        })
        .catch(error => console.log(error))
    }
    postBlog(event)
    {
        event.preventDefault();
        const userToken = localStorage.getItem('userToken');
        let blog = new FormData()
        blog.append('title', this.blogTopic.value)
        blog.append('content', this.blogContent.value)
        for(let i=0;i<this.state.files.length;i++)
            blog.append('image',this.state.files[i])
        fetch('/posts',{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+userToken
            },
            body: blog
        })
        .then((response) => {
            if(response.ok)
            {
                this.toggleBlogModal();
                return response.json();
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
        .then((blog) => {
            let blogs = this.state.blogs;
            blogs.splice(0,0,blog);
            this.setState({
                blogs: blogs,
                allBlogs: blogs,
            })
        })
    }

    previousSlide(blogIndex){
        if(this.state.animating[blogIndex]) return
        let blog = this.state.blogs[blogIndex]
        if(blog.files.length > 1){
            let index = this.state.activeIndex[blogIndex]
            index = (index === 0 ? blog.files.length : index) - 1
            let indexes = this.state.activeIndex
            indexes[blogIndex] = index
            this.setState({
                activeIndex: indexes
            })
        }
    }

    nextSlide(blogIndex){
        if(this.state.animating[blogIndex]) return
        let blog = this.state.blogs[blogIndex]
        if(blog.files.length > 1){
            let index = this.state.activeIndex[blogIndex]
            index = (index === blog.files.length - 1 ? 0 : index + 1)
            let indexes = this.state.activeIndex
            indexes[blogIndex] = index
            this.setState({
                activeIndex: indexes
            })
        }
    }

    goToSlide(blogIndex, newIndex){
        if(this.state.animating[blogIndex]) return
        let indexes = this.state.activeIndex
        indexes[blogIndex] = newIndex
        this.setState({
            activeIndex: indexes
        })
    }

    setAnimating(blogIndex, animate){
        let animating = this.state.animating
        animating[blogIndex] = animate
        this.setState({
            animating: animating
        })
    }

    renderBlogFiles(blog, blogIndex)
    {
        if(blog)
        {
            if(blog.files.length){
                let slides = blog.files.map(file => {
                    return (
                        <CarouselItem key={file} onExiting={() => this.setAnimating(blogIndex, true)} onExited={() => this.setAnimating(blogIndex, false)}>
                            <img src={file} alt={blog.title} className="carousel-img" />
                        </CarouselItem>
                    )
                })

                return(
                    <>
                        <Carousel key={blog._id} activeIndex={this.state.activeIndex[blogIndex]} next={() => this.nextSlide(blogIndex)} 
                                    previous={() => this.previousSlide(blogIndex)} className="carousel-container">
                            <CarouselIndicators items={blog.files} activeIndex={this.state.activeIndex[blogIndex]} 
                                                onClickHandler={(newIndex) => this.goToSlide(blogIndex, newIndex)} />
                                                { slides }
                            <CarouselControl direction="prev" directionText="Previous" onClickHandler={() => this.previousSlide(blogIndex)} />
                            <CarouselControl direction="next" directionText="Next" onClickHandler={() => this.nextSlide(blogIndex)} />
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
    renderBlogContent(blog)
    {
        let content = blog.content
        if(content.length > 290)
            content = <>{content.substring(0, 290)}  <b style={{fontSize: '20px'}}>. . .</b></>
        return(
            <>
                <div className="blog-content">{content}</div>
                <div className="btn btn-info mb-2"  onClick={() => window.location.href = '/news/'+blog._id}>View entire article</div>
            </>
        )
    }
    renderLikeIcon(blog)
    {
        if(blog)
        {
            const username = localStorage.getItem("username");
            if(blog.likes.includes(username))
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
        else
        {
            return <></>
        }
    }
    updateLike(index)
    {
        let blogs = this.state.blogs;
        const userToken = localStorage.getItem('userToken');
        
        fetch('/posts/'+blogs[index]._id+'/likes',{
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
            blogs[index] = response.post
            this.setState({
                blogs: blogs,
            })
        })
        .catch(error => {
            console.log(error)
        })
    }
    renderBlogs()
    {
        let left = true
        const blogImgs = 7
        let curImg = 0
        const blogs = this.state.blogs.map((blog, index) => {
            let d = new Date(Date.parse(blog.createdAt));
            let hh = parseInt(d.getHours());
            let mm = parseInt(d.getMinutes());
            if(hh<10) hh = '0'+hh;
            if(mm<10) mm = '0'+mm;
            let time = hh + ":" + mm;
            let w = 'full-width'
            if(blog.files.length === 0){ 
                w = 'small-width'
                left = !left
                curImg = Number(curImg % blogImgs) + 1
            }
            return(
                <div className="mt-5">
                    <div className={(w === 'full-width'?'d-none':(left?'float-left':'float-right'))}>
                        <img src={`/images/blog${curImg}.svg`} alt="blog-img" className="blog-default-img" />
                    </div>
                    <div className={"news-blog-container overflow-hidden " + w + (left?" ml-auto":" mr-auto")}>
                        <div className="mr-4">
                            {this.renderBlogFiles(blog, index)}
                        </div>
                        <div className="news-content-container mt-2">
                            <div className="d-flex mb-auto">
                                <div>
                                    <img className="news-blog-profile-img mr-1" src={blog.userIcon.url} alt={blog.postedUserName} />
                                    {blog.postedUserName}
                                </div>
                                <div className="ml-auto pr-3">
                                    ~ {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(d)+' ⏰'+time}
                                </div>
                            </div>
                            <div className="mb-auto">
                                <h3>{blog.title}</h3>
                                {this.renderBlogContent(blog)}
                            </div>
                            <div className="d-flex mb-auto">
                                <div>
                                    <span className="news-icons d-flex aligm-items-center" onClick={() => this.updateLike(index)}>
                                        {this.renderLikeIcon(blog)} 
                                        {blog.likes.length} Likes
                                    </span>
                                </div>
                                <div className="ml-auto pr-5">
                                    <span className="news-icons" onClick={() => window.location.href = '/news/'+blog._id}>
                                        <i className="fa fa-comments fa-lg pr-1"></i>Comment
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
        return(
            <div className="row">
                <div className="col-10 offset-1 mb-4">
                    {blogs}
                </div>
            </div>
        )
    }
    renderBlogModal()
    {
        return(
            <Modal isOpen={this.state.blogModal} toggle={this.toggleBlogModal}>
                <ModalHeader toggle={this.toggleBlogModal} className="forum-modal-header">
                    Post new Blog
                </ModalHeader>
                <ModalBody className="forum-modal-body">
                    <Form onSubmit={this.postBlog} id="postBlogForm">
                        <FormGroup>
                            <Label htmlFor="blogTopic">Topic</Label>
                            <Input type="text" id="blogTopic" name="topic" maxLength="20" autoComplete="off" required
                                innerRef={(input) => this.blogTopic = input} />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="blogContent">Content</Label>
                            <Input className="forum-modal-textarea" type="textarea" id="blogContent" rows="4" required  
                                    name="blogContent" autoComplete="off" innerRef={(input) => this.blogContent = input} />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="blogFiles">Files (max. 5)</Label>
                            <Input type="file" id="blogFiles" name="blogFiles" multiple onChange={this.handleFileInput} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter className="forum-modal-footer">
                    <Button color="primary" type="submit" form="postBlogForm">Submit</Button>
                    <Button color="danger" onClick={this.toggleBlogModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
    render(){
        if(this.state.loading === true)
        {
            return(
                <>
                    <Header />
                    <div className="container loader-container d-flex justify-content-center align-items-center">
                        <ScaleLoader color="white" /> 
                        <div className="forum-loading pl-3"> Loading Articles for You</div>
                    </div>
                </>
            )
        }
        else
        {
            return (
                <>
                    <Header />
                    <div className="container news-container mb-4 mt-4">
                        <div className="row mt-3">
                            <div className="offset-1 col-11">
                                <div className="news-heading mt-3">
                                    <u>POSTS and BLOGS</u>
                                </div>
                            </div>
                        </div>
                        <div className={(localStorage.getItem('loginType') === 'doctor')?"row mt-3 mb-3":"d-none mt-3"}>
                            <div className="offset-1 col-3">
                                <div className="news-blog-button" onClick={this.changeBlogType}>
                                    {this.state.blogType}
                                </div>
                            </div>
                            <div className="offset-4 col-3">
                                <div className="news-blog-button" onClick={this.toggleBlogModal}>
                                    Post new blog
                                </div>
                            </div>
                        </div>
                        {this.renderBlogModal()}
                        {this.renderBlogs()}
                    </div>
                </>
            )
        }
    }
}

export default News