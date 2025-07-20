import React, { useState } from 'react';
import { FaFileAlt, FaChartLine, FaMagic, FaStar, FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';
import ResumeParsing from '../components/ResumeParsing';
// Import custom styles for Home component
import '../components/ResumeParsing.css'; // Import styles for ResumeParsing component
const Home = () => {
  const [showParser, setShowParser] = useState(false);

  return (
    <div className="home">
      <Header onScoreClick={() => setShowParser(true)} />

      {/* Conditionally render ResumeParsing inline */}
      {showParser ? (
        <div className="parser-container px-4 py-8">
          <button 
            onClick={() => setShowParser(false)} 
            className="mb-6 text-blue-600 hover:underline"
          >
            &larr; Back to Home
          </button>
          <ResumeParsing />
        </div>
      ) : (
        <>
          <Features />
          <HowItWorks />
          <Testimonials />
          <CallToAction />
        </>
      )}

      <Footer />
    </div>
  );
};

const Header = ({ onScoreClick }) => {
  return (
    <header className="header">
      <div className="container">
        <nav>
          <div className="logo">
            <FaFileAlt className="logo-icon" />
            <span>ResumeScorer</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <button onClick={onScoreClick} className="cta-button">Get Started</button>
          </div>
        </nav>
        
        <div className="hero">
          <div className="hero-content">
            <h1>Optimize Your Resume for Success</h1>
            <p>Get instant feedback on your resume with our AI-powered scoring system. Improve your chances of landing interviews and stand out from the competition.</p>
            <button onClick={onScoreClick} className="cta-button">
              Score My Resume Now
            </button>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Resume scoring illustration" />
          </div>
        </div>
      </div>
    </header>
  );
};

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-title">
          <h2>Powerful Features</h2>
          <p>ResumeScorer provides comprehensive analysis to help you create the perfect resume</p>
        </div>
        
        <div className="features-grid">
          <FeatureCard 
            icon={<FaChartLine />} 
            title="ATS Optimization" 
            description="Ensure your resume passes through Applicant Tracking Systems with flying colors." 
          />
          <FeatureCard 
            icon={<FaMagic />} 
            title="Keyword Analysis" 
            description="Identify missing keywords that recruiters are looking for in your industry." 
          />
          <FeatureCard 
            icon={<FaStar />} 
            title="Score Breakdown" 
            description="Get detailed scores for different sections of your resume with improvement tips." 
          />
        </div>
      </div>
    </section>
  );
};
const HeroSection = () => {
  const [showParser, setShowParser] = useState(false);

  if (showParser) {
    return <ResumeParsing onBack={() => setShowParser(false)} />;
  }

  return (
    <div className="hero-content">
      <h1>Optimize Your Resume for Success</h1>
      <p>Get instant feedback...</p>
      <button 
        onClick={() => setShowParser(true)}
        className="cta-button"
      >
        Score My Resume Now
      </button>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="section-title">
          <h2>How It Works</h2>
          <p>Get your resume score in just 3 simple steps</p>
        </div>
        
        <div className="steps">
          <Step 
            number="1" 
            title="Upload Your Resume" 
            description="Upload your resume in PDF, DOCX, or TXT format. We support all major file types." 
          />
          <Step 
            number="2" 
            title="AI Analysis" 
            description="Our advanced algorithms analyze your resume against industry standards and job requirements." 
          />
          <Step 
            number="3" 
            title="Get Results" 
            description="Receive your comprehensive score report with actionable improvement suggestions." 
          />
        </div>
      </div>
    </section>
  );
};

const Step = ({ number, title, description }) => {
  return (
    <div className="step">
      <div className="step-number">{number}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-title">
          <h2>Success Stories</h2>
          <p>Hear from people who improved their resumes with ResumeScorer</p>
        </div>
        
        <div className="testimonial-grid">
          <TestimonialCard 
            text="ResumeScorer helped me identify gaps in my resume I didn't even know existed. After implementing their suggestions, I got 3 interview calls in one week!"
            initials="JS"
            name="Jessica Smith"
            role="Marketing Professional"
          />
          <TestimonialCard 
            text="The keyword analysis was a game-changer for me. I was able to tailor my resume perfectly for data science roles and landed my dream job at a FAANG company."
            initials="AR"
            name="Alex Rodriguez"
            role="Data Scientist"
          />
          <TestimonialCard 
            text="As a career switcher, I didn't know how to present my transferable skills. ResumeScorer gave me the confidence to apply for senior roles in my new field."
            initials="MP"
            name="Michael Patel"
            role="Product Manager"
          />
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ text, initials, name, role }) => {
  return (
    <div className="testimonial-card">
      <div className="testimonial-text">{text}</div>
      <div className="testimonial-author">
        <div className="author-avatar">{initials}</div>
        <div className="author-info">
          <h4>{name}</h4>
          <p>{role}</p>
        </div>
      </div>
    </div>
  );
};

const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <h2>Ready to Improve Your Resume?</h2>
        <p>Join thousands of professionals who have optimized their resumes and accelerated their job search.</p>
        <a href="#upload" className="cta-button">Get Started Now</a>
        <a href="#features" className="cta-button secondary-button">Learn More</a>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>ResumeScorer</h3>
            <p>AI-powered resume optimization tool to help you land more interviews and better job offers.</p>
            <div className="social-links">
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaFacebook /></a>
            </div>
          </div>
          
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Resume Tips</a></li>
              <li><a href="#">Career Advice</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Contact</h3>
            <ul>
              <li><a href="mailto:hello@resumescorer.com">hello@resumescorer.com</a></li>
              <li><a href="#">Support Center</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="copyright">
          <p>&copy; 2023 ResumeScorer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Home;