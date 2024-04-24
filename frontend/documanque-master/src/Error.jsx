import React from 'react'
import './Error.css'
import { Link } from 'react-router-dom'
import { BiErrorAlt } from 'react-icons/bi'

const Error = () => {

  document.title = "ERREUR 404";

  return (
      <main className='ErrorBody'>
        <h1><BiErrorAlt /></h1>
        <h6>ERREUR</h6>
        <p>Désolé, cette page n'est pad disponible.</p>
        <Link to="/"><button>Retour à l'acceuil</button></Link>
      </main>
  )
}

export default Error;