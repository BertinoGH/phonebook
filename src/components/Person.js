import React from "react";

const Person = ({ person, deleteContact }) => {
    const label = "delete"
    return (
        <li className="contact">
            {person.name}, {person.number}
            <button onClick={deleteContact}>{label}</button>
        </li>
    )
}

export default Person
