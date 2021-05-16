import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './Home/home'
import News from './News/news'
import Forum from './Forum/forum'
import Login from './Login/login'
import About from './About/about'
import Consult from './Consult/consult'
import DiscussionComponent from './Discussion/discussion'
import BlogComponent from './Blog/blog'
import Info from './Info/info'
import VideoCall from './VideoCall/videoCall'
import Doctor from './Doctor/doctor'

class Main extends Component {

    constructor(props){
        super(props)
        this.state = {
            info: ''
        }
        this.clearInfo = this.clearInfo.bind(this)
        this.closeInfo = this.closeInfo.bind(this)
        this.setInfo = this.setInfo.bind(this)
    }

    componentDidMount() {
        document.body.style.backgroundColor = "rgba(0, 172, 177, 1)"
    }

    setInfo(info){
        localStorage.removeItem('info')
        this.setState({
            info: info
        })
    }

    clearInfo(){
        localStorage.removeItem('info')
        setTimeout(() => {
            this.setState({
                info: ''
            })
        }, 5000)
    }

    closeInfo(){
        localStorage.removeItem('info')
        this.setState({
            info: ''
        })
    }
    
    render()
    {
        return (
            <>
                <Switch>
                    <Route path="/home" component={() => <Home clearInfo={this.clearInfo} closeInfo={this.closeInfo} setInfo={this.setInfo} />} />
                    <Route path="/login" component={() => <Login clearInfo={this.clearInfo} closeInfo={this.closeInfo} setInfo={this.setInfo} />} />
                    <Route exact path="/news" component={() => <News />} />
                    <Route path="/news/:id" component={({match}) => <BlogComponent id={match.params.id}/>} />
                    <Route exact path="/forum" component={() => <Forum />} />
                    <Route path="/forum/:id" component={({match}) => <DiscussionComponent id={match.params.id}/>} />
                    <Route exact path="/consult" component={() => <Consult />} />
                    <Route path="/consult/:id" component={({match}) => <Doctor id={match.params.id} />} />
                    <Route exact path="/videoCall" component={() => <VideoCall />} />
                    <Route path="/about" component={() => <About />} />
                    <Redirect to="/home" />
                </Switch>
                <Info info={this.state.info} closeInfo={this.closeInfo} />
            </>
        )
    }
}

export default Main