"use client";
// import React, { useState } from "react";
// import Carousel from "react-bootstrap/Carousel";
// import Button from "react-bootstrap/Button";
// import "./Carousel.css";

// // Import images directly
// import banner1 from "/Images/banner_revamp_01.avif";
// import banner2 from "/Images/banner_revamp_02.avif";
// import banner3 from "/Images/banner_revamp_03.avif";

// function MyCustomCarousel() {
//   const [imageError, setImageError] = useState({
//     banner1: false,
//     banner2: false,
//     banner3: false
//   });

//   const handleImageError = (bannerName) => {
//     console.error(`Failed to load image: ${bannerName}`);
//     setImageError(prev => ({
//       ...prev,
//       [bannerName]: true
//     }));
//   };

//   return (
//     <Carousel className="carousel-container">
//       <Carousel.Item interval={1000}>
//         <div className="carousel-item-content">
//           <div className="carousel-text">
//             <h2>All our top programs include Generative AI Components</h2>
//             <hr />
//             <h3>Be a leader in your field</h3>
//             <h3>Change, Adapt and Build with AI</h3>
//             <Button variant="warning">Explore Programs</Button>
//           </div>
//           <div className="carousel-image-container">
//             {!imageError.banner1 ? (
//               <img
//                 className="carousel-image"
//                 src={banner1}
//                 alt="AI Learning"
//                 onError={() => handleImageError('banner1')}
//               />
//             ) : (
//               <div className="image-placeholder">Image not available</div>
//             )}
//           </div>
//         </div>
//       </Carousel.Item>

//       <Carousel.Item interval={500}>
//         <div className="carousel-item-content">
//           <div className="carousel-text">
//             <h2>Empower Your Learning with AI</h2>
//             <hr />
//             <h3>Enhance Your Skills with Cutting-Edge Technology</h3>
//             <Button variant="warning">Learn More</Button>
//           </div>
//           <div className="carousel-image-container">
//             {!imageError.banner2 ? (
//               <img
//                 className="carousel-image"
//                 src={banner2}
//                 alt="Technology Learning"
//                 onError={() => handleImageError('banner2')}
//               />
//             ) : (
//               <div className="image-placeholder">Image not available</div>
//             )}
//           </div>
//         </div>
//       </Carousel.Item>

//       <Carousel.Item interval={500}>
//         <div className="carousel-item-content">
//           <div className="carousel-text">
//             <h2>
//               Transform Your Career with Advanced Learning
//             </h2>
//             <hr />
//             <h3>Join Our Community of Innovators</h3>
//             <Button variant="warning">Learn More</Button>
//           </div>
//           <div className="carousel-image-container">
//             {!imageError.banner3 ? (
//               <img
//                 className="carousel-image"
//                 src={banner3}
//                 alt="Career Growth"
//                 onError={() => handleImageError('banner3')}
//               />
//             ) : (
//               <div className="image-placeholder">Image not available</div>
//             )}
//           </div>
//         </div>
//       </Carousel.Item>
//     </Carousel>
//   );
// }

// export default MyCustomCarousel;

import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import "./Carousel.css";

function MyCustomCarousel() {
  const [imageError, setImageError] = useState({
    banner1: false,
    banner2: false,
    banner3: false
  });

  const handleImageError = (bannerName) => {
    console.error(`Failed to load image: ${bannerName}`);
    setImageError(prev => ({
      ...prev,
      [bannerName]: true
    }));
  };

  return (
    <Carousel className="carousel-container">
      <Carousel.Item interval={1000}>
        <div className="carousel-item-content">
          <div className="carousel-text">
            <h2>All our top programs include Generative AI Components</h2>
            <hr />
            <h3>Be a leader in your field</h3>
            <h3>Change, Adapt and Build with AI</h3>
            <Button variant="warning">Explore Programs</Button>
          </div>
          <div className="carousel-image-container">
            {!imageError.banner1 ? (
              <img
                className="carousel-image"
                src="/Images/banner_revamp_01.avif"
                alt="AI Learning"
                onError={() => handleImageError('banner1')}
              />
            ) : (
              <div className="image-placeholder">Image not available</div>
            )}
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item interval={500}>
        <div className="carousel-item-content">
          <div className="carousel-text">
            <h2>Empower Your Learning with AI</h2>
            <hr />
            <h3>Enhance Your Skills with Cutting-Edge Technology</h3>
            <Button variant="warning">Learn More</Button>
          </div>
          <div className="carousel-image-container">
            {!imageError.banner2 ? (
              <img
                className="carousel-image"
                src="/Images/banner_revamp_02.avif"
                alt="Technology Learning"
                onError={() => handleImageError('banner2')}
              />
            ) : (
              <div className="image-placeholder">Image not available</div>
            )}
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item interval={500}>
        <div className="carousel-item-content">
          <div className="carousel-text">
            <h2>
              Transform Your Career with Advanced Learning
            </h2>
            <hr />
            <h3>Join Our Community of Innovators</h3>
            <Button variant="warning">Learn More</Button>
          </div>
          <div className="carousel-image-container">
            {!imageError.banner3 ? (
              <img
                className="carousel-image"
                src="/Images/banner_revamp_03.avif"
                alt="Career Growth"
                onError={() => handleImageError('banner3')}
              />
            ) : (
              <div className="image-placeholder">Image not available</div>
            )}
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default MyCustomCarousel;
