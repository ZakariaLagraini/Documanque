import React, { useState, useEffect } from "react";
import Header from "./Header";
import swal from 'sweetalert';
import { RiContactsFill, RiMailFill, RiPhoneFill, RiLockFill } from 'react-icons/ri';
const SignIn = () => {

    if (sessionStorage.getItem("id") != null) window.location.href = "/";

    let [clicked, setClicked] = useState(false);

    useEffect(() => {
        let signUpForm = document.getElementById("signUp");
        let signInForm = document.getElementById("signIn");
        if (clicked) {
            signUpForm.style.display = "flex ";
            signInForm.style.display = "none ";
        }
        if (!clicked) {
            signInForm.style.display = "flex ";
            signUpForm.style.display = "none";
        }
    }, [clicked]);

    async function sha256(message) {
        // encode as UTF-8
        const msgBuffer = new TextEncoder().encode(message);

        // hash the message
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // convert bytes to hex string                  
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    function makeToken(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    let createAccount = async () => {

        let suNom = document.getElementById("su-nom").value.trim();
        let suPrenom = document.getElementById("su-prenom").value.trim();
        let suEmail = document.getElementById("su-email").value.trim();
        let suTel = document.getElementById("su-tel").value.trim();
        let suPassword = document.getElementById("su-password").value.trim();

        document.getElementById("suwarning").replaceChildren();

        if (suNom === "" || suPrenom === "" || suEmail === "" || suTel === "" || suPassword === "") {
            let ppp = document.createElement("p");
            ppp.textContent = "* Tous les champs doivent être remplis";
            document.getElementById("suwarning").appendChild(ppp);
        }
        else if (suPassword.length < 8) {
            let pp = document.createElement("p");
            pp.textContent = "* Le mot de passe doit comporter au moins 8 caractères";
            document.getElementById("suwarning").appendChild(pp);
        }
        else {
            const response = await fetch('http://localhost:8084/utilisateur/signUp', {
                method: 'POST',
                body: JSON.stringify({
                    nom: suNom,
                    prenom: suPrenom,
                    email: suEmail,
                    tel: suTel,
                    password: await sha256(suPassword),
                    token: makeToken(60),
                    createdAt: new Date()
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
            })

            if (response.status >= 400 && response.status < 500) await swal({
                title: "Erreur",
                text: "Veuillez revérifier les informations que vous avez insérées.",
                icon: "warning"
            })
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
                    text: "Un compte avec cet E-mail/Numéro de téléphone existe déjà!",
                    icon: "warning"
                })
                else if (user.id === '-2') await swal({
                    title: "Erreur",
                    text: "Veuillez insérer un numéro de téléphone valide!",
                    icon: "warning"
                })
                else if (user.id === '-4') await swal({
                    title: "Erreur",
                    text: "Veuillez insérer une adresse e-mail valide!",
                    icon: "warning"
                })
                else {
                    await swal("Un compte pour l'utilisateur : " + user.nom + " " + user.prenom + " avec l'email : " + user.email + " a été créé! \n Veuillez confirmer votre compte en utilisant l'e-mail qui vous a été envoyé.");
                    window.location.reload();
                }
            }
        }
    }

    let logIn = async () => {
        let siEmail = document.getElementById("si-email").value.trim();
        let siPass = document.getElementById("si-password").value.trim();

        document.getElementById("siwarning").replaceChildren();

        if (siEmail === null || siEmail === "") {
            let p = document.createElement("p");
            p.textContent = "* Tous les champs doivent être remplis";
            document.getElementById("siwarning").appendChild(p);
        }
        else if (siPass.length < 8) {
            let pp = document.createElement("p");
            pp.textContent = "* Le mot de passe doit comporter au moins 8 caractères";
            document.getElementById("siwarning").appendChild(pp);
        }
        else {
            const response = await fetch('http://localhost:8084/utilisateur/logIn', {
                method: 'POST',
                body: JSON.stringify({
                    email: siEmail,
                    password: await sha256(siPass)
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            })

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
                const user = await JSON.parse(JSON.stringify(data));
                if (user == null) await swal({
                    title: "Erreur",
                    text: "Il n'existe aucun compte avec les données insérées!",
                    icon: "warning",
                    dangerMode: true,
                })
                else if (user.id === "-3") await swal({
                    title: "Erreur",
                    text: "Votre compte n'est pas encore vérifier!",
                    icon: "warning",
                    dangerMode: true,
                })
                else {
                    sessionStorage.setItem("id", user.id);
                    sessionStorage.setItem("nom", user.nom);
                    sessionStorage.setItem("prenom", user.prenom);
                    sessionStorage.setItem("email", user.email);
                    sessionStorage.setItem("tel", user.tel);
                    sessionStorage.setItem("is_pub", user.pub);
                    sessionStorage.setItem("pfp", "./sources/userPfp.png") //TOBE CHANGED
                    window.location.reload();
                }
            }
        }
    }
    return (
        <>
            <Header></Header>
            <main className="sign-in-container">

                <div className="sign-in-form" id="signUp" style={{ display: "flex" }}>
                    <legend>Créer un nouveau compte</legend>
                    <fieldset>
                        <label><RiContactsFill /></label>
                        <input id="su-nom" type="text" name="nom" placeholder="Nom .." required></input>
                    </fieldset>
                    <fieldset>
                        <label><RiContactsFill /></label>
                        <input id="su-prenom" type="text" name="prenom" placeholder="Prénom .." required></input>
                    </fieldset>
                    <fieldset>
                        <label><RiMailFill /></label>
                        <input id="su-email" type="email" name="email" placeholder="Email .." required></input>
                    </fieldset>
                    <fieldset>
                        <label><RiPhoneFill /></label>
                        <input minLength={10} id="su-tel" type="text" name="tel" placeholder="Numero de téléphone .." required></input>
                    </fieldset>
                    <fieldset>
                        <label><RiLockFill /></label>
                        <input id="su-password" minLength={8} type="password" name="password" placeholder="Mot de passe .." required></input>
                    </fieldset>
                    <div id="suwarning"></div>
                    <button className="connect" onClick={() => createAccount()}>Créer un compte</button>
                </div>

                <div className="sign-in-form tmg70" id="signIn" style={{ display: "flex" }}>
                    <legend>Connéxion</legend>
                    <fieldset>
                        <label><RiMailFill /></label>
                        <input id="si-email" type="email" name="email" placeholder="Email .." required></input>
                    </fieldset>
                    <fieldset>
                        <label><RiLockFill /></label>
                        <input id="si-password" minLength={8} type="password" name="password" placeholder="Mot de passe .." required></input>
                    </fieldset>
                    <div id="siwarning"></div>
                    <button className="connect" onClick={() => logIn()}>Se connecter</button>
                </div>

                <p style={{ marginTop: "10px" }}>{clicked ? "Avez-vous déja un compte ? Vous pouvez " : "Vous n'avez pas de compte ? Vous pouvez "}
                    <button onClick={() => setClicked(!clicked)}>{clicked ? "vous connécter" : "créer un compte"}</button></p>

            </main>
        </>
    );
}
export default SignIn;