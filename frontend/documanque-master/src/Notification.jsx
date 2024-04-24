import React from 'react';
import { BsCircleFill, BsCircle } from 'react-icons/bs';
import { Link } from 'react-router-dom';

let Notification = (props) => {

    let handleClick = async (props) => {
        if (!props.seen) await fetch("http://localhost:8084/notification/markAsSeen?id=" + props.idNotif);
        window.location.href = "/Announcement?id=" + props.idAnnonce;
    }

    return (
        <li>
            <Link onClick={() => handleClick(props)} className={!props.seen ? "notifs-li" : "notifs-li unchecked"}>
                {props.seen ? (<BsCircleFill />) : (<BsCircle />)}
                <span>Un commentaire sur :</span><b>{props.about}</b>
                <p>{new Date(props.date).toLocaleDateString()}</p>
            </Link>
        </li>
    )

}

export default Notification;