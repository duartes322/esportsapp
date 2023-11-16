import { useEffect, useState } from "react";
import {Link} from "react-router-dom";

export default function Header() {
    const [username, setUsername] = useState(null);
    const [usertype, setUsertype] = useState(null);
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUsername(userInfo.username);
                setUsertype(userInfo.usertype);
            });
        });
    }, []);

    function logout() {
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        })
    }
    return(
        <header>
            <Link to="/" className="logo">MyEsportsApp</Link>
            <nav>
                {usertype==='Organizer' && (
                    <>
                        <Link to="/create">Create new tournament</Link>
                        <a onClick={logout}>Logout</a>
                    </>
                )}
                {usertype==='Player' && (
                    <>
                        <Link to="/newteam">Create new team</Link>
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