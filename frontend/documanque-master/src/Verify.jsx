import React, { useEffect, useState } from 'react'

const Verify = () => {

    let query = new URLSearchParams(window.location.search);
    if (query.get("token") == null || query.get("token") === "undefined" || query.get("token") === "") window.location.replace("/Erreur");

    if (sessionStorage.getItem("id") != null) sessionStorage.clear();

    async function fetchVerification() {
        const response = await fetch('http://localhost:8084/utilisateur/verify?token=' + query.get("token"));
        return response.json();
    }

    const [verificationId, setVerificationId] = useState({});

    useEffect(() => {
        fetchVerification().then((data) => {
            setVerificationId(JSON.parse(JSON.stringify(data)));
            console.log(verificationId);
        })
    }, []);

    return ( verificationId !== "undefined" && verificationId !== null &&
        <div className="verification-card">
            {
                verificationId.id === "-1" ? <h2>Le code de vérification est invalide</h2>
                : verificationId.id === "-2" ? <h2>Votre compte est vérifié!</h2>
                    : <h2>Votre compte a été vérifié avec succès!</h2>
            }
            <a href="/SignIn">Retour à la page de connexion</a>
        </div>

    )

}

export default Verify;