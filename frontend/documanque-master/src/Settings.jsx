import React, { useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import swal from 'sweetalert';
import { RiContactsFill, RiMailFill, RiPhoneFill, RiLockFill, RiEditBoxFill, RiDeleteBin2Fill } from 'react-icons/ri';

const Settings = () => {

  if (sessionStorage.getItem("id") == null) window.location.href = "/SignIn";

  let user = {
    id: sessionStorage.getItem("id"),
    nom: sessionStorage.getItem("nom"),
    prenom: sessionStorage.getItem("prenom"),
    email: sessionStorage.getItem("email"),
    tel: sessionStorage.getItem("tel"),
    pfp: require("" + sessionStorage.getItem("pfp")),
    is_pub: sessionStorage.getItem("is_pub")
  };

  useEffect(() => {

    user = {
      id: sessionStorage.getItem("id"),
      nom: sessionStorage.getItem("nom"),
      prenom: sessionStorage.getItem("prenom"),
      email: sessionStorage.getItem("email"),
      tel: sessionStorage.getItem("tel"),
      pfp: require("" + sessionStorage.getItem("pfp")),
      is_pub: sessionStorage.getItem("is_pub")
    };

    document.getElementById("is_pub").checked = user.is_pub === "true";
    document.getElementById("email").value = user.email;
    document.getElementById("nom").value = user.nom;
    document.getElementById("prenom").value = user.prenom;
    document.getElementById("tel").value = user.tel;
  })

  let deletePfp = () => {
    let check = window.confirm("Êtes-vous sûr de vouloir supprimer la photo de profil ? ?");
    console.log(check);
  };

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

  let changeInfo = async () => {
    if (document.getElementById("is_pub").checked === (sessionStorage.getItem("is_pub") === "true")
      && document.getElementById("email").value === sessionStorage.getItem("email")
      && document.getElementById("nom").value === sessionStorage.getItem("nom")
      && document.getElementById("prenom").value === sessionStorage.getItem("prenom")
      && document.getElementById("tel").value === sessionStorage.getItem("tel")) {
      window.alert("Vous n'avez apporté aucune modification!");
    } else {
      const response = await fetch("http://localhost:8084/utilisateur/modifyInfo", {
        method: 'PUT',
        body: JSON.stringify({
          id: user.id,
          nom: document.getElementById("nom").value,
          prenom: document.getElementById("prenom").value,
          email: document.getElementById("email").value,
          tel: document.getElementById("tel").value,
          is_pub: document.getElementById("is_pub").checked,
          password: await sha256(document.getElementById("password").value)
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      });

      if (response.status >= 400 && response.status < 500) window.alert("Veuillez revérifier les informations que vous avez insérées.")
      else if (response.status >= 500) window.alert("Une erreur de serveur interne s'est produite, veuillez réessayer plus tard.")
      else {
        const data = await response.json();
        const result = JSON.parse(JSON.stringify(data));
        if (result.id === '-1') await swal({
          title: "Erreur",
          text: "Vous avez inséré un mauvais mot de passe!",
          icon: "warning"
        })
        else if (result.id === '-2') await swal({
          title: "Erreur",
          text: "Il existe déja un compte avec cet email!",
          icon: "warning"
        })
        else if (result.id === '-3') await swal({
          title: "Erreur",
          text: "Il existe déja un compte avec ce numéro de télephone!",
          icon: "warning"
        })
        else {
          console.log(result)
          sessionStorage.setItem("nom", result.nom);
          sessionStorage.setItem("prenom", result.prenom);
          sessionStorage.setItem("email", result.email);
          sessionStorage.setItem("tel", result.tel);
          sessionStorage.setItem("is_pub", result.pub);
          await swal("Les données ont été modifées avec succes!");
          window.location.reload();
        }
      }
    }
  }

  return (
    <>
      <Header loggedIn={true} />
      <main className="announce-container">

        <div className="announce-form settings-form" >
          <legend>MON COMPTE</legend>

          <div className="settings-profile-pic">
            <img alt="" src={user.pfp}></img>
            <div style={{ display: "flex" }}>
              <input type="file" id="changepfp" style={{ display: "none" }}></input>
              <button type="button" onClick={() => document.getElementById("changepfp").click()}><RiEditBoxFill /></button>
              <button type="button" onClick={() => deletePfp()}><RiDeleteBin2Fill /></button>
            </div>
          </div>

          <div className="settings-nom-prenom settings-input">
            <label><RiContactsFill /></label>
            <input id="nom" name="nom" type="text" placeholder="Nom .. " required></input>
            <input id="prenom" name="prenom" type="text" placeholder="Prénom .." required></input>
          </div>
          <div className="settings-input">
            <label><RiMailFill /></label>
            <input id="email" name="email" type="text" placeholder="Email .." ></input>
          </div>
          <div className="settings-input">
            <label><RiPhoneFill /></label>
            <input id="tel" name="tel" type="text" placeholder="Numéro de téléphone .." required></input>
          </div>
          <div className="settings-checkbox">
            <input name="is_pub" type="checkbox" id="is_pub"></input>
            <label htmlFor="is_pub">Rendre mes coordonnées publiques à tous les visiteurs du site.</label>
          </div>
          <div className="settings-input">
            <label><RiLockFill /></label>
            <input id="password" name="password" type="password" placeholder="Mot de passe .." required></input>
          </div>

          <div className="settings-input">
            <button onClick={changeInfo}>MODIFIER</button>
          </div>
        </div>


      </main>
      <Footer class="mainFooter" />
    </>
  )
}

export default Settings;