import { useParams } from "react-router";
import axios from "axios";
//User token stuff
import { useContext } from "react";
import AuthContext from "../Store/auth-context";
//react imports
import { useState, useEffect, useCallback } from "react";
//Styling
import { Col, Row, Image, Container, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
//pic
import defaultPic from "./Media/group-defualt.jpg";
//Components
import GroupCommentPost from "../Components/groups/groupDetails/GroupCommentPost";
import GroupCommentList from "../Components/groups/groupDetails/GroupCommentList";
import GroupInfo from "../Components/groups/groupDetails/GroupInfo";
import GroupMembers from "../Components/groups/groupDetails/GroupMembers";

const GroupDetails = (props) => {
  //Sets the correct backend server address depending
  //on if in dev or production mode
  const url = process.env.NODE_ENV === "development" ? 
  process.env.REACT_APP_URL_DEVELOPMENT : process.env.REACT_APP_URL_PRODUCTION;

  //token stuff
  const authCtx = useContext(AuthContext);
  const isLogedIn = authCtx.isLoggedIn;

  //get the id from the url using params
  const params = useParams();

  //groups object and setter here
  const [groups, setGroups] = useState([]);

  //use useState to store if the data is still being fetched from the server
  const [doneLoading, setLoading] = useState(false);

  //Use useState to store user info from server
  const [userInfo, setUserInfo] = useState([]);

  //Use useState to store when data is changed
  const [dataChanged, setDataChanged] = useState(false);


  const [userComments, setComments] = useState([]);

  //Load group and user data from the database
  const loadData = useCallback(async () => {
    //async call to database
    const fetchGroups = async () => {
      try {
        let response = await axios(
          `${url}/activities/${params.groupID}`
        );
        //store groups in groups object
        setGroups(response.data);
        setLoading(true);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    let fetchUser = async () => {
      try {
        const response = await axios.get( url + "/users/me", {
          headers: {
            "Content-Type": "application/json",
            token: authCtx.token,
          },
        });
        //store user info in user object
        setUserInfo(response.data);
        setLoading(true);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    let fetchComments = async ()=>{
      try{
        let response = await axios(
          `${url}/comments/get/${params.groupID}`
        );
        //store comments in comments object
        setComments(response.data);
        setLoading(true);
      }catch (err){
        console.log(err);
        setLoading(false);
      }
    };
    //Call async function
    fetchGroups();
    
    if (isLogedIn) fetchUser();

    fetchComments();

    //set loading to false
    //setLoading(true)
  }, [params, authCtx.token, isLogedIn, url ]);//dataChanged

  //useEffect hook will load groups from data base when component is loaded
  useEffect(() => {
    loadData();
    setDataChanged(false);
  }, [loadData, dataChanged]);

  if(!groups){
    return <Spinner animation="border" variant="warning" />
  }

  return (
    <>
      <Container className="text-white bg-light pb-4 mt-5">
        <Row className="pt-4">
          <Col>
            <Image
              // style={{ maxHeight: "300px", maxWidth: "500px" }}
              src={groups.groupPic||defaultPic}
              alt="group image"  
              rounded 
              className="img-fluid img-max"
            />
          </Col>
          <Col>
            {groups && <GroupInfo
              groups={groups}
              userInfo={userInfo}
              onDataChanged={setDataChanged}
            />}
          </Col>
        </Row>
        <Row>
          <Container fluid className="pt-4">
            

            <GroupMembers 
            groups={groups} 
            onDataChanged={setDataChanged}
            />

            {doneLoading && <GroupCommentPost
              groupInfo={groups}
              userInfo={userInfo}
              userComments={userComments}
              onDataChanged={setDataChanged}
            />}
            <GroupCommentList
              userInfo = {userInfo}
              userComments = {userComments}
              onDataChanged={setDataChanged}
            /> 
          </Container>
        </Row>
      </Container>
    </>
  );
};

export default GroupDetails;
