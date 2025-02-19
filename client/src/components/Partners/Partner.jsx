import React from "react";
import { Container } from "react-bootstrap";
import "./Partner.css";

const partnerLogos = [
  {
    src: "https://www.simplilearn.com/ice9/university/university-logo-coloured-n.svgz?w=200&dpr=1",
    alt: "iHUB Divysampark, IIT Roorkee",
  },
  {
    src: "https://www.simplilearn.com/ice9/labels/Caltech_Home.svg?w=320&dpr=1",
    alt: "Caltech CTME",
  },
  {
    src: "https://www.simplilearn.com/ice9/labels/AWS_Home.svg?w=128&dpr=1",
    alt: "AWS Partner",
  },
  {
    src: "https://www.simplilearn.com/ice9/accreditation_images/Category_Logos/PMI_48px.svgz?w=240&dpr=1",
    alt: "PMI Category Logo",
  },
  {
    src: "https://www.simplilearn.com/ice9/accreditation_images/Product_Page_Logo_1/IBM_White_40.svgz?w=1140&dpr=1",
    alt: "IBM",
  },
  {
    src: "https://www.simplilearn.com/ice9/labels/Miscrosoft_Home.svg?w=240&dpr=1",
    alt: "Microsoft",
  },
  {
    src: "https://www.simplilearn.com/ice9/labels/Purdue_Home.svg?w=200&dpr=1",
    alt: "Purdue University",
  },
  {
    src: "https://www.simplilearn.com/ice9/university/University_Logo_Colored_48px.svgz?w=160&dpr=1",
    alt: "E & ICT Academy, IIT Guwahati",
  },
];

const Partner = () => {
  return (
    <Container className="text-center py-4 partner">
      <h2>
        Our Affiliations with the world's leading universities and companies
      </h2>
      <div className="marquee">
        <div className="marquee-content">
          {partnerLogos.map((logo, index) => (
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              className="partner-logo"
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Partner;
