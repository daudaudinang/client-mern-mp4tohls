import React, { useEffect } from 'react'
import 'reactstrap';
import Banner from 'components/Banner';
import Images from 'constants/images';
import "./style.css"
import userApi from 'API/userApi';
import { useState } from 'react';
import { UserTable } from '../components/UserTable';
import { Switch, useRouteMatch, Route, Redirect, Link } from 'react-router-dom';
import EditUser from '../components/EditUser';
import AddUser from '../components/AddUser';
import { useHistory } from "react-router-dom";

UserController.propTypes = {

}

function UserController(props) {

    const history = useHistory();
    const match = useRouteMatch();
    const [dataUser, setDataUser] = useState([]);
    const [message, setMessage] = useState(null);
    const [changeData, setChangeData] = useState(0);

    useEffect(() => {
        userApi.getUserList()
        .then((response) => {
            console.log(response);
            setMessage(response.message);
            if(response.status === 1) setDataUser(response.userList);
        })
   }, [changeData]);

    const handleAdd = (dataUserAdd) => {
        userApi.addUser(dataUserAdd)
        .then((response) => {
            setMessage(response.message);
            if(response.status === 1) {
                setChangeData(changeData + 1);
                history.push('/UserController/view');
            }
        })
        .catch((err) => console.log(err));
    }

    const handleEdit = (dataEdit) => {
        userApi.editUser(dataEdit)
        .then((response) => {
            setMessage(response.message);
            if(response.status === 1){
                setChangeData(changeData + 1);
                history.push('/UserController/view');
            }
        })
        .catch((err) => console.log(err));
    }

  const handleRemove = (event) => {
    event.preventDefault();
    // Đầu tiên, xoá nó khỏi array trong state
    // Xoá item khỏi database
    userApi.removeUser(event.target.id)
    .then((response) => {
        setMessage(response.message);
        if(response.status === 1) {
            setChangeData(changeData + 1);
        }
    })
    .catch((err) => {
        console.log(err);
    })
  }

    return (
        <>
        <Banner title="User Controller 🎉" backgroundUrl={Images.COLORFUL_BG} message={message}/>
        <div className="main-container-user">
            <div className="left-container-user">
                <Link to='/UserController/view'>View List User</Link>
                <Link to='/UserController/add'>Add A New User</Link>
            </div>
            <div className="right-container">
            <Switch>
                <Route path={`${match.url}/view`}>
                    <UserTable dataUser={dataUser} handleRemove={handleRemove}/>
                </Route>
                <Route path={`${match.url}/edit/:id`}>
                    <EditUser handleEdit={handleEdit} setMessage={setMessage}></EditUser>
                </Route>
                <Route path={`${match.url}/add`}>
                    <AddUser handleAdd={handleAdd} setMessage={setMessage}></AddUser>
                </Route>
                <Redirect to={`${match.url}/view`} />
            </Switch>
            </div>
        </div>
        </>
    )
}

export default UserController

