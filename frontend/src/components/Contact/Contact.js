import React, { Component } from "react";
import AuthContext from "../../context/auth-context";
import "./Contact.css";

class Contact extends Component {
    state = {
        status: ""
    };

    static contextType = AuthContext;

    submitForm = (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const xhr = new XMLHttpRequest();
        // axios + defaults
        xhr.open(form.method, form.action);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) return;
            if (xhr.status === 200) {
                form.reset();
                this.setState({ status: "SUCCESS" });
            } else {
                this.setState({ status: "ERROR" });
            }
        };
        xhr.send(data);
    }

    render() {
        const { status } = this.state;
        return (
            <div className="Contact">
                <form
                    onSubmit={this.submitForm}
                    action="https://formspree.io/mjvaegeg"
                    method="POST">
                    <input type="hidden" name="email" value={this.context.email} />
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject" name="subject" placeholder="Write a subject of the email" />
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" placeholder="Write something.." rows="10"></textarea>
                    {status === "SUCCESS" ? <p>Thanks!</p> : <input type="submit" value="Submit" />}
                    {status === "ERROR" && <p>Ooops! There was an error.</p>}
                </form>
            </div>
        );
    }
};

export default Contact;