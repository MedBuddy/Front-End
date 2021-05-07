import React, { Component } from 'react'
import Home from './Home/home'
import News from './News/news'
import Forum from './Forum/forum'
import Login from './Login/login'
import About from './About/about'
import Consult from './Consult/consult'
import DiscussionComponent from './Discussion/discussion'
import { Switch, Route, Redirect } from 'react-router-dom'

class Main extends Component {

    componentDidMount() {
        document.body.style.backgroundColor = "rgba(0, 172, 177, 1)"
    }
    
    render()
    {
        return (
            <>
                <Switch>
                    <Route path="/home" component={() => <Home />} />
                    <Route path="/login" component={() => <Login />} />
                    <Route exact path="/news" component={() => <News />} />
                    <Route exact path="/forum" component={() => <Forum />} />
                    <Route path="/forum/:id" component={({match}) => <DiscussionComponent id={match.params.id}/>} />
                    <Route exact path="/consult" component={() => <Consult />} />
                    <Route path="/about" component={() => <About />} />
                    <Redirect to="/home" />
                </Switch>
            </>
        )
    }
}

export default Main