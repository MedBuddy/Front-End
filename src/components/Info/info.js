import './info.css'

function Info(props) {
    
    return (
        <>
            <div className={props.info?"info-container":"d-none"}>
                <div className="close info-close" onClick={props.closeInfo}>&times;</div>
                <div className="info-body">
                    { props.info }
                </div>
            </div>
        </>
    )
}

export default Info