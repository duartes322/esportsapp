import { useContext, useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
    const {setUserInfo, userInfo} = useContext(UserContext)
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    function logout() {
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        });
        window.location.reload();
        setUserInfo(null);
    }

    const username = userInfo?.username;
    const usertype = userInfo?.usertype;

    return(
        <header>
            <Link to="/" className="logo">MyEsportsApp</Link>
            <nav>
                {usertype==='Organizer' && (
                    <>
                        <span>Hello, {username}</span>
                        <Link to="/create">Create new tournament</Link>
                        <a onClick={logout}>Logout</a>
                    </>
                )}
                {usertype==='Player' && (
                    <>
                        <span>Hello, {username}</span>
                        <a onClick={logout}>Logout</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header> 
    );
}