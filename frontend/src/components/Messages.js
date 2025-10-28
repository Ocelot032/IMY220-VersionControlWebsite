import React from "react";
import { Link } from "react-router-dom";

const Messages = ({ messages }) => (
  <section>
    <h2>Activity</h2>
    {messages.length === 0 ? (
      <p>No activity yet.</p>
    ) : (
      <ul>
        {messages.map((msg) => (
          <li key={msg._id}>
            <strong>{msg.username}</strong> {msg.action} ({msg.version})
            <br />
            <em>{msg.message}</em>
            <br />
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default Messages;