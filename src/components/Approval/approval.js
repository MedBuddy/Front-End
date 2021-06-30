import { Component } from 'react';
import Header from '../Header/header';
import { ScaleLoader } from 'react-spinners';
import { Modal,ModalHeader,ModalBody,ModalFooter,Form,Label,Input,FormGroup,Button } from 'reactstrap';
import './approval.css';
import { hostUrl } from '../../host'

class Approval extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            loading: true,
            doctors: [],
            approveModal: false,
            rejectModal: false,
            doctorIndex: -1,
        }
        this.fetchApproval = this.fetchDoctors.bind(this);
        this.toggleapproveModal = this.toggleapproveModal.bind(this);
        this.togglerejectModal = this.togglerejectModal.bind(this);
        this.approveDoctor = this.approveDoctor.bind(this);
        this.rejectDoctor =this.rejectDoctor.bind(this);
        this.renderApproveModal = this.renderApproveModal.bind(this);
        this.renderRejectModal = this.renderRejectModal.bind(this);
    }

    componentDidMount()
    {
        this.fetchDoctors();
    }

    toggleapproveModal(index=-1)
    {
        this.setState({
            approveModal: !this.state.approveModal,
            doctorIndex: index
        })
    }

    togglerejectModal(index=-1)
    {
        this.setState({
            rejectModal: !this.state.rejectModal,
            doctorIndex: index
        })
    }
    
    fetchDoctors()
    {
        const userToken = localStorage.getItem('userToken');
        fetch(hostUrl+'/doctors/unverified', {
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
            const doctors = this.state.doctors.map((doctor,index) => {
                return(
                    <div className="approval-doctor pt-3 pb-4">
                        <div className="approval-doctor-name">
                            {doctor.firstname + ' ' + doctor.lastname}
                        </div>
                        <div className="pt-1 approval-doctor-email">
                            {doctor.email}
                        </div>
                        <div className="pt-1">
                            <a href={doctor.license} target="_blank" rel="noreferrer" >View license</a>
                        </div>
                        <div className="pt-3">
                            <span className="btn btn-success" onClick={() => this.toggleapproveModal(index)}>
                                <i class="fa fa-check"></i> Approve
                            </span>
                            <span className="btn btn-danger ml-2" onClick={() => this.togglerejectModal(index)}>
                                <i class="fa fa-ban"></i> Reject
                            </span>
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

    approveDoctor(event)
    {
        event.preventDefault();
        let doctors = this.state.doctors;
        const userToken = localStorage.getItem('userToken');
        const content = {
            doctorId: doctors[this.state.doctorIndex]._id,
            specialization: this.specialization.value,
        }
        fetch(hostUrl+'/admin/acceptDoctor',{
            method: 'PUT',
            headers:{
                'Authorization': 'Bearer ' + userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(content)
        })
        .then((response) => {
            if(response.ok)
            {
                this.toggleapproveModal();
                window.location.reload();
                
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
        .catch(error => {
            console.log(error)
        })
    }

    rejectDoctor(event)
    {
        event.preventDefault();
        let doctors = this.state.doctors;
        const userToken = localStorage.getItem('userToken');
        const content = {
            doctorId: doctors[this.state.doctorIndex]._id,
            reason: this.reason.value,
        }
        fetch(hostUrl+'/admin/rejectDoctor',{
            method: 'PUT',
            headers:{
                'Authorization': 'Bearer ' + userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(content)
        })
        .then((response) => {
            if(response.ok)
            {
                this.togglerejectModal();
                window.location.reload();
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
        .catch(error => {
            console.log(error)
        })
    }

    renderApproveModal()
    {
        return(
            <Modal isOpen={this.state.approveModal} toggle={() => this.toggleapproveModal()}>
                <ModalHeader toggle={() => this.toggleapproveModal()} className="forum-modal-header">
                    Approve Doctor
                </ModalHeader>
                <ModalBody className="forum-modal-body">
                    <Form onSubmit={this.approveDoctor} id="approveDoctorForm">
                        <FormGroup>
                            <Label htmlFor="specialization">Doctor's specialization</Label>
                            <Input type="text" id="specialization" name="specialization" autoComplete="off" required
                                innerRef={(input) => this.specialization = input} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter className="forum-modal-footer">
                    <Button color="primary" type="submit" form="approveDoctorForm">Submit</Button>
                    <Button color="danger" className="ml-2" onClick={() => this.toggleapproveModal()}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderRejectModal()
    {
        return(
            <Modal isOpen={this.state.rejectModal} toggle={() => this.togglerejectModal()}>
                <ModalHeader toggle={() => this.togglerejectModal()} className="forum-modal-header">
                    Reject Account
                </ModalHeader>
                <ModalBody className="forum-modal-body">
                    <Form onSubmit={this.rejectDoctor} id="rejectDoctorForm">
                        <FormGroup>
                            <Label htmlFor="reason">Reason for rejection</Label>
                            <Input type="textarea" id="reason" name="reason" className="forum-modal-textarea" rows="3" autoComplete="off" required 
                                innerRef={(input) => this.reason = input} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter className="forum-modal-footer">
                    <Button color="primary" type="submit" form="rejectDoctorForm">Submit</Button>
                    <Button color="danger" className="ml-2" onClick={() => this.togglerejectModal()}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
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
                        {this.renderApproveModal()}
                        {this.renderRejectModal()}
                    </div>
                </>
            )   
        }
    }
}

export default Approval;