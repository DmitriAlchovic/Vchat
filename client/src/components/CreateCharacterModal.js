import React, { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useMessage } from "../hooks/message.hook";
import { useHttp } from "../hooks/http.hook";
import axios from "axios";

export const CreateCharacterModal = () => {
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const { request, error, clearError } = useHttp();
  const auth = useContext(AuthContext);
  const message = useMessage();
  const [newChar, setNewChar] = useState({
    charName: "",
    charDiscription: "",
    rpSystem: "",
  });
  const [charSheet, setCharSheet] = useState("");
  const [charAvatar, setCharAvatar] = useState("");

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.Modal.init(modalRef.current);
    window.M.CharacterCounter.init(inputRef.current);
  });

  const changeHandler = (event) => {
    setNewChar({ ...newChar, [event.target.name]: event.target.value });
  };

  const createCharacterHandler = async () => {
    try {
      const formData = new FormData();
      formData.append("charSheet", charSheet);
      formData.append("avatar", charAvatar);
      console.log(formData, "formData");
      formData.append("userId", auth.userId);
      formData.append("newChar", JSON.stringify(newChar));
      console.log(auth.token);
      const data = await axios.post("/api/char/create", formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      message(data.message);
    } catch (e) {}
  };

  return (
    <div>
      <a className="waves-effect waves-light  modal-trigger" href="#modal1">
        Create character
      </a>

      <div id="modal1" className="modal blue darken-3">
        <div ref={modalRef} className="modal-content">
          <h4 className="black-text">Create character</h4>
          <div className="row">
            <form className="col s6">
              <div className="input-field">
                <input
                  ref={inputRef}
                  className="blue-input"
                  data-length="10"
                  id="charName"
                  name="charName"
                  type="text"
                  value={newChar.charName}
                  onChange={changeHandler}
                />
                <label htmlFor="charName">Enter character name</label>
              </div>
            </form>
          </div>
          <div className="row">
            <form className="col s3">
              <div className="input-field">
                <input
                  ref={inputRef}
                  className="blue-input"
                  data-length="7"
                  id="rpSystem"
                  name="rpSystem"
                  type="text"
                  value={newChar.rpSystem}
                  onChange={changeHandler}
                />
                <label htmlFor="rpSystem">Enter roleplay system</label>
              </div>
            </form>
          </div>
          <form action="#">
            <div className="file-field input-field blacl-text">
              <div className="btn">
                <span>Upload charecter Sheet</span>
                <input
                  type="file"
                  onChange={(e) => {
                    setCharSheet(e.target.files[0]);
                  }}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate black-text" type="text" />
              </div>
            </div>
          </form>
          <form action="#">
            <div className="file-field input-field">
              <div className="btn">
                <span>Upload Avatar</span>
                <input
                  type="file"
                  onChange={(e) => {
                    setCharAvatar(e.target.files[0]);
                  }}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
          </form>
          <div className="row">
            <div className="input-field col s6">
              <textarea
                ref={inputRef}
                className="blue-textarea"
                id="charDiscription"
                name="charDiscription"
                className="materialize-textarea"
                data-length="120"
                type="text"
                value={newChar.charDiscription}
                onChange={changeHandler}
              ></textarea>
              <label forhtml="charDiscription">Character discription</label>
            </div>
          </div>
        </div>
        <div className="modal-footer blue darken-3">
          <a
            href="#!"
            className="waves-effect waves-green btn-flat align-bottom"
            onClick={createCharacterHandler}
          >
            Create
          </a>
          <a
            href="#!"
            className="modal-close waves-effect waves-green btn-flat"
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
};
