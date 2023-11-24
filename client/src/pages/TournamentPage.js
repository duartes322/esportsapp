import React, { useState, useEffect, useContext } from 'react';
import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
import { useParams } from 'react-router-dom';
import { UserContext } from "../UserContext";


const TournamentPage = () => {
  const { userInfo } = useContext(UserContext);
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [formUpdates, setFormUpdates] = useState([]);
  const usertype = userInfo?.usertype;

  const { id } = useParams();

  const SingleElimination = () => (
    <SingleEliminationBracket
      matches={matches}
      matchComponent={Match}
      svgWrapper={({ children, ...props }) => (
        <SVGViewer width={2000} height={2000} {...props}>
          {children}
        </SVGViewer>
      )}
    />
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/tournament/${id}`);
        const data = await response.json();
        console.log(data);
        console.log(data.matches);

        setMatches(data.matches);
        console.log('Matches:', data.matches);
        setTournament(data.matches);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateParticipants = async () => {
    try {
      const response = await fetch(`http://localhost:4000/tournament/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formUpdates),
      });

      const data = await response.json();
      console.log('Updated participants:', data);
    } catch (error) {
      console.error('Error updating participants:', error);
    }
    window.location.reload();
  };

  const handleFieldChange = (matchId, participantId, field, value) => {
    setTournament((prevTournament) => {
      const updatedParticipants = prevTournament.map((match) => {
        if (match.id === matchId) {
          return {
            ...match,
            participants: match.participants.map((participant) => {
              if (participant.id === participantId) {
                return { ...participant, [field]: value };
              }
              return participant;
            }),
          };
        }
        return match;
      });

      setFormUpdates((prevFormUpdates) => {
        const existingUpdateIndex = prevFormUpdates.findIndex(
          (update) => update.matchId === matchId && update.participantId === participantId
        );

        if (existingUpdateIndex !== -1) {
          const updatedUpdate = {
            ...prevFormUpdates[existingUpdateIndex],
            fieldsToUpdate: { ...prevFormUpdates[existingUpdateIndex].fieldsToUpdate, [field]: value },
          };
          return [
            ...prevFormUpdates.slice(0, existingUpdateIndex),
            updatedUpdate,
            ...prevFormUpdates.slice(existingUpdateIndex + 1),
          ];
        } else {
          return [
            ...prevFormUpdates,
            {
              matchId,
              participantId,
              fieldsToUpdate: { [field]: value },
            },
          ];
        }
      });

      return updatedParticipants;
    });
  };

  const renderForm = () => {
    if (!tournament) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        {tournament.map((match) => (
          <div key={match.id}>
            
            <h3
              style={{ cursor: 'pointer', color: selectedMatch === match.id ? 'blue' : 'black' }}
              onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
            >
              {match.name}
            </h3>
            {selectedMatch === match.id && (
              <div>
                {match.participants.map((participant, index) => (
                  
                  <div key={participant.id}>
                    {console.log(participant)}
                    {console.log(participant.id)}
                    <h4>{participant.name}</h4>
                    <label>
                      Is Winner:
                      <input
                        type="checkbox"
                        checked={participant.isWinner}
                        onChange={(e) =>
                          handleFieldChange(
                            match.id,
                            participant.id,
                            'isWinner',
                            e.target.checked
                          )
                        }
                      />
                    </label>
                    <br />
                    <label>
                      Result Text:
                      <input
                        type="text"
                        value={participant.resultText}
                        onChange={(e) =>
                          handleFieldChange(
                            match.id,
                            participant.id,
                            'resultText',
                            e.target.value
                          )
                        }
                      />
                    </label>
                    <br />
                    <label>
                      Name:
                      <input
                        type="text"
                        value={participant.name}
                        onChange={(e) =>
                          handleFieldChange(match.id, participant.id, 'name', e.target.value)
                        }
                      />
                    </label>
                    <hr />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="tourney-page">
      <div className="bracket">{matches != null && <SingleElimination />}</div>
      <div className="single-elim">
        {usertype === 'Organizer' && renderForm()}
        {usertype === 'Organizer' && 
          <div className="edit-tourney">
            <button onClick={handleUpdateParticipants}>Update matches</button>
          </div>}
      </div> 
      
    </div>
  );
};

export default TournamentPage;