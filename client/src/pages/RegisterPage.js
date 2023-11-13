export default function RegisterPage() {
    return(
        <form className="register">
            <h1>Register</h1>
            <input type="text" placeholder="username"/>
            <input type="password" placeholder="password"/>
            <input type="email" placeholder="email"/>
            <input type="radio" id="organizer" name="user_type" value="Organizer"/>
            <label for="organizer">Organizer</label>
            <input type="radio" id="player" name="user_type" value="Player"/>
            <label for="player">Player</label>
            <button>Register</button>
        </form>
    );
}