import React, { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import PopUp from "../components/PopUp";

const User = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://192.168.49.2:30007/api/getusers");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (name, email) => {
    const newUser = { name, email };

    try {
      const response = await fetch("http://192.168.49.2:30007/api/adduser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to add user: ${errorMessage}`);
      }

      const savedUser = await response.json();

      if (!savedUser.data || !savedUser.data.id) {
        throw new Error("Invalid response from server");
      }

      setUsers((prevUsers) => [...prevUsers, savedUser.data]);

      console.log("User added successfully:", savedUser.data);
    } catch (error) {
      console.error("Error adding user:", error.message);
      alert(error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`http://192.168.49.2:30007/api/deleteuser/${id}`, {
        method: "DELETE",
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const handleUpdateUser = async (id, name, email) => {
    try {
      const response = await fetch(
        `http://192.168.49.2:30007/api/updateuser/${id}`,
        {
          // 🔹 Use dynamic `id`
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update user: ${errorMessage}`);
      }

      const updatedUser = await response.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id
            ? {
                ...user,
                name: updatedUser.data.name,
                email: updatedUser.data.email,
              }
            : user
        )
      );

      console.log("User updated successfully:", updatedUser.data);
    } catch (error) {
      console.error("Error updating user:", error.message);
      alert(error.message);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="page-container">
      <h1>User Page</h1>
      <button
        onClick={() => {
          setEditingUser(null);
          setShowPopup(true);
        }}
      >
        Add User
      </button>

      {showPopup && (
        <PopUp
          onClose={() => setShowPopup(false)}
          onSave={editingUser ? handleUpdateUser : handleAddUser}
          editingUser={editingUser}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={handleDeleteUser}
              onUpdate={() => {
                setEditingUser(user);
                setShowPopup(true);
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
