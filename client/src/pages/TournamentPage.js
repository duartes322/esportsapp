/* import { SingleEliminationBracket, DoubleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets'; */
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function TournamentPage() {
   /*  const [matches,setMatches] = useState(null);
    const {id} = useParams(); */
    /* useEffect(() => {
        fetch(`http://localhost:4000/match/${id}`)
            .then(response => {
                response.json().then(matches => {
                    setMatches(matches);
                })
                .catch(error => {
                    console.error('Error fetching post:', error);
                })
            });
    }, []);

    const SingleElimination = () => (
        <SingleEliminationBracket
          matches={matches}
          matchComponent={Match}
          svgWrapper={({ children, ...props }) => (
            <SVGViewer width={500} height={500} {...props}>
              {children}
            </SVGViewer>
          )}
        />
      ); */
    

    return(
        <div>
            here new team
        </div>
    )
}