import React, { Component } from 'react';
import Header from '../Header/header';
import './news.css';
import { Media,Input,Modal,ModalHeader,ModalBody,ModalFooter,Button,Form,FormGroup,Label } from 'reactstrap';

class News extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            blogModal: false,
            blogs: [],
            files: [],
        }
        this.toggleBlogModal = this.toggleBlogModal.bind(this);   
        this.fetchBlogs = this.fetchBlogs.bind(this);
        this.postBlog = this.postBlog.bind(this);
        this.handleFileInput = this.handleFileInput.bind(this);
        /* this.renderBlogs = this.renderBlogs.bind(this); */
    }
    componentDidMount()
    {
        this.fetchBlogs()
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
            this.setState({
                blogs: blogs
            })
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
                blogs: blogs
            })
        })
    }
    renderBlogs()
    {
        const blogs = this.state.blogs.map((blog) => {
            
            return(
                <div>
                    {blog.title}
                </div>
            )
        })
        return(
            <div>
                {blogs}
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
        return (
            <>
                <Header />
                <div className="container forum-container">
                    <div className="row mt-3">
                        <div className="offset-1 col-11">
                            <div className="news-heading">
                                POSTS and BLOGS
                            </div>
                        </div>
                    </div>
                    <div className={(localStorage.getItem('loginType') === 'doctor')?"row mt-3":"d-none mt-3"}>
                        <div className="offset-1 col-3">
                            <div className="news-blog-button">
                                My Blogs
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

export default News