import React from 'react';

export const Comment = (props) => {
  return (
    <div className="comment-card">
        <img src={require(props.pfp + "")} alt="" />
        <div className="comment-text">
            <b>{props.nom + " " + props.prenom}</b>
            <p>{props.text}</p>
        </div>
    </div>
  )
}