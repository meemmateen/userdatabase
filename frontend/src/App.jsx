import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://userdatabase-73e2.vercel.app/api/data';

const App = () => {
    const [data, setData] = useState([]);
    const [form, setForm] = useState({
        first_name: '',
        email: '',
        mobile_number: '',
    });
    const [editMode, setEditMode] = useState(false); // Track edit mode
    const [editId, setEditId] = useState(null); // Store the ID of the user being edited

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get(BASE_URL)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    console.error('Server responded with an error:', error.response.data);
                } else if (error.request) {
                    console.error('Request made but no response received:', error.request);
                } else {
                    console.error('Error setting up request:', error.message);
                }
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            // Update user
            axios.put(`${BASE_URL}/${editId}`, form)
                .then(() => {
                    fetchData(); // Refresh data
                    setForm({ first_name: '', email: '', mobile_number: '' });
                    setEditMode(false);
                    setEditId(null);
                })
                .catch((error) => {
                    if (error.response) {
                        console.error('Server responded with an error:', error.response.data);
                    } else if (error.request) {
                        console.error('Request made but no response received:', error.request);
                    } else {
                        console.error('Error setting up request:', error.message);
                    }
                });
        } else {
            // Add user
            axios.post(BASE_URL, form)
                .then(() => {
                    fetchData(); // Refresh data
                    setForm({ first_name: '', email: '', mobile_number: '' }); // Clear form
                })
                .catch((error) => {
                    if (error.response) {
                        console.error('Server responded with an error:', error.response.data);
                    } else if (error.request) {
                        console.error('Request made but no response received:', error.request);
                    } else {
                        console.error('Error setting up request:', error.message);
                    }
                });
        }
    };

    const handleEdit = (user) => {
        setEditMode(true);
        setEditId(user.id);
        setForm({ first_name: user.first_name, email: user.email, mobile_number: user.mobile_number });
    };

    const handleCancelEdit = () => {
        // Reset form and exit edit mode
        setEditMode(false);
        setEditId(null);
        setForm({ first_name: '', email: '', mobile_number: '' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            axios.delete(`${BASE_URL}/${id}`)
                .then(() => {
                    fetchData(); // Refresh data
                })
                .catch((error) => {
                    if (error.response) {
                        console.error('Server responded with an error:', error.response.data);
                    } else if (error.request) {
                        console.error('Request made but no response received:', error.request);
                    } else {
                        console.error('Error setting up request:', error.message);
                    }
                });
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>{editMode ? 'Edit User' : 'Add User'}</h1>
            
            {/* Form Section */}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="text"
                    name="mobile_number"
                    placeholder="Mobile Number"
                    value={form.mobile_number}
                    onChange={handleChange}
                    style={styles.input}
                />
                <div>
                    <button type="submit" style={styles.button}>
                        {editMode ? 'Update User' : 'Add User'}
                    </button>
                    {editMode && (
                        <button type="button" onClick={handleCancelEdit} style={styles.cancelButton}>
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            {/* Data Table */}
            <h2 style={styles.subHeading}>Stored Data</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>First Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Mobile Number</th>
                        <th style={styles.th}>Created At</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td style={styles.td}>{item.id}</td>
                            <td style={styles.td}>{item.first_name}</td>
                            <td style={styles.td}>{item.email}</td>
                            <td style={styles.td}>{item.mobile_number}</td>
                            <td style={styles.td}>{new Date(item.created_at).toLocaleString()}</td>
                            <td className='flex ' style={styles.td}>
                                <button onClick={() => handleEdit(item)} style={styles.editButton}>Edit</button>
                                <button onClick={() => handleDelete(item.id)} style={styles.deleteButton}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Inline styles
const styles = {
    container: {
        fontFamily: "'Arial', sans-serif",
        padding: '20px',
        backgroundColor: '#f9f9f9',
        color: '#333',
        maxWidth: '800px',
        margin: '0 auto',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        textAlign: 'center',
        fontSize: '20px',
        marginBottom: '20px',
        color: '#4CAF50',
    },
    subHeading: {
        marginTop: '30px',
        marginBottom: '10px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#45a049',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
    },
    th: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '10px',
        textAlign: 'left',
        borderBottom: '2px solid #ddd',
    },
    td: {
        padding: '8px',
        textAlign: 'left',
        borderBottom: '1px solid #ddd',
    },

    editButton: {
      padding: '5px 10px',
      backgroundColor: '#2196F3',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '5px',
  },
  deleteButton: {
      padding: '5px 10px',
      backgroundColor: '#f44336',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#ff9800',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px',
},

};

export default App;
