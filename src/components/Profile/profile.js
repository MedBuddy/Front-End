import { Component } from 'react';
import Header from '../Header/header';
import { ScaleLoader } from 'react-spinners';
import { Form,Input,Label,Button,FormGroup } from 'reactstrap';
import './profile.css';

class Profile extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            loading: true,
            profile: [],
            readonly: true,
            uploadBtnDisplay: "none",
            file: null,
            fileObj: null,
        }

        this.fetchProfile = this.fetchProfile.bind(this);
        this.renderProfile = this.renderProfile.bind(this);
        this.renderGender = this.renderGender.bind(this);
        this.renderBloodGroup = this.renderBloodGroup.bind(this);
        this.renderDoctorForm = this.renderDoctorForm.bind(this);
        this.changeReadOnly = this.changeReadOnly.bind(this);
        this.renderButtons = this.renderButtons.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.changeBtnDisplay = this.changeBtnDisplay.bind(this);
        this.handleFileInput = this.handleFileInput.bind(this);
        this.uploadProfilePic = this.uploadProfilePic.bind(this);
    }

    componentDidMount()
    {
        this.fetchProfile();
    }

    changeReadOnly()
    {
        this.firstname.value = this.state.profile.firstname;
        this.lastname.value = this.state.profile.lastname;
        this.dob.value = this.state.profile.dob;
        this.mobile.value = this.state.profile.mobile;
        if(localStorage.getItem('loginType') === 'doctor')
            this.hospital.value = this.state.profile.hospital;
        this.setState({
            readonly: !this.state.readonly
        })
    }

    changeBtnDisplay(display)
    {
        this.setState({
            uploadBtnDisplay: display,
            file: this.state.profile.image.url,
            fileObj: null,
        })
    }

    handleFileInput(event)
    {
        this.setState({
            fileObj: event.target.files[0],
            file: URL.createObjectURL(event.target.files[0]),
        })
        
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
                profile: response,
                file: response.image.url
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

    renderGender()
    {
        if(this.state.readonly)
        {
            return(
                <Input className={(this.state.readonly)?"profile-input-disabled col-8":"profile-input-active col-8"} type="text" 
                    id="gender" name="gender" autoComplete="off" required defaultValue={this.state.profile.gender} readOnly={this.state.readonly}  />
            )
        }
        else
        {
            return(
                <Input className="col-8 ml-auto" type="select" id="gender" name="gender" defaultValue={this.state.profile.gender}
                    innerRef={(input) => this.gender = input}><i className="fas fa-chevron-down"></i>
                        <option value="">----</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                </Input>
            )
        }
    }

    renderBloodGroup()
    {
        if(this.state.readonly)
        {
            return(
                <Input className={(this.state.readonly)?"profile-input-disabled col-8":"profile-input-active col-8"} type="text" 
                    id="bloodgroup" name="bloodgroup" autoComplete="off" required defaultValue={this.state.profile.bloodgroup} readOnly={this.state.readonly}  />
            )
        }
        else
        {
            return(
                <Input className="col-8 ml-auto" type="select" id="bloodgroup" name="bloodgroup" defaultValue={this.state.profile.bloodgroup}
                    innerRef={(input) => this.bloodgroup = input}><i className="fas fa-chevron-down"></i>
                        <option value="">----</option>
                        <option value="">A+ve</option>
                        <option value="A-ve">A-ve</option>
                        <option value="B+ve">B+ve</option>
                        <option value="B-ve">B-ve</option>
                        <option value="O+ve">O+ve</option>
                        <option value="O-ve">O-ve</option>
                        <option value="AB+ve">AB+ve</option>
                        <option value="AB-ve">AB-ve</option>
                </Input>
            )
        }
    }

    renderButtons()
    {
        if(this.state.readonly)
        {
            return(
                <Button className="mt-4" color="info" onClick={this.changeReadOnly}>
                    <span className="material-icons pr-2 profile-edit-icon">border_color</span>Edit Profile
                </Button>
            )
        }
        else
        {
            return(
                <>
                    <Button className="mt-4" color="primary" type="submit" form="updateProfileForm">Update</Button>
                    <Button className="mt-4 ml-2" color="danger" onClick={this.changeReadOnly}>Cancel</Button>
                </>
            )
        }
    }

    renderDoctorForm()
    {
        if(this.state.profile.type === 2)
        {
            return(
                <>
                    <FormGroup className="row align-items-center">
                        <Label className="profile-label col-4" htmlFor="specialization">Specialization</Label>
                        <Input className="profile-input-disabled col-8" type="text" id="specialization" name="specialization" 
                            defaultValue={this.state.profile.specialization}  innerRef={(input) => this.specialization = input} readOnly={true} />
                    </FormGroup>
                    <FormGroup className="row align-items-center">
                        <Label className="profile-label col-4" htmlFor="hospital">Hospital Details</Label>
                            <Input className={(this.state.readonly)?"profile-input-disabled col-8 forum-modal-textarea":"profile-input-active col-8 forum-modal-textarea"} type="textarea"
                                id="hospital" name="hospital" autoComplete="off" required defaultValue={this.state.profile.hospital} rows="3"
                                innerRef={(input) => this.hospital = input} readOnly={this.state.readonly} />
                    </FormGroup>
                </>
            )
        }
        else
        {
            return <></>
        }
    }

    updateProfile(event)
    {
        event.preventDefault();
        const userToken = localStorage.getItem('userToken');
        let content;
        if(localStorage.getItem('loginType') === 'doctor')
        {
            content = {
                firstname: this.firstname.value,
                lastname: this.lastname.value,
                dob: this.dob.value,
                gender: this.gender.value,
                bloodgroup: this.bloodgroup.value,
                mobile: this.mobile.value,
                hospital: this.hospital.value,
            }
        }
        else
        {
            content = {
                firstname: this.firstname.value,
                lastname: this.lastname.value,
                dob: this.dob.value,
                gender: this.gender.value,
                bloodgroup: this.bloodgroup.value,
                mobile: this.mobile.value,
            }
        }
        
        fetch('/profile/details',{
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer '+userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(content) 
        })
        .then((response) => {
            if(response.ok)
            {
                return response.json()
            }
            else{
                let error = new Error('Error: ' + response.status + ': ' + response.statusText)
                error.response = response
                throw error
            }
        }, err => {
            let error = new Error(err)
            throw error
    })
    .then(response => {
        this.setState({
            profile: response
        })
        this.changeReadOnly();
    })
    .catch(error => {
        console.log(error)
    })
    }

    uploadProfilePic()
    {
        const userToken = localStorage.getItem('userToken');
        let profilePic = new FormData()
        profilePic.append('image', this.state.fileObj)
        fetch('/profile/imageUpload',{
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '+userToken
            },
            body: profilePic
        })
        .then((response) => {
            if(response.ok)
            {
                return response.json();
            }
            else
            {
                let error = new Error('Error: ' + response.status + ': ' + response.statusText)
                error.response = response
                console.log(typeof(response.status))
                throw error
            }
        }, err => {
            let error = new Error(err)
            throw error
        })
        .then((response) => {
            localStorage.setItem('userIcon',response.url)
            window.location.reload();
        })
        .catch(error => console.log(error))
    }

    renderProfile()
    {
        return(
            <>
                <div className="row profile-heading pt-2">
                    <div className="col-12">
                        <u>YOUR PROFILE</u>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-3 offset-1 text-center">
                        <img src={this.state.file} alt={this.state.profile.username} className="profile-image mb-4" />
                        <div className="ml-4"><u className="profile-change-photo" onClick={() => this.changeBtnDisplay("block")}>Change photo</u></div>
                        <div className={"profile-upload-btn mt-3 d-"+this.state.uploadBtnDisplay}>
                            <Input type="file" accept="image/*" onChange={this.handleFileInput} />
                            <div className="d-flex align-items-center">
                                <div className="mt-3 mr-2 btn btn-primary d-flex align-items-center" onClick={this.uploadProfilePic}>
                                    <span class="material-icons">file_upload</span>Upload
                                </div>
                                <div className="mt-3 btn btn-danger" onClick={() => this.changeBtnDisplay("none")}>Cancel</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-7 offset-1">
                        <Form className="w-75" id="updateProfileForm" onSubmit={this.updateProfile}>
                            <FormGroup className="row align-items-center">
                                <Label className="profile-label col-4" htmlFor="firstname">First Name</Label>
                                <Input className={(this.state.readonly)?"profile-input-disabled col-8":"profile-input-active col-8"} type="text"
                                    id="firstname" name="firstname" maxLength="20" autoComplete="off" required defaultValue={this.state.profile.firstname} 
                                    innerRef={(input) => this.firstname = input} readOnly={this.state.readonly} />
                            </FormGroup>
                            <FormGroup className="row align-items-center">
                                <Label className="profile-label col-4" htmlFor="lastname">Last Name</Label>
                                <Input className={(this.state.readonly)?"profile-input-disabled col-8":"profile-input-active col-8"} type="text" 
                                    id="lastname" name="lastname" maxLength="20" autoComplete="off" required defaultValue={this.state.profile.lastname} 
                                    innerRef={(input) => this.lastname = input} readOnly={this.state.readonly} />
                            </FormGroup>
                            <FormGroup className="row align-items-center">
                                <Label className="profile-label col-4" htmlFor="dob">DOB</Label>
                                <Input className={(this.state.readonly)?"profile-input-disabled col-8":"profile-input-active col-8"} type="date" 
                                    id="dob" name="dob" autoComplete="off" required defaultValue={(this.state.profile.dob==="")?"":this.state.profile.dob} 
                                    innerRef={(input) => this.dob = input} readOnly={this.state.readonly} />
                            </FormGroup>
                            <FormGroup className="row align-items-center">
                                <Label className="profile-label col-4" htmlFor="gender">Gender</Label>
                                {this.renderGender()}
                            </FormGroup>
                            <FormGroup className="row align-items-center">
                                <Label className="profile-label col-4" htmlFor="bloodgroup">Blood Group</Label>
                                {this.renderBloodGroup()}
                            </FormGroup>
                            <FormGroup className="row align-items-center">
                                <Label className="profile-label col-4" htmlFor="mobile">Mobile</Label>
                                <Input className={(this.state.readonly)?"profile-input-disabled col-8":"profile-input-active col-8"} type="text" 
                                    id="mobile" name="mobile" autoComplete="off" required defaultValue={this.state.profile.mobile} 
                                    innerRef={(input) => this.mobile = input} readOnly={this.state.readonly} />
                            </FormGroup>
                            {this.renderDoctorForm()}
                            {this.renderButtons()}
                        </Form>
                        
                        
                    </div>
                </div>
            </>
        )
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
                    <div className="container profile-container mt-5 mb-4">
                        {this.renderProfile()}
                        
                    </div>
                    
                </>
            )
        }

    }
}

export default Profile;