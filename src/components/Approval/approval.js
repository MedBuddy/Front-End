import { Component } from 'react';
import Header from '../Header/header';

class Approval extends Component {
    constructor(props)
    {
        super(props);
        this.state = {

        }
    }

    render(){
        return(
            <>
                <Header />
                Approval page
            </>
        )   
    }
}

export default Approval;