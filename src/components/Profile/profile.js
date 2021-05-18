import { Component } from 'react';
import Header from '../Header/header';
import { ScaleLoader } from 'react-spinners';
import './profile.css';

class Profile extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loading: true,
            profile: [],
        }

        this.fetchProfile = this.fetchProfile.bind(this);

    }

    componentDidMount()
    {
        this.fetchProfile();
    }

    fetchProfile()
    {
        const userToken = localStorage.getItem('userToken');
        fetch('/profile/details', {
            method:'GET',
            headers: {
                'Authorization': 'Bearer ' + userToken
            }
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
        .then((response) => response.json())
        .then((response) => {
            this.setState({
                profile: response
            })
            setTimeout(() => {
                this.setState({
                    loading: false,
                });
              }, 200);
        })
        .catch(error => {
            console.log(error)
        })
    }

    renderProfile()
    {
        if(localStorage.getItem('loginType') === 'doctor')
        {
            return(
                <div>doctor</div>
            )
        }
        else
        {
            return(
                <div>user</div>
            )
        }
    }

    render()
    {
        if(!localStorage.getItem('username'))
        {
            window.location.href = '/login'
        }
        else if(this.state.loading === true)
        {
            return(
                <>
                    <Header />
                    <div className="container loader-container d-flex justify-content-center align-items-center">
                        <ScaleLoader color="white" /> 
                        <div className="forum-loading pl-3"> Loading Profile</div>
                    </div>
                </>
            )
        }
        else
        {
            return(
                <>
                    <Header />
                    {this.renderProfile()}
                </>
            )
        }

    }
}

export default Profile;