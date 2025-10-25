import React, { useState } from 'react'

const AddUserForm = (props) => {
  const initialFormState = { id: null, name: '', username: '' }
  const [user, setUser] = useState(initialFormState)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!user.name || !user.username) return
    props.addUser(user)
    setUser(initialFormState)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleInputChange}
          placeholder="Enter name"
        />
      </div>

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleInputChange}
          placeholder="Enter username"
        />
      </div>

      <button className="button">Add New User</button>
    </form>
  )
}

export default AddUserForm
