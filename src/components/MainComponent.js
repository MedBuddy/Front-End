import React, { Component } from 'react'
import Home from './HomeComponent'
import News from './NewsComponent'
import Forum from './ForumComponent'
import Login from './LoginComponent'
import About from './AboutComponent'
import Consult from './ConsultComponent'
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
                    <Route path="/news" component={() => <News />} />
                    <Route path="/forum" component={() => <Forum />} />
                    <Route path="/consult" component={() => <Consult />} />
                    <Route path="/about" component={() => <About />} />
                    <Route path="/login" component={() => <Login />} />
                    <Redirect to="/home" />
                </Switch>
            </>
        )
    }
}

export default Main