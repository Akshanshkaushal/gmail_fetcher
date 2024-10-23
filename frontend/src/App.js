
import React, { useEffect, useState } from 'react';
import './App.css'; // Ensure your CSS file is imported

// Navbar component
const Navbar = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleNavbar = () => {
    setIsActive(!isActive);
  };

    return (
    <nav className={`navbar ${isActive ? 'active' : ''}`}>
      <div className="navbar-container">
        <div className="menu-icon" onClick={toggleNavbar}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <ul className="navbar-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#internship">Internship</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

// Main EmailsDisplay component
const EmailsDisplay = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [emailsPerPage] = useState(5); // Emails per page

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/emails');
        const data = await response.json();
        setEmails(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchEmails();
  }, []);

  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);

  const paginate = (pageNumber) => {
    console.log(`Navigating to page: ${pageNumber}`); // Debugging output
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {/* Include Navbar at the top */}
      <Navbar />

      <div className="email-container" id="internship">
        <h1>Internship-related Emails</h1>
        {currentEmails.length === 0 ? (
          <p>No emails found.</p>
        ) : (
          <div className="job-listings-container"> {/* Updated to Grid */}
            {currentEmails.map((email, index) => (
              <div className="email-card" key={index}>
                <h2>Subject: {email.subject}</h2>

                <h3>Job Listings:</h3>
                {email.jobsList && email.jobsList.length > 0 ? (
                  <div>
                    {email.jobsList.map((job, i) => (
                      <div key={i} className="job-item-box">  {/* Each job item has its own box */}
                        <div className="job-title-box">
                          <h4>{job.title} at {job.company}</h4>
                        </div>
                        <div className="job-location-box">
                          <p><strong>Location:</strong> {job.location}</p>
                        </div>
                        <div className="job-url-box">
                          <p>
                            <strong>URL:</strong> 
                            <a href={job.url} target="_blank" rel="noopener noreferrer" className="visit-site-button">
                              Apply Here
                            </a>
                          </p>
                        </div>
                        {job.links && job.links.length > 0 && (
                          <div className="job-links-box">
                            <strong>Job Links:</strong>
                            {job.links.map((link, j) => (
                              <a href={link} key={j} target="_blank" rel="noopener noreferrer">
                                {new URL(link).hostname} {/* Shortened URL for additional links */}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No job listings found in this email.</p>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Pagination Component */}
        <Pagination
          emailsPerPage={emailsPerPage}
          totalEmails={emails.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>

      <div id="contact" className="contact-section">
        <h2>Contact Us</h2>
        <p>Email us at: contact@example.com</p>
      </div>
    </>
  );
};

// Pagination component for email navigation
const Pagination = ({ emailsPerPage, totalEmails, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalEmails / emailsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default EmailsDisplay;



