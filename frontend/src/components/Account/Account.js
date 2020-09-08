import React from "react";
import AuthContext from "../../context/auth-context";
import "./Account.css";

function Account (props) {
    const user = React.useContext(AuthContext);
    const [passChange, changePass] = React.useState(false);
    console.log(passChange);
    return (
        <div className="Account">
            {!passChange && (
                <>
                <label htmlFor="full_name"> Full Name </label><br/>
                <input type="text" name="full_name" value={user.username} disabled></input><br/>
                <label htmlFor="user_email"> Email Address </label><br/>
                <input type="text" name="full_name" value={user.email} disabled></input><br/>
                <button onClick={() => changePass(!passChange)}>
                    Change Password
                </button>
                </>
            )}
            {passChange && (
                <>
                <label htmlFor="current_pass"> Current Password </label><br/>
                <input type="password" name="current_pass" placeholder="Type in curret password"></input><br/>
                <label htmlFor="new_pass1"> New Password </label><br/>
                <input type="password" name="new_pass1" placeholder="Type in new password"></input><br/>
                <input type="password" name="new_pass2" placeholder="Confirm new password" className="confirm_input"></input>
                <div className="password_btns">
                    <button onClick={() => changePass(!passChange)}>
                        Cancel
                    </button>
                    <button>
                        Submit
                    </button>
                </div>
                </>
            )}
        </div>
    );
};

export default Account;