import { Component } from 'react';
import Header from '../Header/header';
import { ScaleLoader } from 'react-spinners';
import './feedback.css'

class Feedback extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            loading: true,
            feedbacks:[],
        }
        this.fetchFeedbacks = this.fetchFeedbacks.bind(this);
    }

    componentDidMount()
    {
        this.fetchFeedbacks();
    }
    
    fetchFeedbacks()
    {
        const userToken = localStorage.getItem('userToken');
        fetch('feedback/', {
            method:'GET',
            headers: {
                'Authorization': 'Bearer ' + userToken
            },
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
                
                this.setState({
                    feedbacks: response.reverse(),
                })
                setTimeout(() => {
                    this.setState({
                        loading: false,
                    });
                  }, 200);
            })
            .catch(error => console.log(error))
    }

    renderFeedback()
    {
        if(!this.state.feedbacks)
        {
            return <></>
        }
        else if(!this.state.feedbacks.length)
        {
            return(
                <div className="row justify-content-center align-items-center no-feedback p-5">
                    No FeedBacks received from the Users
                </div>
            )
        }
        else
        {
            const feedbacks = this.state.feedbacks.map((feedback) => {
                let d = new Date(Date.parse(feedback.createdAt));
                let hh = parseInt(d.getHours());
                let mm = parseInt(d.getMinutes());
                if(hh<10) hh = '0'+hh;
                if(mm<10) mm = '0'+mm;
                let time = hh + ":" + mm;

                return(
                    <div className="row mt-3">
                        <div className="col-10 offset-1">
                            <div className="feedback-container pl-4">
                                <div className="feedback-content">
                                    {feedback.content}
                                </div>
                                <div className="pt-1">
                                    <i class="fa fa-user"></i> <span className="feedback-name">{feedback.name+' '}</span>
                                    <i class="fa fa-envelope"></i> <span className="feedback-name">{feedback.email}</span>
                                </div>
                                <div className="ml-auto pr-2">
                                    ~ {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(d)+' ⏰'+time}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
            return(
                <>
                    <div className="row mt-1">
                        <div className="col-5">
                            <div className="feedback-heading">
                                FEEDBACKS AND COMMENTS
                            </div>
                        </div>
                    </div>
                    {feedbacks}      
                </>
            )
        }
        
    }

    render(){
        if(localStorage.getItem('loginType') !== 'admin')
        {
            window.location.href = '/home';
        }
        else if(this.state.loading === true)
        {
            return(
                <>
                    <Header />
                    <div className="container loader-container d-flex justify-content-center align-items-center">
                        <ScaleLoader color="white" /> 
                        <div className="forum-loading pl-3"> Loading Feedbacks</div>
                    </div>
                </>
            )
        }
        else
        {
            return(
                <>
                    <Header />
                    <div className="container forum-container mt-4 mb-4 p-4">
                        {this.renderFeedback()}
                    </div>
                </>
            )   
        }
    }
}

export default Feedback;