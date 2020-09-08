import React from 'react';
import './Profile.css';
import AuthContext from "../../context/auth-context";

const Profile = props => (
    <AuthContext.Consumer>
        {context => {
            let getLetters = () => {
                let words = props.user.split(' ');
                return words[0][0] + words[1][0]; 
            };
            return (
                <div className="Profile">
                    <div className="photo">{getLetters()}</div>
                    <div className="links">
                        <span className="link"> Settings </span>
                        <span className="link" onClick={context.logout}> Sign Out </span>
                    </div>
                </div>
            );
    }}
    </AuthContext.Consumer>
);

export default Profile;