
function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer-content">
                <div className="site-footer-contact">
                    {/* <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=clementpatt.salomon@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Email
                    </a>

                    <a
                        href="https://www.linkedin.com/in/clement-patt-salomon/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn
                    </a>

                    <a
                        href="https://github.com/Clem-ptt"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a> */}
                </div>

                <div className="site-footer-brand">
                    © {new Date().getFullYear()} Clement Salomon
                </div>
            </div>
        </footer>
    );
}

export default Footer;