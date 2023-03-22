import React, { useState,useEffect } from "react";
import Person from './Person';
import personService from '../services/persons';
import Notification from "./Notifications";

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage,setErrorMessage]=useState(null)
  const handleNoteChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNoteChange1 = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)

  }

  const addPersons = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      const result = window.confirm(
        `${newName} ya está en la lista de contactos. ¿Quieres actualizar su número?`
      );
      if (result) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : response
              )
            );
            setNewName("");
            setNewNumber("");
            setErrorMessage(`Updated ${newName} `);
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };
      personService.create(personObject).then((response) => {
        setPersons(persons.concat(response));
        setNewName("");
        setNewNumber("");
        setErrorMessage(`Added ${newName}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
    }
  };

  useEffect(() => {
    personService
    .getAll()
    .then(response=>{setPersons(response)})
  })

  const deleteContact = (id) => {
    const result = window.confirm("¿Estás seguro de que quieres eliminar este contacto?");
    if (result) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          setErrorMessage(`the contact ${persons.name} was already existed`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          setPersons(persons.filter((x) => x.id !== id));
        });
    }
  };

  return (
    <div>
      <h2>PhoneBook</h2>
      <Notification message={errorMessage}/>
      
      <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search..."></input>

      <h2>Add</h2>

      <form onSubmit={addPersons}>
        <div>
          <input value={newName} onChange={handleNoteChange} />
          <br></br>
          <input value={newNumber} onChange={handleNoteChange1} />
        </div>
        <div>
          <button type='submit'>Add</button>
        </div>
      </form>

      <h2>Numbers</h2>

      <ul>
        {persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase())).map(person => (
          <Person key={person.name} person={person} deleteContact={()=>deleteContact(person.id)}/>
        ))}
      </ul>


    </div>
  )
}

export default App