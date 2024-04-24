import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import { AnnouncementCard } from './AnnouncementCard';
import { HiDocumentSearch } from 'react-icons/hi';
import { MdFilterAlt } from 'react-icons/md';

const Announcements = () => {

    let query = new URLSearchParams(window.location.search);
    if (query.get("search") == null || query.get("search") === "undefined" || query.get("search") === "") window.location.replace("/Erreur");

    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        document.getElementById("search").value = query.get("search");
        fetchAnnouncements().then((data) => setAnnouncements(data));
    }, []);

    async function fetchAnnouncements() {
        const response = await fetch('http://localhost:8084/annonce/getAnnoncesBySearch?search=' + query.get("search"))
        return response.json();
    }

    return (
        <>
            <Header loggedIn={sessionStorage.getItem("id") == null ? false : true} />

            <main className="announcements-main">


                <section style={{ display: "none" }} className="announcements-filter">
                    SEARCH FILTER <MdFilterAlt />
                </section>


                <section>

                    <form className="announcements-search" method="get">
                        <input type="text" id="search" name="search" placeholder="Recherche .."></input>
                        <button type="submit"><HiDocumentSearch /></button>
                    </form>

                    {announcements.length !== 0 ?

                        announcements.map((ann) => (
                            <>
                                <AnnouncementCard key={ann.id} id={ann.id} Nom={ann.document.nomDocument} De={ann.document.nomProprietaire} Code={ann.document.numDocument} Type={ann.typeAnnonce} Le={ann.at} />
                            </>
                        )) :

                        <p className="no-result">
                            Désolé, aucun résultat trouvé!
                        </p>
                    }
                </section>

            </main>
            <Footer class="mainFooter" />
        </>
    )
}

export default Announcements;