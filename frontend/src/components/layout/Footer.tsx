
function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer-content">
                <div className="site-footer-contact">
                    <a href="mailto:YOUR_EMAIL@example.com">
                        Email
                    </a>

                    <a
                        href="YOUR_LINKEDIN_URL"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn
                    </a>

                    <a
                        href="YOUR_GITHUB_URL"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                </div>

                <div className="site-footer-brand">
                    © {new Date().getFullYear()} Clement Salomon
                </div>
            </div>
        </footer>
    );
}

export default Footer;