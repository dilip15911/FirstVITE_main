import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import './pages.css';

const SendEmail = () => {
    const [formData, setFormData] = useState({
        emails: "",  // Multiple emails comma-separated
        subject: "",
        message: "",
    });

    const formRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendEmail = async (e) => {
        e.preventDefault();

        let emailList = formData.emails.split(",").map(email => email.trim()).filter(email => email);

        if (emailList.length === 0) {
            alert("At least one recipient email is required!");
            return;
        }

        console.log("Sending emails to:", emailList);

        try {
            for (let email of emailList) {
                await emailjs.send(
                    "service_igcqvgk",
                    "template_xpbbsvl",
                    {
                        email: email,
                        subject: formData.subject,
                        message: formData.message,
                    },
                    "YCsa5TmyzhY6ja5Lh"
                );
                console.log(`Email sent to: ${email}`);
            }
            alert("Emails sent successfully!");
            setFormData({ emails: "", subject: "", message: "" });
        } catch (error) {
            console.error("Failed to send emails:", error);
            alert("Failed to send emails: " + error.text);
        }
    };

    return (
        <div className="container d-flex justify-content-center mt-5">
            <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center mb-3">📧 Send Multiple Emails</h2>
                <form ref={formRef} onSubmit={sendEmail}>
                    <div className="mb-3">
                        <label>Recipient Emails (comma-separated) *</label>
                        <input
                            type="text"
                            name="emails"
                            value={formData.emails}
                            onChange={handleChange}
                            placeholder="Enter multiple emails separated by commas"
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label>Subject (Optional)</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Subject"
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label>Message (Optional)</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Message"
                            rows="4"
                            className="form-control"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                    >
                        🚀 <span className="ms-2">Send Emails</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SendEmail;
