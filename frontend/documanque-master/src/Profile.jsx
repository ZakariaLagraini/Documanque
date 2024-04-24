import React, { useEffect, useState } from 'react'
import Header from './Header';
import { MdOutlineMailOutline, MdDeleteForever } from 'react-icons/md';
import { HiDocumentCheck, HiDocumentMagnifyingGlass } from 'react-icons/hi2';
import swal from 'sweetalert';
import { FiPhone } from 'react-icons/fi';
import { AiFillEye } from 'react-icons/ai';
import { Footer } from './Footer';


let Profile = () => {
    if (sessionStorage.getItem("id") == null) {
        window.location.href = "/SignIn";
    } else {

        const [announcements, setAnnouncements] = useState([]);

        useEffect(() => {
            fetchAnnouncements().then((data) => setAnnouncements(data));
        }, []);

        async function fetchAnnouncements() {
            const response = await fetch('http://localhost:8084/annonce/getAnnoncesByUser?user=' + sessionStorage.getItem("id"))
            return response.json();
        }

        let deleteAnnouncement = async (id) => {
            if (window.confirm("Etes-vous surs ?")) {
                const response = await fetch('http://localhost:8084/annonce/deleteAnnonce?idannonce=' + id + '&iduser=' + sessionStorage.getItem("id"))

                if (response.status >= 500) await swal({
                    title: "Erreur",
                    text: "Une erreur de serveur interne s'est produite, veuillez réessayer plus tard.",
                    icon: "warning"
                })
                else {
                    const data = await response.json()
                    const user = JSON.parse(JSON.stringify(data));
                    if (user.id === '-1') await swal({
                        title: "Erreur",
                        text: "Vous n'avez pas le droit de supprimer cette annonce !",
                        icon: "warning"
                    })
                    else if (user.id === '-2') await swal({
                        title: "Erreur",
                        text: "Une erreur s'est produite, veuillez réessayer plus tard!",
                        icon: "warning"
                    })
                    else {
                        await swal("L'annonce a été supprimée !");
                        window.location.reload();
                    }
                }
            }
        }

        const user = {
            id: sessionStorage.getItem("id"),
            nom: sessionStorage.getItem("nom"),
            prenom: sessionStorage.getItem("prenom"),
            email: sessionStorage.getItem("email"),
            tel: sessionStorage.getItem("tel"),
            pfp: require("" + sessionStorage.getItem("pfp")),
            is_pub: sessionStorage.getItem("is_pub")
        };

        return (
            <>
                <Header loggedIn={true} />
                <main className="profile-main">
                    <div className="profile-card">
                        <div name="cover">
                            <img src={user.pfp} alt="" />
                        </div>
                        <h1>{user.nom + " " + user.prenom}</h1>

                        <p kmeans="persoinfo"><MdOutlineMailOutline style={{ marginRight: '10px' }} /> {user.email}</p>
                        <hr />
                        <p kmeans="persoinfo"><FiPhone style={{ marginRight: '10px' }} /> {user.tel}</p>
                    </div>

                    <div className="announcements-card">
                        <h3>Mes Annonces</h3>
                        {
                            announcements.length !== 0 ?
                                announcements.map((ann) => (
                                    <div key={ann.id} className={ann === announcements[0] ? "announcement first-announcement" : "announcement"}>
                                        <b>{ann.typeAnnonce === 0 ? <><HiDocumentMagnifyingGlass /> MANQUANT</> : <><HiDocumentCheck /> TROUVÉ</>}</b>
                                        <p>{ann.document.nomDocument}</p>
                                        <p>{ann.document.nomProprietaire}</p>
                                        <p>{new Date(ann.at).toLocaleDateString()}</p>
                                        <button onClick={() => window.location.href = "/Announcement?id=" + ann.id}><AiFillEye /></button>
                                        <button onClick={() => deleteAnnouncement(ann.id)}><MdDeleteForever /></button>
                                    </div>
                                )) :
                                <div className="no-announcement">Aucune annonce reliée à ce compte!</div>
                        }
                    </div>
                </main>
                <Footer class="mainFooter"></Footer>
            </>
        )
    }
}

export default Profile;