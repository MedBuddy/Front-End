import React, { Component } from 'react'
import Header from './HeaderComponent'
import  '../styles/forum.css'
import { Form, Input,Card,CardBody,CardTitle,CardText} from 'reactstrap';

class Forum extends Component {
    render(){
        return (
            <>
                <Header />
                <div class="container">
                <div className="row">
                                    <div className="col-1 mt-3">
                                        <img src="/images/fire.jpg" class="forum-fire-image" alt="MedBuddy" width="55" height="50" />
                                    </div>
                                    <div className="col-4 mt-2 forum-trend">Trending Today</div>
                                    <div class="col-4  mt-4">
                                        <Form>
                                            <Input type="search" className="forum-search" name="searchBar" id="searchBarId" placeholder="Search topics" />
                                        </Form>
                                    </div>
                                    <div class="col-2  mt-4">
                                        <Form>
                                            <Input type="submit" className="forum-submit" name="searchButton" id="searchButtonId" value="Search" />
                                        </Form>
                                    </div>
                </div>
                <div className="row mt-5 ml-5">
                    <div className="col-3">
                        <Card className="forum-card">
                            <CardBody>
                                <CardTitle className="forum-card-title">Title 1</CardTitle>
                                <CardText className="forum-card-text">This is a Card text</CardText>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="col-3 offset-1">
                        <Card className="forum-card">
                                <CardBody>
                                    <CardTitle className="forum-card-title">Title 2</CardTitle>
                                    <CardText className="forum-card-text">This is a Card text</CardText>
                                </CardBody>
                        </Card>  
                    </div>
                    <div className="col-3 offset-1">
                        <Card className="forum-card">
                                <CardBody>
                                    <CardTitle className="forum-card-title">Title 3</CardTitle>
                                    <CardText className="forum-card-text">This is a Card text</CardText>
                                </CardBody>
                        </Card>  
                    </div>
                </div>
                <div className="row mt-5 ">
                    <div className="col-2 bg-light" id="button-back">
                        <Input type="submit" className="forum-submit" value="Most Popular" name="most-popular" id="most-popular-id" />
                    </div>
                    <div className="col-2 bg-light" id="button-back">
                        <Input type="submit" className="forum-submit" value="Highest Votes" name="highest-votes" id="highest-votes-id" />
                    </div>
                    <div className="col-2 bg-light" id="button-back">
                        <Input type="submit" className="forum-submit" value="Latest Talks" name="latest-talks" id="latest-talks-id"/>
                    </div>
                </div>
                </div>
            </>
        )
    }
}

export default Forum