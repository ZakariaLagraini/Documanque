import React from 'react';
import Header from './Header';
import Search from './Search';
import { Footer } from './Footer';

let Main = () => {
    return (
        <>
            <Header loggedIn={sessionStorage.getItem("id") == null ?false:true}/>
            <main className="main">
                <Search />
            </main>
            <Footer class="mainFooter"></Footer>
        </>
    )

}

export default Main;