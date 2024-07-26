import React from 'react';
import '../../css/PasswordModal.css';
import '../../css/Button.css';


function Modal({ onClose, onSubmit }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <form className="password-form" onSubmit={onSubmit}>
          <label>
            Password:
            <input className="password-input" type="password" name="password" />
          </label>
          <button className='password-button' type="submit">입장</button>
        </form>
      </div>
    </div>
  );
}

export default Modal;