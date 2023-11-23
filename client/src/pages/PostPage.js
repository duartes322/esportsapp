import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";

const mongoose = require('mongoose');

export default function PostPage(){
    const [postInfo,setPostInfo] = useState(null);
    const [tournamentInfo, setTournamentInfo] = useState(null);
    const [matchesSet, setMatchesSet] = useState(false);
    const {userInfo} = useContext(UserContext);
    const [tournamentId, setTournamentId] = useState('');
    const {id} = useParams();
    
    
    async function createNewTournament(tournamentLog) { 
        const response = await fetch('http://localhost:4000/tournament', {
            method: 'POST',
            body: JSON.stringify({ tournamentLog }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok){
            console.log('TOURNAMENT CREATED');
        } else {
            console.error('Error creating tournament', response);
            const errorBody = await response.json();
            console.error('Error details:', errorBody);
        }
    }

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
                })
                .catch(error => {
                    console.error('Error fetching post:', error);
                })
            });
        setTournamentId(id);
    }, [id]);


    async function registerPlayer(ev){
        ev.preventDefault()
    
        const response = await fetch(`http://localhost:4000/post/${id}`, {
                method: 'PUT',
                credentials: 'include',
            })
            if (response.ok){
                alert('registration successful')
                window.location.reload();
            } else {
                alert('registration failed');
            }
    }

    const matchIdArray = [];
    const playerNameArray = [];
    const playerIdArray = [];
    var matchCounter = 1;
    const matchNameArray = [];
    const tournamentRoundTextArray = [];
    const nextMatchAssist = [];
    const resultTextArray=[];
    const isWinnerArray=[];
    const playerStatusArray=[];
    const participantsArray=[];
    const participants=[];
    var matchId = '';
    var nextMatchId = '';
    var playerName = '';
    var playerId = '';
    var matchName = '';
    var tournamentRoundText = '';
    var resultText = '';
    var isWinner = false;
    var playerStatus = '';
    const startTimeArray = [];
    var startTime = '';
    const matchStateArray = [];
    var matchState = '';
    const nextMatchArray = [];


    async function setMatches(ev){
        ev.preventDefault();
        var roundsLoop = postInfo.registeredPlayers.length;
        var roundsCounter = 1;
        var playerAssist = 0;
        
        
        for (let i = 0; roundsLoop > 1; i++) {
            roundsLoop = roundsLoop/2;
            nextMatchAssist.push(roundsLoop);
                for(let j=0; j<roundsLoop; j++){
                    matchNameArray.push('Match'+matchCounter.toString());
                    matchCounter++;
                    tournamentRoundTextArray.push(roundsCounter.toString());
                    matchId = Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0);
                    matchIdArray.push(matchId);
                    if(roundsCounter > 1){
                        nextMatchArray.push(matchId);
                        nextMatchArray.push(matchId);
                    }
                    for(let k=0; k<2; k++){
                        if(roundsCounter == 1){       
                            playerName = postInfo.registeredPlayers[playerAssist].username;
                            playerNameArray.push(playerName);
                            playerId = Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0);
                            playerIdArray.push(playerId);
                            playerAssist++;
                        }else{                   
                            playerName = 'TBD'
                            playerNameArray.push(playerName);
                            playerId = '';
                            playerIdArray.push(playerId);
                        }
                        
                        resultText = '';
                        resultTextArray.push(resultText);
                        isWinner = false;
                        isWinnerArray.push(isWinner);
                        playerStatus = '';
                        playerStatusArray.push(playerStatus);

                        const playerDoc = await fetch('http://localhost:4000/player',{
                            method: 'POST',
                            body: JSON.stringify({playerId, resultText, isWinner, playerStatus, playerName, tournamentId}),
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                              }
                        });
                        if(playerDoc.ok) {
                            const responseBody = await playerDoc.json(); 
                            participantsArray.push(responseBody._id);
                        }
                    }   
                }
            roundsCounter++;
        }
            alert('registration successful');
            roundsLoop = postInfo.registeredPlayers.length;
            roundsCounter = 1;
            matchIdArray.push('');
            
            for (let i=0; roundsLoop>1; i++){
                roundsLoop = roundsLoop/2;
                for (let j=0; j<roundsLoop; j++){
                    matchId = matchIdArray.shift();
                    matchName = matchNameArray.shift();
                    if (roundsLoop > 1){
                        nextMatchId = nextMatchArray.shift();
                    } else {
                        nextMatchId = '';
                    }
                    participants.pop();
                    participants.pop();
                    tournamentRoundText = tournamentRoundTextArray.shift();
                    participants.push(participantsArray.shift());
                    participants.push(participantsArray.shift());
                    startTime = '';
                    startTimeArray.push(startTime);
                    matchState = '';
                    matchStateArray.push(matchState);

                    const matchResponse = await fetch('http://localhost:4000/match',{
                                    method: 'POST',
                                    body: JSON.stringify({matchId, matchName, nextMatchId, tournamentRoundText, 
                                        startTime, matchState, participants, tournamentId}),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                    });
                }
                roundsCounter++;
            }
            alert('Matches set successfully');
            setMatchesSet(true);
            /* return <Navigate to={'/matchlist'} /> */
    }
    
    useEffect(() => {
        if (matchesSet) {
          fetch(`http://localhost:4000/match?tournamentId=${tournamentId}`)
            .then(response => {
              response.json().then(tournamentInfo => {
                setTournamentInfo(tournamentInfo);
                
                // Assuming tournamentInfo is an array or an object with data
                if (tournamentInfo && tournamentInfo.length > 0) {
                  console.log(tournamentInfo);
                  createNewTournament(tournamentInfo);
                  console.log('tournament created');
                  setMatchesSet(false);
                }
              })
              .catch(error => {
                console.error('Error fetching post:', error);
              });
            });
        }
      }, [matchesSet, tournamentInfo]);
        
    

    if (!postInfo) return '';

    return(
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">by @{postInfo.author.username}</div>
            {userInfo.id === postInfo.author._id && (
                <div className="edit-row">
                    <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit post
                    </Link>
                </div>
            )}
            <div className="image">
                <img src={`http://localhost:4000/${postInfo.cover}`} alt=""/>
            </div>
            <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}}/>
            <div className="registered-players">{postInfo.registeredPlayers.length}/{postInfo.playerCount} registered</div> 
            {postInfo.registeredPlayers.length !== Number(postInfo.playerCount) && (
                <div className="register-row">
                    <a className="register-btn" onClick={registerPlayer}>Register</a>
                </div>
            )}
            {postInfo.registeredPlayers.length === Number(postInfo.playerCount) && (
                <div className="register-end">
                    <p>Tournament full</p>
                    <Link to={`/matchlist/${id}`}>Match list</Link>
                </div>
            )}
            {userInfo.id === postInfo.author._id && (
                <div className="set-matches">
                    {<a className="matches-btn" onClick={setMatches}>Set matches</a>}
                </div>
            )}
        </div>
    );
}