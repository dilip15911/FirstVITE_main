import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import './pages.css';


const SendEmail = () => {
    const [formData, setFormData] = useState({
        email: "",
        subject: "",
        message: "",
    });

    const formRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendEmail = (e) => {
        e.preventDefault();

        console.log("Form Data Before Sending:", formData);

        if (!formData.email.trim()) {
            alert("Recipient email cannot be empty!");
            return;
        }

        emailjs.send(
            "service_igcqvgk",
            "template_xpbbsvl",
            {
                email: formData.email, // Ensure correct variable name
                subject: formData.subject,
                message: formData.message,
            },
            "YCsa5TmyzhY6ja5Lh"
        )
            .then(
                (response) => {
                    console.log("Email sent successfully!", response);
                    alert("Email sent successfully!");
                    setFormData({ email: "", subject: "", message: "" });
                },
                (error) => {
                    console.error("Failed to send email:", error);
                    alert("Failed to send email: " + error.text);
                }
            );
    };


    return (
        <div className="container d-flex justify-content-center mt-5">
            <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center mb-3">📧 Send an Email</h2>
                <form ref={formRef} onSubmit={sendEmail}>
                    <div className="mb-3">
                        Required
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Recipient Email"
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        Optional
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
                        Optional
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
                        🚀 <span className="ms-2">Send Email</span>
                    </button>
                </form>
            </div>
        </div>


    );
};

export default SendEmail;
