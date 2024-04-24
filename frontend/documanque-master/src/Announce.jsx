import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from './Header';
import { Footer } from "./Footer";
import swal from 'sweetalert';

const Announce = () => {

    const [selected, setSelected] = useState("CIN");
    const [prevSelected, setPrevSelected] = useState("CIN");

    let handleChange = () => {
        var e = document.getElementById("nom-document");
        setPrevSelected(selected);
        setSelected(e.value);
    }

    useEffect(() => {
        document.getElementById(prevSelected).style.display = "none";
        document.getElementById(selected).style.display = "grid";
        document.getElementById("vos-donnees").style.display = sessionStorage.getItem("id") != null ? "none" : "";
    }, [selected]);

    let postAnonymousAnnonce = async () => {
        const response = await fetch("http://localhost:8084/annonce/postAnonymousAnnonce", {
            method: 'POST',
            body: JSON.stringify({
                typeAnnonce: document.getElementById("trv").checked ? 1 : 0,
                nomDocument: document.getElementById("nom-document").value,
                nomDocumentAtr: document.getElementById("nom-document-atr") != null && document.getElementById("nom-document-atr").value,
                numDocument: document.getElementById("num-document-" + selected) != null ? document.getElementById("num-document-" + selected).value : null,
                nomProprietaire: document.getElementById("nom-proprietaire-" + selected).value,
                dateNaissance: document.getElementById("date-naissance-" + selected) != null ? document.getElementById("date-naissance-" + selected).value : null,
                lieuNaissance: document.getElementById("lieu-naissance-" + selected) != null ? document.getElementById("lieu-naissance-" + selected).value : null,
                nomBank: document.getElementById("nom-bank") != null ? document.getElementById("nom-bank").value : null,
                typeDiplome: document.getElementById("type-diplome") != null ? document.getElementById("type-diplome").value : null,
                idAnnouncer: 0,
                nomAnnouncer: document.getElementById("nom-announcer").value,
                prenomAnnouncer: document.getElementById("prenom-announcer").value,
                telAnnouncer: document.getElementById("tel-announcer").value,
                emailAnnouncer: document.getElementById("email-announcer").value,
                publishingTime : new Date()
            }),
            headers: {
                'Content-type': 'application/json ;charset=UTF-8'
            }
        });
        if (response.status >= 400 && response.status < 500) await swal({
            title: "Erreur",
            text: "Veuillez revérifier les informations que vous avez insérées.",
            icon: "warning"
        })
        else if (response.status >= 500) await swal({
            title: "Erreur",
            text: "Une erreur de serveur interne s'est produite, veuillez réessayer plus tard.",
            icon: "warning"
        })
        else {
            const data = await response.json();
            const announce = JSON.parse(JSON.stringify(data));
            switch (announce.id) {
                case '-1':
                    await swal({
                        title: "Erreur",
                        text: "Un utilisateur avec les données (Email / Numéro de télephone) existe déja, vous pouvez vous connecter.",
                        icon: "warning"
                    })
                    break;
                case '-2':
                    await swal({
                        title: "Erreur",
                        text: "Veuillez vérifier les données insérées.",
                        icon: "warning"
                    })
                    break;
                case '-3':
                    //LEAVE IT FOR SOME ERROR HANDLING
                    break;
                default:
                    await swal("Votre annonce a été publié avec succes!");
                    window.location.href = "/Announcement?id=" + announce.id;
            }
        }
    }
    let postAnnonce = async () => {
        const response = await fetch("http://localhost:8084/annonce/postAnnonce", {
            method: 'POST',
            body: JSON.stringify({
                typeAnnonce: document.getElementById("trv").checked ? 1 : 0,
                nomDocument: document.getElementById("nom-document").value,
                nomDocumentAtr: document.getElementById("nom-document-atr") != null && document.getElementById("nom-document-atr").value,
                numDocument: document.getElementById("num-document-" + selected) != null ? document.getElementById("num-document-" + selected).value : null,                nomProprietaire: document.getElementById("nom-proprietaire-" + selected).value,
                dateNaissance: document.getElementById("date-naissance-" + selected) != null ? document.getElementById("date-naissance-" + selected).value : null,
                lieuNaissance: document.getElementById("lieu-naissance-" + selected) != null ? document.getElementById("lieu-naissance-" + selected).value : null,
                nomBank: document.getElementById("nom-bank") != null ? document.getElementById("nom-bank").value : null,
                typeDiplome: document.getElementById("type-diplome") != null ? document.getElementById("type-diplome").value : null,
                idAnnouncer: sessionStorage.getItem("id"),
                nomAnnouncer: null,
                prenomAnnouncer: null,
                telAnnouncer: null,
                emailAnnouncer: null,
                publishingTime : new Date()
            }),
            headers: {
                'Content-type': 'application/json ;charset=UTF-8'
            }
        });
        if (response.status >= 400 && response.status < 500) await swal({
            title: "Erreur",
            text: "Veuillez revérifier les informations que vous avez insérées.",
            icon: "warning"
        })
        else if (response.status >= 500) await swal({
            title: "Erreur",
            text: "Une erreur de serveur interne s'est produite, veuillez réessayer plus tard.",
            icon: "warning"
        })
        else {
            const data = await response.json();
            const announce = JSON.parse(JSON.stringify(data));
            await swal("Votre annonce a été publié avec succes!");
            window.location.href = "/Announcement?id=" + announce.id;
        }
    }
    return (
        <>
            <Header loggedIn={sessionStorage.getItem("id") == null ? false : true} />
            <main className="announce-container">

                <div className="announce-form" id="Announce" action="Announce" method="post" style={{ display: "flex" }}>
                    <legend className="ms-suggestion">PUBLIER UNE ANNONCE</legend>
                    <div className="radio-input">
                        <input id="prd" type="radio" name="type-annonce"></input>
                        <label htmlFor="prd">J'ai <b>perdu</b> un document!</label>
                    </div>
                    <div className="radio-input">
                        <input id="trv" type="radio" name="type-annonce" ></input>
                        <label htmlFor="trv">J'ai <b>trouver</b> un document!</label>
                    </div>
                    <select id="nom-document" onChange={handleChange} name="nom-document">
                        <option value="CIN">Carte d'identité</option>
                        <option value="PRM">Permis de conduire</option>
                        <option value="PSP">Passeport</option>
                        <option value="BNK">Carte bancaire</option>
                        <option value="DIP">Diplome</option>
                        <option value="ATR">Autre</option>
                    </select>

                    <fieldset id="CIN" className="fieldset doc-fieldset">
                        <legend style={{ marginLeft: "30px" }}>Les données de la carte</legend>
                        <input type="text" maxLength={100} id="nom-proprietaire-CIN" name="nom-proprietaire" placeholder="Nom du propriétaire .." required></input>
                        <div className="naissance-label">
                            <label htmlFor="date-naissance">Né le </label>
                            <input type="date" id="date-naissance-CIN" name="date-naissance" required></input>
                        </div>
                        <input type="text" maxLength={100} id="lieu-naissance-CIN" name="lieu-naissance" placeholder="A .." required></input>
                        <input type="text" maxLength={100} id="num-document-CIN" name="num-document" placeholder="CIN .." required></input>
                    </fieldset>

                    <fieldset id="PRM" className="fieldset doc-fieldset">
                        <legend style={{ marginLeft: "30px" }}>Les données du permis</legend>
                        <input type="text" maxLength={100} id="nom-proprietaire-PRM" name="nom-proprietaire" placeholder="Nom du propriétaire .." required></input>
                        <div className="naissance-label">
                            <label htmlFor="date-naissance">Né le </label>
                            <input type="date" id="date-naissance-PRM" name="date-naissance" required></input>
                        </div>
                        <input type="text" maxLength={100} id="lieu-naissance-PRM" name="lieu-naissance" placeholder="A .." required></input>
                        <input type="text" maxLength={100} id="num-document-PRM" name="num-document" placeholder="Numéro .." required></input>
                    </fieldset>

                    <fieldset id="PSP" className="fieldset doc-fieldset">
                        <legend style={{ marginLeft: "30px" }}>Les données du passeport</legend>
                        <input type="text" maxLength={100} id="nom-proprietaire-PSP" name="nom-proprietaire" placeholder="Nom du propriétaire .." required></input>
                        <div className="naissance-label">
                            <label htmlFor="date-naissance">Né le </label>
                            <input type="date" id="date-naissance-PSP" name="date-naissance" required></input>
                        </div>
                        <input type="text" maxLength={100} id="lieu-naissance-PSP" name="lieu-naissance" placeholder="A .." required></input>
                        <input type="text" maxLength={100} id="num-document-PSP" name="num-document" placeholder="Numéro de passeport .." required></input>
                    </fieldset>

                    <fieldset id="BNK" className="fieldset doc-fieldset">
                        <legend style={{ marginLeft: "30px" }}>Les données du carte bancaire</legend>
                        <input type="text" maxLength={100} id="nom-proprietaire-BNK" name="nom-proprietaire" placeholder="Nom du propriétaire .." required></input>
                        <select id="nom-bank" name="nom-bank">
                            <option value="ATTIJARIWAFA BANK">ATTIJARIWAFA BANK</option>
                            <option value="AL BARID BANK">AL BARID BANK</option>
                            <option value="BANK OF AFRICA">BANK OF AFRICA</option>
                            <option value="CIH">CIH</option>
                            <option value="BMCI">BMCI</option>
                            <option value="CREDIT DU MAROC">CREDIT DU MAROC</option>
                            <option value="NON SPÉCIFIÉ">Autre</option>
                        </select>
                    </fieldset>

                    <fieldset id="DIP" className="fieldset doc-fieldset">
                        <legend style={{ marginLeft: "30px" }}>Les données du diplome</legend>
                        <input type="text" maxLength={100} id="nom-proprietaire-DIP" name="nom-proprietaire" placeholder="Nom du propriétaire .." required></input>
                        <div className="naissance-label">
                            <label htmlFor="date-naissance">Né le </label>
                            <input type="date" id="date-naissance-DIP" name="date-naissance" required></input>
                        </div>
                        <select id="type-diplome" name="type-dip">
                            <option value="BAC">BAC</option>
                            <option value="DEUG">DEUG</option>
                            <option value="DEUP">DEUP</option>
                            <option value="DEUST">DEUST</option>
                            <option value="DUT">DUT</option>
                            <option value="BTS">BTS</option>
                            <option value="Licence">Licence</option>
                            <option value="Master">Master</option>
                            <option value="Doctorat">Doctorat</option>
                        </select>
                        <input type="text" maxLength={100} id="num-document-DIP" name="num-document" placeholder="Numéro/Code de diplome .." required></input>
                    </fieldset>

                    <fieldset id="ATR" className="fieldset doc-fieldset">
                        <legend style={{ marginLeft: "30px" }}>Les données du document</legend>
                        <input type="text" maxLength={100} id="nom-document-atr" name="nom-document-atr" placeholder="Nom de Document .." required></input>
                        <input type="text" maxLength={100} id="num-document-ATR" name="num-document" placeholder="Numéro/Code du document .." required></input>
                        <input style={{ gridColumn: "1 / span 2" }} type="text" maxLength={100} id="nom-proprietaire-ATR" name="nom-proprietaire" placeholder="Nom du personne concernée .." required></input>
                    </fieldset>

                    <fieldset id="vos-donnees" name="announcer-info" className="fieldset">
                        <legend style={{ marginLeft: "30px" }}>Vos Données</legend>
                        <p style={{ gridColumn: "1 / span 2", fontSize: "12px", marginTop: "8px" }}>Assurez-vous que toutes les informations sont correctes, elles seront utilisées pour entrer en contact avec vous par toute personne intéressée!</p>
                        <input type="text" maxLength={100} id="nom-announcer" name="nom-announcer" placeholder="Nom .." required></input>
                        <input type="text" maxLength={100} id="prenom-announcer" name="prenom-announcer" placeholder="Prénom .." required></input>
                        <input type="tel" id="tel-announcer" name="tel-announcer" placeholder="Numéro de téléphone .." required></input>
                        <input placeholder="Email .." type="email" id="email-announcer" name="email-announcer" required></input>
                        <span className="stay-connected">Connectez/Inscrivez-vous et utilisez votre compte
                            <Link to="/SignIn">En Cliqaunt Ici</Link>
                        </span>
                    </fieldset>

                    <button name="submit" onClick={sessionStorage.getItem("id") === null ? postAnonymousAnnonce:postAnnonce}>Publier l'annonce</button>
                </div>

            </main>
            <Footer class="mainFooter" />
        </>
    );
}

export default Announce; 