import React from 'react';
import {BsInstagram, BsTwitter} from "react-icons/bs";
import {ImFacebook} from 'react-icons/im';

export const Footer = (props) => {
  return (
    <>
    <footer className={props.class}>
    <div className="endFooter">
        <div className="endFooterLeft">
            <span>© {new Date().getFullYear()} DOCUMANQUE</span>
            <a href="https://github.com">FAQs</a>
            <a href="https://github.com">Termes & Conditions</a>
        </div>
        <div className="endFooterRight">
            <p>Suivez-nous</p>

            <a className="sponsor" href="https://github.com" target="_blank" rel="noopener noreferrer">
                <BsInstagram className="footerSocial" />
                </a>
            <a className="sponsor" href="https://github.com" target="_blank" rel="noopener noreferrer">
                <BsTwitter className="footerSocial" />
                </a>
            <a className="sponsor" href="https://github.com" target="_blank" rel="noopener noreferrer">
                <ImFacebook className="footerSocial" />
                </a>
            </div>
    </div>
    </footer>
    </>
  )
}

export default Footer;