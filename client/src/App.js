import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]); 
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [editingUser, setEditingUser] = useState(null);
  const notify = (message) => toast(message);
  
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/get');
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers(); 
  }, []);

  const handleAddClick = () => {
    setEditingUser(null); 
    setShowForm(true);
  };

  const handleCloseClick = () => {
    setShowForm(false); 
    setEditingUser(null); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update the user
        const response = await axios.put(`http://localhost:8080/update`, { 
          id: editingUser._id, ...formData 
        });
        //alert('User updated successfully!');
        toast.success("User updated successfully!");

      } else {
        // Create new user
        const response = await axios.post('http://localhost:8080/create', formData);
        //alert('User created successfully!');
        toast.success("User created successfully!");
      }

      setShowForm(false);
      setFormData({ name: '', email: '', phone: '' });
      fetchUsers(); 
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error saving user.');
    }
  };

  const handleEditClick = (user) => {
    setFormData({ name: user.name, email: user.email, phone: user.phone });
    setEditingUser(user); // Set user to be edited
    setShowForm(true); // Show form in edit mode
  };

  const handleDeleteClick = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
      if (!confirmDelete) return;
      await axios.delete(`http://localhost:8080/delete/${id}`);
      toast.success("User updated successfully!");
      fetchUsers(); // Re-fetch user list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Error deleting user.");
    }
  };

  return (
    <>
      <div className="container">
        <button className="btn addBtn" onClick={handleAddClick}>Add</button>
        
        {showForm && (
          <div className="addContainer">
            <form className="addForm" method="POST" onSubmit={handleSubmit}>
              <div className="addContainerClose">
                <button type="button" className="btn closeBtn" onClick={handleCloseClick}>X</button>
              </div>

              <label htmlFor="name">Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your Name"
                required
                value={formData.name}
                onChange={handleChange}
              />

              <label htmlFor="email">Email:</label>
              <input
                type="text"
                name="email"
                placeholder="Enter your Email"
                required
                value={formData.email}
                onChange={handleChange}
              />  

              <label htmlFor="phone">Phone:</label>
              <input
                type="number"
                name="phone"
                placeholder="Enter your Phone"
                required
                value={formData.phone}
                onChange={handleChange}
              />

              <button type="submit" className="btn submitBtn">
                {editingUser ? 'Update' : 'Submit'} {/* Change button text based on edit or create */}
              </button>
            </form>
          </div>
        )}
        
        <h1>Users List</h1>
        <div className="tableContainer">
          <table className="userTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th> {}
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <button className="btn editBtn" onClick={() => handleEditClick(user)}>Edit</button>
                      <button className="btn deleteBtn" onClick={() => handleDeleteClick(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ToastContainer position="bottom-right"/>
      </div>
    </>
  );
}

export default App;
