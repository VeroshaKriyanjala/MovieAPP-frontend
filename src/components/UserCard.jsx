import React from "react";

const UserCard = ({ user, onDelete, onUpdate }) => {
  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <button onClick={() => onUpdate(user)}>Update</button>
        <button onClick={() => onDelete(user.id)}>Delete</button>
      </td>
    </tr>
  );
};

export default UserCard;
