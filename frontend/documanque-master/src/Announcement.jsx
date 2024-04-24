import React, { useEffect, useState } from 'react';
import Header from './Header';
import userPfp from './sources/userPfp.png';
import { MdOutlineMailOutline, MdAccessTimeFilled } from 'react-icons/md';
import { FiPhone } from 'react-icons/fi';
import { FaComments } from 'react-icons/fa';
import { AiOutlineStop } from 'react-icons/ai';
import { RiSendPlane2Fill } from 'react-icons/ri';
import { Footer } from './Footer';
import { Comment } from './Comment';
import swal from 'sweetalert';
// import { FaFacebook, FaTwitter, FaLinkedin, FaShareSquare } from 'react-icons/fa';

const Announcement = () => {

    let query = new URLSearchParams(window.location.search);
    if (query.get("id") == null || query.get("id") === "undefined" || query.get("id") === "") window.location.replace("/Erreur");

    const [announcement, setAnnouncement] = useState({});
    const [comments, setComments] = useState([]);

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


    useEffect(() => {
        fetchAnnouncement().then((data) => setAnnouncement(JSON.parse(JSON.stringify(data))));
        fetchComments().then((data) => setComments(JSON.parse(JSON.stringify(data))));
    }, [])

    async function fetchAnnouncement() {
        const response = await fetch('http://localhost:8084/annonce/getAnnonceById?id=' + query.get("id"));
        return response.json();
    }

    async function fetchComments() {
        const response = await fetch('http://localhost:8084/commentaire/getCommentairesByAnnonce?id=' + query.get("id"));
        return response.json();
    }

    let addComment = async () => {
        let commentaire = document.getElementById("comment-content").value;
        if (commentaire.length <= 0) await swal({
            title: "Erreur",
            text: "Écrivez quelque chose avant d'envoyer!",
            icon: "warning"
        })
        else {
            await fetch("http://localhost:8084/commentaire/addComment", {
                method: 'POST',
                body: JSON.stringify({
                    postedBy: sessionStorage.getItem("id"),
                    postedOn: announcement.id,
                    announcer: announcement.postedBy.id,
                    text: commentaire,
                    date: new Date()
                }),
                headers: {
                    'Content-type': 'application/json ;charset=UTF-8'
                }
            })
            document.getElementById("comment-content").value = "";
            fetchComments().then((data) => setComments(JSON.parse(JSON.stringify(data))));
        }
    }

    return (announcement.postedBy != null &&
        <>
            <Header loggedIn={sessionStorage.getItem("id") == null ? false : true} />
            <main className="profile-main">

                <div className="profile-card">
                    <div name="cover">
                        <img src={userPfp} alt="" />
                    </div>
                    <h1>{announcement.postedBy.nom + " " + announcement.postedBy.prenom}</h1>
                    {announcement.postedBy.pub ?
                        <>
                            <h5 style={{ textAlign: 'center' }}>Coordonnées de l'annonceur : </h5>
                            <p kmeans="persoinfo"><MdOutlineMailOutline style={{ marginRight: '10px' }} /> {announcement.postedBy.email}</p>
                            <hr />
                            <p kmeans="persoinfo"><FiPhone style={{ marginRight: '10px' }} /> {announcement.postedBy.tel}</p>
                        </>
                        : (sessionStorage.getItem("id") == null) ?
                            <div className="must-login">
                                <p>
                                    <span><AiOutlineStop size={"30px"} /></span>
                                    <span>
                                        L'annonceur a rendu ses informations privées.
                                        <br />Vous devez vous connecter pour y accéder!
                                    </span>
                                </p>
                            </div>
                            :
                            <>
                                <h5 style={{ textAlign: 'center' }}>Coordonnées de l'annonceur : </h5>
                                <p kmeans="persoinfo"><MdOutlineMailOutline style={{ marginRight: '10px' }} /> {announcement.postedBy.email}</p>
                                <hr />
                                <p kmeans="persoinfo"><FiPhone style={{ marginRight: '10px' }} /> {announcement.postedBy.tel}</p>
                            </>
                    }
                </div>

                <section>
                    <div className="announcement-post">
                        <h3>{announcement.document.nomDocument + " : " + announcement.document.numDocument}</h3>

                        {announcement.typeAnnonce === 0 ?
                            <p>J'annonce la perte du document :
                                <b> {announcement.document.nomDocument} </b>.</p> :

                            <p>J'ai <b>trouvé</b> le document : <b>{announcement.document.nomDocument}</b>.</p>
                        }

                        {announcement.document.nomDocument === 'Carte bancaire' ?
                            <div>
                                <p>Nom du titulaire	: <b>{announcement.document.nomProprietaire}</b>.</p>
                                <p>Nom de la banque : <b>{announcement.document.nomBank}</b>.</p>
                            </div>
                            : announcement.document.nomDocument === 'Diplome' ?
                                <div>
                                    <p>Titre du diplôme : <b>{announcement.document.typeDiplome}</b>.</p>
                                    <p>Nom du titulaire	: <b>{announcement.document.nomProprietaire}</b>.</p>
                                    <p>Date de naissance du titulaire : <b>{new Date(announcement.document.dateNaissance).toLocaleDateString()}</b>.</p>
                                </div>
                                : announcement.document.nomDocument === 'Carte d\'identité'
                                    || announcement.document.nomDocument === 'Permis de conduire'
                                    || announcement.document.nomDocument === 'Passeport' ?
                                    <div>
                                        <p>Nom du propriétaire : <b>{announcement.document.nomProprietaire}</b>.</p>
                                        <p>Date de naissance du propriétaire : <b>{new Date(announcement.document.dateNaissance).toLocaleDateString()}</b>.</p>
                                        <p>Lieu de naissance du propriétaire : <b>{announcement.document.lieuNaissance}</b>.</p>
                                    </div>
                                    :
                                    <div>
                                        <p>Nom du propriétaire : <b>{announcement.document.nomProprietaire}</b>.</p>
                                    </div>
                        }

                        {announcement.typeAnnonce === 0 ?
                            <p>Si vous avez trouvé le document ou
                                si vous connaissez des informations, merci de me contacter
                                en utilisant les coordonnées que j'ai fournies ici.</p> :

                            <p>Si vous êtes le propriétaire du document ou
                                si vous connaissez le propriétaire, vous pouvez
                                me contacter en utilisant les coordonnées que j'ai fournies ici.</p>
                        }
                        
                        <p><MdAccessTimeFilled style={{ marginRight: "5px" }} /><p> Publié le : <b style={{ marginLeft: "5px", textTransform: "capitalize"}}>{new Date(announcement.at).toLocaleDateString("fr-FR", options) + " " + new Date(announcement.at).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</b></p></p>
                    </div>

                    {/* <div className="share-buttons">
                        <p><FaShareSquare /></p>
                        <button><FaFacebook /> <p>Facebook</p></button>
                        <button><FaTwitter /> <p>Twitter</p></button>
                        <button><FaLinkedin /> <p>LinkedIn</p></button>
                    </div> */}
                    <div id="comments-card" className="comments-card">
                        <span><FaComments /><b>{comments.length}</b> Commentaire{comments.length === 1 ? "" : "s"}</span>
                        <div className="comment-input">
                            <textarea id="comment-content" maxLength={230} placeholder="Laissez un commentaire .."></textarea>
                            <button onClick={() => addComment()}><RiSendPlane2Fill /></button>
                        </div>
                        {
                            comments.length > 0 ?
                                comments.map((comment) => (
                                    <Comment
                                        key={comment.id}
                                        pfp="./sources/userPfp.png"
                                        text={comment.text}
                                        nom={comment.postedBy.nom}
                                        prenom={comment.postedBy.prenom}
                                    ></Comment>
                                ))
                                :
                                <div>
                                    Soyez le premier à commenter!
                                </div>

                        }
                    </div>
                </section>

            </main>
            <Footer class="mainFooter"></Footer>
        </>
    )
}

export default Announcement;