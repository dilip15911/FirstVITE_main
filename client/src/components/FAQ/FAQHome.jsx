import React from "react";
import { Accordion, Card } from "react-bootstrap";

const FAQHome = () => {
  const faqs = [
    {
      question: "Is FirstVITE a good platform for freshers ?",

      answer:
        "Definitely, FirstVITE is one of the best platforms for freshers who desire to enhance their professional skills and land good opportunities. ",
    },
    {
      question: "Is FirstVITE a reliable online learning platform ?",
      answer:
        "Yes, FirstVITE is a trusted online learning platform, FirstVITE is an online education company offering a range of short-term courses and degree programs, accredited by several global organizations. Our courses follow a well-rounded curriculum designed to help learners upskill and advance their careers. FirstVITE certificates are recognized in over 100+ countries, and the course content is always aligned with industry standards.",
    },
    {
      question:
        "What is the benefit of choosing FirstVITE over other platforms? ?",
      answer:
        "Learners choose FirstVITE because it offers comprehensive, industry-relevant courses designed to meet the needs of professionals across various domains. With globally recognized certifications,  IITs expert-led live classes, we deliver only the highest-quality training to learners. Our platform also provides hands-on projects and real-world scenarios to help learners gain practical skills that accelerate career growth, and our 24/7 learner support ensures they receive guidance and assistance whenever they need it.",
    },
    {
      question:
        "How has FirstVITE helped learners with their career transition ?",
      answer:
        "Hands-On Learning:- Provides real-world projects and case studies to help learners apply skills in practical scenarios,Includes hands-on labs, live classes, and capstone projects. Career Assistance Job Assistance:- Many programs include career coaching, resume building, and interview prep.Job Guarantee Programs, Some courses promise job placement support upon completion.Industry Partnerships: Collaboration with top companies for hiring opportunities.",
    },
    {
      question: "How do I find a perfect FirstVITE course to help my career ?",
      answer:
        "To find the perfect FirstVITE course for your career, start by considering your current skill set and the specific area you want to grow in. Our website offers a variety of courses across fields like AI, data science, cybersecurity, project management, and more. You can browse through the courses by category or use our career-focused learning paths to find programs tailored to your professional goals. Additionally, we offer free course previews and detailed course content outlines to help you make an informed choice. If you’re unsure, our team is also available to help guide you based on your experience and career aspirations.",
    },
    {
      question:
        "For which domains is FirstVITE the best online learning platform ?",
      answer:
        "FirstVITE is the best platform to choose if the learners wish to establish themselves in the fields of data science, digital marketing, project management, cloud computing, data analysis or data analytics, machine learning, business analyst or business analytics, web development, or to fulfill any business strategy role.",
    },
    {
      question: "Are FirstVITE’s courses relevant to the Abroad job market ?",
      answer:
        "Yes, FirstVITE’s courses are highly relevant to the US job market. Our platform offers programs aligned with current industry standards, focusing on in-demand skills such as data science, cloud computing, AI, and project management. Many of our courses are created in collaboration with US-based universities and institutions, ensuring they cater to the needs of the US workforce. With a strong emphasis on practical skills and real-world application, we help learners stay competitive in the US job market.",
    },
    {
      question: "Is FirstVITE certification worth it ?",
      answer:
        "Indeed! With a modest start in 2022, FirstVITE has come a long way to become a global leader in digital upskilling. Our platform features over 50+ courses, taught by 200 seasoned instructors, and more than 20 global accreditations. The online programs are created and presented in collaboration with prestigious universities, prominent businesses, and authoritative industry organizations. So explore our platform today and enroll in the course of your choice to gain work-ready skills. ",
    },
    {
      question: " Can you trust on FirstVITE E-learning plateform ?",
      answer:
        "Definitely,FirstVITE is an e-learning platform offering various degree and short programs through collaborations with top universities worldwide. Their mission is to provide quality education accessible to all students, regardless of financial or academic circumstances.",
    },
  ];

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4">Frequently Asked Questions</h2>
      <Accordion>
        {faqs.map((faq, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>{faq.question}</Accordion.Header>
            <Accordion.Body>{faq.answer}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQHome;
