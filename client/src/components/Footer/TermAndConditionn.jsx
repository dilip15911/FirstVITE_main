import React from "react";
import { Link } from "react-router-dom";

const TermAndCondition = () => {
  return (
    <>
      <footer className="bg-dark text-light py-4">
        <div className="container text-center">
          <div className="mb-2 mt-5">
            <Link to="#" className="text-light me-3">
              Terms and Conditions
            </Link>
            <span className="text-light">•</span>
            <Link to="#" className="text-light mx-3">
              Privacy Policy
            </Link>
            <span className="text-light">•</span>
            <Link to="#" className="text-light mx-3">
              Refund Policy
            </Link>
            <span className="text-light">•</span>
            <Link to="#" className="text-light ms-3">
              Country
            </Link>
            <img
              src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
              alt="India Flag"
              className="ml-2"
              style={{ display: "inline-flex" }}
              width="24"
              height="16"
            />
          </div>
          <p className="mb-1">
            Address: H-161 BIS Sector-63 Noida Gautam Budh Nagar Uttar Pradesh
            201301
          </p>
          <p className="small mb-1">
            &copy; 2025 - firstVite. All Rights Reserved. The certification
            names are the trademarks of their respective owners.
          </p>
          <hr className="border-secondary" />
          <div>
            <strong>Acknowledgement</strong>
            <p className="small mt-1">
              PMP, PMI, PMBOK, CAPM, PgMP, PfMP, ACP, PBA, RMP, SP, OPM3 and the
              PMI ATP seal are the registered marks of the Project Management
              Institute.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default TermAndCondition;
