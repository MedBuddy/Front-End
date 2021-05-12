import './info.css'

function Info(props) {

    let info = props.info
    
    return (
        <>
            <div className={info?"info-container":"d-none"}>
                <div className="close info-close" onClick={() => info=''}>&times;</div>
                <div className="info-body">
                    { info }
                </div>
            </div>
        </>
    )
}

export default Info