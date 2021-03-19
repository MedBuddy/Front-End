import React, { Component } from 'react'
import Header from './HeaderComponent'

class Forum extends Component {
    render(){
        return (
            <>
                <Header />
                <div style={{fontSize: 30, textAlign: 'center'}}>Forum Page</div>
            </>
        )
    }
}

export default Forum