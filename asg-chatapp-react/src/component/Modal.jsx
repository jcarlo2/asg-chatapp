import React, { forwardRef } from "react";

const Modal = forwardRef(({ text }, ref) => {
  return (
    <div className="modal-container" ref={ref}>
      <h1>{text}</h1>
      <input type="button" defaultValue={"OK"} onClick={()=> ref.current.classList.remove('show')}/>
    </div>
  );
});

export default Modal;
