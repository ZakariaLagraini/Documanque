import React, { useEffect, useState } from 'react';
import logo from './sources/logo.png';
import { FaListAlt, FaUserCircle } from 'react-icons/fa';
import { BiLogInCircle } from 'react-icons/bi';
import { GrAnnounce } from 'react-icons/gr';
import { MdNotificationsNone, MdSettings } from 'react-icons/md';
import { IoLogOut } from 'react-icons/io5';
import { Link } from "react-router-dom";
import Notification from './Notification';

let Nav = (props) => {

    let userPfp = props.loggedIn ? require("" + sessionStorage.getItem("pfp")):"";

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if(props.loggedIn) fetchNotifications().then(data => setNotifications(data));
    }, []);

    const countNotSeen = (array) => {
        let count = 0;
        for(let i in array) if(!array[i].seen) count++;
        return count;
    }

    var NotifsMenu;
    var dropMenu;

    let showHide = (props) => {
        NotifsMenu = document.getElementById("notifsmenu");
        dropMenu = document.getElementById("dropmenu");

        if (props === "notifsmenu" && dropMenu.style.display === "none") {
            if (NotifsMenu.style.display !== "none") NotifsMenu.style.display = "none";
            else NotifsMenu.style.display = "inherit";
        }

        if (props === "notifsmenu" && dropMenu.style.display !== "none") {
            dropMenu.style.display = "none";
            if (NotifsMenu.style.display !== "none") NotifsMenu.style.display = "none";
            else NotifsMenu.style.display = "inherit";
        }

        if (props === "dropmenu" && NotifsMenu.style.display === "none") {
            if (dropMenu.style.display !== "none") dropMenu.style.display = "none";
            else dropMenu.style.display = "inherit";
        }

        if (props === "dropmenu" && NotifsMenu.style.display !== "none") {
            NotifsMenu.style.display = "none";
            if (dropMenu.style.display !== "none") dropMenu.style.display = "none";
            else dropMenu.style.display = "inherit";
        }

    };

    let logOut = () => {
        sessionStorage.clear();
        window.history.back();
    }

    async function fetchNotifications() {
        const response = await fetch('http://localhost:8084/notification/getNotifications?id=' + sessionStorage.getItem("id"));
        return response.json();
    }


    return (
        <>
            <nav>

                <div id="leftNav">
                    <Link className="navLogo" to="/"><img height={"65%"} alt="Documanque" src={logo} /><h1>ocumanque</h1></Link>
                    <label htmlFor="toggle" id="toggleLabel"><FaListAlt className='decreasedFa' /></label>
                </div>

                <div id="rightNav">
                    <Link to="/Announce"><button className="announce"><GrAnnounce className='InUpIcon' />Annoncer</button></Link>

                    {props.loggedIn ? (
                        <>
                            <button onClick={() => showHide("notifsmenu")} notification-count={countNotSeen(notifications)} className="notificationsIcon" ><MdNotificationsNone /></button>
                            <button onClick={() => showHide("dropmenu")} className="profilePic"><img alt="" src={userPfp} /></button>
                        </>
                    ) : (
                        <Link to="/SignIn"><button className="login"><BiLogInCircle className='InUpIcon' />Connexion</button></Link>
                    )}

                </div>

            </nav>

            <ul style={{ display: "none" }} id="dropmenu">
                <li><Link name="fc" to="/Profile"><FaUserCircle /> Mon Profil</Link></li>
                <li><Link to="/Settings"><MdSettings /> Paramètres</Link></li>
                <li><Link name="lc" onClick={() => logOut()}><IoLogOut /> Déconnexion</Link></li>
            </ul>

            <ul style={{ display: "none" }} id="notifsmenu">
                {notifications.length !== 0 ?
                    notifications.map((notif) => (
                        <Notification key={notif.id} idAnnonce={notif.annonce.id} idNotif={notif.id} about={notif.annonce.document.nomDocument + "(" + notif.annonce.document.numDocument + ")"} date={notif.date} seen={notif.seen} />
                    )) :
                    <p className="no-notifs">Aucune notification!</p>
                }
            </ul>
        </>
    )
}

export default Nav;