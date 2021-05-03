import React, { Component } from 'react'
import Home from './HomeComponent'
import News from './NewsComponent'
import Forum from './ForumComponent'
import Login from './LoginComponent'
import About from './AboutComponent'
import Consult from './ConsultComponent'
import DiscussionComponent from './DiscussionComponent'
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