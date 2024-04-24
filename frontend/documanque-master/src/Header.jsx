import React from 'react';
import Nav from './Nav.jsx';

let Header = (props) => {
    return (
        <header>
        <Nav loggedIn={props.loggedIn}/>
        <input type="checkbox" id="toggle"/>
        <div className="respoNav">
            <ul>
                Responav items appeared based on loggedIn
            </ul>
        </div>
        </header>
    );
}

export default Header;