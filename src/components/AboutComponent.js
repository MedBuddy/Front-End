import React, { Component } from 'react'
import Header from './HeaderComponent'

class About extends Component {
    render(){
        return (
            <>
                <Header />
                <div style={{fontSize: 30, textAlign: 'center'}}>About Page</div>
            </>
        )
    }
}

export default About