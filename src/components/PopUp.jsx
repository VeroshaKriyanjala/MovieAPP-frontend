import React, { useState } from "react";

const PopUp = ({ onClose, onSave, editingUser }) => {
    const [name, setName] = useState(editingUser ? editingUser.name : "");
    const [email, setEmail] = useState(editingUser ? editingUser.email : "");

    const handleSave = () => {
        if (name.trim() && email.trim()) {
            if (editingUser) {
                onSave(editingUser.id, name, email); // 🔹 Pass `id` for update
            } else {
                onSave(name, email); // 🔹 No `id` for new user
            }
            onClose();
        } else {
            alert("Please enter a valid name and email.");
        }
    };

    return (
        <div className="popup">
            <h2>{editingUser ? "Edit User" : "Add User"}</h2>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <button onClick={handleSave}>Save</button>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default PopUp;
