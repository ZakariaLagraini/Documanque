import React from "react"

const Search = () => {

    return (
        <>
        <form action="/Announcements" method="get" className="searchBox">
            <h1>Avez-vous perdu un document?</h1>
            <p>Vérifiez si quelqu'un a annoncé qu'il a retrouvé votre document perdu.
                <br/><b>Insérez un code, un nom ou toute information significative</b> que contient le document.
                <br/><br/>Si vous n'arrivez pas à le retrouver, vous pouvez <a href="/Announce">signaler un document manquant</a> !</p>
            <input type="text" name="search" placeholder="Inserez ici .." ></input>
        </form>
        </>
    )

}

export default Search;