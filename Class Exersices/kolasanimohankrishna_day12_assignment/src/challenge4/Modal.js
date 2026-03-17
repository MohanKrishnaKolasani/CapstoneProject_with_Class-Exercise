import React from "react";
import ReactDOM from "react-dom";
import "./modal.css";

function Modal({ children, closeModal }) {
  return ReactDOM.createPortal(
    <div className="overlay" onClick={closeModal}>
      <div className="modalBox" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={closeModal}>Close</button>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default Modal;