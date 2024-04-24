import React from 'react';
import { Link } from 'react-router-dom';

import { RiFilePaper2Fill } from 'react-icons/ri';
import { BsCreditCardFill } from 'react-icons/bs';
import { FaIdCard, FaPassport } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { MdOutlineReadMore, MdContactPage } from 'react-icons/md';

export const AnnouncementCard = (props) => {
    return (
        <>
            <div className="announcement-card">

                <div className="announcement-card-icon">
                    {
                        props.Nom === 'Carte d\'identité' ?
                        <FaIdCard />
                        :
                        props.Nom === 'Permis de conduire' ?
                        <FaIdCard />
                        :
                        props.Nom === 'Diplome' ?
                        <RiFilePaper2Fill />
                        :
                        props.Nom === 'Carte bancaire' ?
                        <BsCreditCardFill />
                        :
                        props.Nom === 'Passeport' ?
                        <FaPassport />
                        :
                        <IoDocumentText />
                    }
                </div>

                <div className="announcement-card-info"><h3><MdContactPage /> {props.De}</h3>
                    <p>J'ai {props.Type === 1 ? "trouvé" : "perdu"}  le document : <b>{props.Nom}</b></p>
                    <p>Portant le code : <b>{props.Code}</b></p>
                    <p>Le : <b>{new Date(props.Le).toLocaleDateString()}</b></p>
                </div>

                <Link to={"/Announcement?id=" + props.id} className="announcement-card-go">
                    <MdOutlineReadMore />
                </Link>

            </div>
        </>
    )
}