import React, { Component } from 'react'
import Header from '../Header/header'
import './news.css'

class News extends Component {
    render(){
        return (
            <>
                <Header />
                <div style={{fontSize: 30, textAlign: 'center'}}>News Page</div>
            </>
        )
    }
}

export default News