import { Component } from 'react';
import Header from '../Header/header';
import { ScaleLoader } from 'react-spinners';
import './approval.css';

class Approval extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            loading: true,
            doctors: [],
        }
        this.fetchApproval = this.fetchDoctors.bind(this);
    }

    componentDidMount()
    {
        this.fetchDoctors();
    }
    
    fetchDoctors()
    {
        const userToken = localStorage.getItem('userToken');
        fetch('doctors/unverified', {
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
                doctors: response,
            })
            setTimeout(() => {
                this.setState({
                    loading: false,
                });
                }, 200);
        })
        .catch(error => console.log(error))
    }

    renderDoctors()
    {
        if(!this.state.doctors)
        {
            return <></>
        }
        else if(!this.state.doctors.length)
        {
            return(
                <div className="row justify-content-center align-items-center no-feedback p-5">
                    No verifications pending ... 
                </div>
            )
        }
        else
        {
            const doctors = this.state.doctors.map((doctor) => {
                return(
                    <div className="approval-doctor pt-3 pb-4">
                        <div className="approval-doctor-name">
                            {doctor.firstname + ' ' + doctor.lastname}
                        </div>
                        <div className="pt-1 approval-doctor-email">
                            {doctor.email}
                        </div>
                        <div className="pt-1">
                            <a href={doctor.license} target="_blank">View license</a>
                        </div>
                        <div className="pt-3">
                            <span className="btn btn-success">Approve</span>
                            <span className="btn btn-danger ml-2">Reject</span>
                        </div>
                    </div>
                )
            })
            return(
                <>
                    <div className="row">
                        <div className="col-5">
                            <div className="feedback-heading">
                                PENDING VERIFICATIONS
                            </div>
                        </div>
                    </div>
                    <div className="row approval-doctor-container mt-4">
                        {doctors}
                    </div>
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
                        <div className="forum-loading pl-3"> Loading Verification list</div>
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
                        {this.renderDoctors()}
                    </div>
                </>
            )   
        }
    }
}

export default Approval;