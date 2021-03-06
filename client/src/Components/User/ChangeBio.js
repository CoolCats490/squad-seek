import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios"; 

const ChangeBio = ({ userInfo, showForm }) => {
  const [profileBio, setProfileBio] = useState("");
  const [bioUpdated, setBioUpdated] = useState(false);
  const [failedToUpdate, setFailedToUpdate] = useState(false);

  //Sets the correct backend server address depending
  //on if in dev or production mode
  const url =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_URL_DEVELOPMENT
      : process.env.REACT_APP_URL_PRODUCTION;

  const bioHandler = (e) => {
    setProfileBio(e.target.value);
  };

  const closeHandler = () => {
    setFailedToUpdate(false);
    setBioUpdated(false);
    showForm(false);
  };

  const submitHandler = () => {
    axios
      .post(url + "/users/changeBio", {
        _id: userInfo._id,
        profileBio: profileBio,
      })
      .then((res) => {
        console.log(res.data);
        setBioUpdated(true);
        setFailedToUpdate(false);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.data.message === "Failed To Update Bio") {
          setFailedToUpdate(true);
          setBioUpdated(false);
        }
      });
  };

  return (
    <Container>
      {failedToUpdate && (
        <h5 className="bg-warning text-center">Failed To Update Bio</h5>
      )}
      {bioUpdated && (
        <h5 className="text-center bg-success shadow" onClick={closeHandler}>
          Bio Updated
        </h5>
      )}
      {!bioUpdated && (
        <Form className="w-75">
          <Form.Control
            as="textarea"
            placeholder="Enter Bio Here"
            onChange={bioHandler}
          />
          <Button className="mt-2" onClick={submitHandler}>
            Submit
          </Button>
          <Button className="mx-2 mt-2 bg-danger" onClick={closeHandler}>
            Cancel
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default ChangeBio;