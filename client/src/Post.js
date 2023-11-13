export default function Post(){
    return (
        <div className="post">
            <div className="image">
            <img src="https://s3-eu-central-1.amazonaws.com/www-staging.esports.com/WP%20Media%20Folder%20-%20esports-com//var/app/current/web/app/uploads/2020/06/Dota-2-by-Valve-720x384.jpg"></img>
            </div>
            <div className="text">
            <h2>Tournament Name</h2>
            <p className="info">
                <a className="author">Test Organizer</a>
                <time>2023-11-13 11:53</time>
                <a className="game">Dota2</a>
            </p>
            <p className="summary">Tournament description</p>
            </div>
        </div>
    );
}
