import React, { useState,useEffect } from "react";
import Person from './Person';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const handleNoteChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNoteChange1 = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)

  }

  const addPersons = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name.includes(newName))) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber,
      }

      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')


    }

    

    //console.log('BUtton clicked',event)
  }
  useEffect(() => {
    console.log('Entro al effect')
    axios
      .get("http://localhost:3001/persons")
      .then(response => {
        console.log('Entro al then')
        setPersons(response.data)
      })
  })

  return (
    <div>
      <h2>PhoneBook</h2>
      
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
          <Person key={person.name} person={person} />
        ))}
      </ul>


    </div>
  )
}

export default App