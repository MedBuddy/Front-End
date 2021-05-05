
function Footer()
{
    return(
        <div className="container">
            <div className="row">
                <div className="col-4">
                    <div className="text-center">
                        <a className="btn btn-social-icon btn-facebook" href="http://www.facebook.com/profile.php?id="><i className="fa fa-facebook fa-lg"></i></a>
                        <a className="btn btn-social-icon" href="http://www.instagram.com"><i className="fa fa-instagram fa-lg instagramcss"></i></a>
                        <a className="btn btn-social-icon btn-twitter" href="http://twitter.com/"><i className="fa fa-twitter fa-lg"></i></a>            
                    </div>
                </div>
                <div className="col-4 login-copyright">
                    Copyrights © 2021 MedBuddy
                </div>
                <div className="col-4">
                    <div className="text-center">
                        <a className="btn btn-social-icon btn-linkedin" href="http://www.linkedin.com/in/"><i className="fa fa-linkedin fa-lg"></i></a>
                        <a className="btn btn-social-icon" href="mailto:"><i className="fa fa-envelope-o text-danger bg-light"></i></a>
                        <a className="btn btn-social-icon" href="http://wa.me/123456789"><i className="fa fa-whatsapp fa-lg whatsappcss"></i></a>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Footer;