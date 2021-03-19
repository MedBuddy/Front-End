import React, { Component } from 'react'
import Header from './HeaderComponent'

class Home extends Component {

    render(){
        return (
            <>
                <Header />
                <div style={{fontSize: 30, textAlign: 'center'}}>Home Page</div>
            </>
        )
    }
}

export default Home