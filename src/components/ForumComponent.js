import React, { Component } from 'react';
import Header from './HeaderComponent';
import  '../styles/forum.css';
import { Input,Card,CardBody,CardText } from 'reactstrap';

class Forum extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            questions: []
        }
        this.searchTopic = this.searchTopic.bind(this);
        this.fetchDiscussions = this.fetchDiscussions.bind(this);
    }

    componentDidMount(){
        this.fetchDiscussions()
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
                console.log(this.state.questions)
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
                            <div className="forum-ask-question-bg">
                                <div className="forum-ask-question">Ask Your question</div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12 forum-discussion">
                            Discussions
                            {this.fetchDiscussions}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Forum