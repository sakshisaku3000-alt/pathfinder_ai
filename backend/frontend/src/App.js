import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // Using state to track which step user is on
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  // Storing all form data in one big object
  const [formData, setFormData] = useState({
    // Academic stuff
    academic: {
      domain: '',
      gpa: '',
      papers: '',
      thesis: ''
    },
    // Work/research experience
    experience: {
      internship: '',
      research: '',
      teaching: '',
      enjoyed: ''
    },
    // Why they want PhD/Industry
    whyPhd: [],
    whyIndustry: [],
    // Work preferences
    workStyle: {
      environment: '',
      preference: ''
    },
    futureVision: '',
    priorities: []
  });

  // Helper function to update nested state
  const updateFormData = (section, field, value) => {
    if (section === 'priorities') {
      setFormData(prev => ({ ...prev, priorities: value }));
    } else if (section === 'whyPhd' || section === 'whyIndustry') {
      setFormData(prev => ({ ...prev, [section]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    }
  };

  // Handle checkbox changes - max 2 selections
  const handleCheckbox = (section, value) => {
    const current = formData[section];
    if (current.includes(value)) {
      // Remove if already selected
      updateFormData(section, null, current.filter(v => v !== value));
    } else if (current.length < 2) {
      // Add if less than 2 selected
      updateFormData(section, null, [...current, value]);
    } else {
      // Show warning if trying to select more than 2
      alert('Please select only 2 options');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Convert to API format
    const apiData = {
      academic: {
        field_of_study: formData.academic.domain,
        specialization: formData.academic.domain, // Using domain as specialization for simplicity
        gpa_range: formData.academic.gpa,
        research_papers: formData.academic.papers === '3+' ? 3 : parseInt(formData.academic.papers) || 0,
        thesis_status: formData.academic.thesis
      },
      experience: {
        internship_months: formData.experience.internship === 'None' ? 0 : 
                          formData.experience.internship === '1-2' ? 2 : 6,
        work_experience_years: 0,
        research_experience: formData.experience.research === 'None' ? 'none' :
                           formData.experience.research === 'Course projects' ? 'course' :
                           formData.experience.research === 'Lab research' ? 'lab' : 'published',
        teaching_experience: formData.experience.teaching === 'None' ? 'none' :
                           formData.experience.teaching === 'TA' ? 'ta' : 'instructor',
        most_enjoyed: formData.experience.enjoyed
      },
      motivations: {
        phd_reasons: formData.whyPhd.length > 0 ? formData.whyPhd : ['passionate-research'],
        industry_reasons: formData.whyIndustry.length > 0 ? formData.whyIndustry : ['financial']
      },
      work_style: {
        work_environment: formData.workStyle.environment || 'independent',
        project_preference: formData.workStyle.preference || 'deep',
        future_vision: formData.futureVision || 'scientist',
        priorities: formData.priorities.length > 0 ? formData.priorities : ['intellectual', 'financial']
      }
    };

    try {
      const response = await axios.post('http://localhost:8000/api/v1/analyze', apiData);
      setResults(response.data);
      setCurrentStep(7); // Results page (changed from 8 to 7)
    } catch (error) {
      alert('Error! Please check all fields are filled and backend is running');
      console.error(error);
    }
    setLoading(false);
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0: // Welcome
        return (
          <div className="card">
            <h2>Welcome to PathFinder AI</h2>
            <p>This AI-powered assessment helps Masters students make informed decisions between pursuing a PhD or entering industry.</p>
            <p>The assessment takes about 5 minutes to complete.</p>
            <button className="btn-primary" onClick={() => setCurrentStep(1)}>
              Start Assessment
            </button>
          </div>
        );

      case 1: // Academic Background
        return (
          <div className="card">
            <h2>1. Academic Background</h2>
            <div className="form-group">
              <label>Core Domain:</label>
              <select 
                value={formData.academic.domain}
                onChange={(e) => updateFormData('academic', 'domain', e.target.value)}
                required
              >
                <option value="">Select your field...</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Data Science">Data Science</option>
                <option value="AI/Machine Learning">AI/Machine Learning</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Biological Sciences">Biological Sciences</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Current GPA Range:</label>
              <select 
                value={formData.academic.gpa}
                onChange={(e) => updateFormData('academic', 'gpa', e.target.value)}
                required
              >
                <option value="">Select GPA range...</option>
                <option value="1.0-1.3">1.0-1.3 (Excellent)</option>
                <option value="1.4-1.7">1.4-1.7 (Very Good)</option>
                <option value="1.8-2.3">1.8-2.3 (Good)</option>
                <option value="2.4-2.7">2.4-2.7 (Above Average)</option>
                <option value="2.8-3.3">2.8-3.3 (Average)</option>
                <option value="3.4-4.0">3.4-4.0 (Below Average)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Research Papers Published:</label>
              <select 
                value={formData.academic.papers}
                onChange={(e) => updateFormData('academic', 'papers', e.target.value)}
                required
              >
                <option value="">Select...</option>
                <option value="0">0</option>
                <option value="1">1-2</option>
                <option value="3+">3+</option>
              </select>
            </div>

            <div className="form-group">
              <label>Thesis Status:</label>
              <select 
                value={formData.academic.thesis}
                onChange={(e) => updateFormData('academic', 'thesis', e.target.value)}
                required
              >
                <option value="">Select...</option>
                <option value="not-started">Not started</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="button-group">
              <button onClick={() => setCurrentStep(0)}>Back</button>
              <button className="btn-primary" onClick={() => setCurrentStep(2)}>Next</button>
            </div>
          </div>
        );

      case 2: // Experience Profile
        return (
          <div className="card">
            <h2>2. Experience Profile</h2>
            <div className="form-group">
              <label>Internship Experience:</label>
              <select 
                value={formData.experience.internship}
                onChange={(e) => updateFormData('experience', 'internship', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="None">None</option>
                <option value="1-2">1-2 months</option>
                <option value="3+">3+ months</option>
              </select>
            </div>

            <div className="form-group">
              <label>Research Experience:</label>
              <select 
                value={formData.experience.research}
                onChange={(e) => updateFormData('experience', 'research', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="None">None</option>
                <option value="Course projects">Course projects</option>
                <option value="Lab research">Lab research</option>
                <option value="Published work">Published work</option>
              </select>
            </div>

            <div className="form-group">
              <label>Teaching Experience:</label>
              <select 
                value={formData.experience.teaching}
                onChange={(e) => updateFormData('experience', 'teaching', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="None">None</option>
                <option value="TA">TA</option>
                <option value="Instructor">Instructor</option>
              </select>
            </div>

            <div className="form-group">
              <label>Which did you enjoy most?</label>
              <div className="radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="enjoyed" 
                    value="research"
                    checked={formData.experience.enjoyed === 'research'}
                    onChange={(e) => updateFormData('experience', 'enjoyed', e.target.value)}
                  /> Research
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="enjoyed" 
                    value="internship"
                    checked={formData.experience.enjoyed === 'internship'}
                    onChange={(e) => updateFormData('experience', 'enjoyed', e.target.value)}
                  /> Internship
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="enjoyed" 
                    value="teaching"
                    checked={formData.experience.enjoyed === 'teaching'}
                    onChange={(e) => updateFormData('experience', 'enjoyed', e.target.value)}
                  /> Teaching
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="enjoyed" 
                    value="none"
                    checked={formData.experience.enjoyed === 'none'}
                    onChange={(e) => updateFormData('experience', 'enjoyed', e.target.value)}
                  /> Not sure yet
                </label>
              </div>
            </div>

            <div className="button-group">
              <button onClick={() => setCurrentStep(1)}>Back</button>
              <button className="btn-primary" onClick={() => setCurrentStep(3)}>Next</button>
            </div>
          </div>
        );

      case 3: // Why Questions
        return (
          <div className="card">
            <h2>3. Your Motivations</h2>
            <div className="form-group">
              <label>Why are you considering PhD? (Select up to 2)</label>
              <div className="checkbox-group">
                {[
                  { value: 'passionate-research', label: 'Passionate about research' },
                  { value: 'professor', label: 'Want to become a professor' },
                  { value: 'expert', label: 'Want to be an expert in my field' },
                  { value: 'academic-env', label: 'Enjoy academic environment' },
                  { value: 'complex-problems', label: 'Want to solve complex problems' }
                ].map(option => (
                  <label key={option.value}>
                    <input 
                      type="checkbox"
                      checked={formData.whyPhd.includes(option.value)}
                      onChange={() => handleCheckbox('whyPhd', option.value)}
                    /> {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Why are you considering Industry? (Select up to 2)</label>
              <div className="checkbox-group">
                {[
                  { value: 'financial', label: 'Better financial prospects' },
                  { value: 'products', label: 'Want to build products users love' },
                  { value: 'fast-paced', label: 'Prefer fast-paced environment' },
                  { value: 'impact', label: 'Want immediate real-world impact' },
                  { value: 'startup', label: 'Interested in business/startup culture' }
                ].map(option => (
                  <label key={option.value}>
                    <input 
                      type="checkbox"
                      checked={formData.whyIndustry.includes(option.value)}
                      onChange={() => handleCheckbox('whyIndustry', option.value)}
                    /> {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="button-group">
              <button onClick={() => setCurrentStep(2)}>Back</button>
              <button className="btn-primary" onClick={() => setCurrentStep(4)}>Next</button>
            </div>
          </div>
        );

      case 4: // Working Style
        return (
          <div className="card">
            <h2>4. Working Style</h2>
            
            <div className="form-group">
              <label>I work best in:</label>
              <div className="radio-group">
                {[
                  { value: 'independent', label: 'Independent research setting' },
                  { value: 'team', label: 'Collaborative team environment' },
                  { value: 'mix', label: 'Mix of both' }
                ].map(option => (
                  <label key={option.value}>
                    <input 
                      type="radio"
                      name="environment"
                      value={option.value}
                      checked={formData.workStyle.environment === option.value}
                      onChange={(e) => updateFormData('workStyle', 'environment', e.target.value)}
                    /> {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>I prefer:</label>
              <div className="radio-group">
                {[
                  { value: 'deep', label: 'Deep work on one thing' },
                  { value: 'multiple', label: 'Multiple projects simultaneously' },
                  { value: 'varied', label: 'Short-term varied tasks' }
                ].map(option => (
                  <label key={option.value}>
                    <input 
                      type="radio"
                      name="preference"
                      value={option.value}
                      checked={formData.workStyle.preference === option.value}
                      onChange={(e) => updateFormData('workStyle', 'preference', e.target.value)}
                    /> {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="button-group">
              <button onClick={() => setCurrentStep(3)}>Back</button>
              <button className="btn-primary" onClick={() => setCurrentStep(5)}>Next</button>
            </div>
          </div>
        );

      case 5: // Future Vision
        return (
          <div className="card">
            <h2>5. Future Vision</h2>
            
            <div className="form-group">
              <label>In 5-7 years, I see myself as:</label>
              <div className="radio-group">
                {[
                  { value: 'scientist', label: 'Research scientist/Professor' },
                  { value: 'tech-lead', label: 'Technical lead at a company' },
                  { value: 'product', label: 'Product manager/architect' },
                  { value: 'entrepreneur', label: 'Entrepreneur/Startup founder' },
                  { value: 'specialist', label: 'Senior specialist in my domain' }
                ].map(option => (
                  <label key={option.value}>
                    <input 
                      type="radio"
                      name="vision"
                      value={option.value}
                      checked={formData.futureVision === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, futureVision: e.target.value }))}
                    /> {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="button-group">
              <button onClick={() => setCurrentStep(4)}>Back</button>
              <button className="btn-primary" onClick={() => setCurrentStep(6)}>Next</button>
            </div>
          </div>
        );

      case 6: // Priorities
        return (
          <div className="card">
            <h2>6. Your Priorities</h2>
            <p className="subtitle">Rank these from 1 (most important) to 5 (least important)</p>
            
            <div className="priorities-container">
              {['financial', 'intellectual', 'balance', 'growth', 'location'].map((priority, index) => {
                const labels = {
                  financial: 'Financial stability',
                  intellectual: 'Intellectual satisfaction',
                  balance: 'Work-life balance',
                  growth: 'Career growth speed',
                  location: 'Location flexibility'
                };
                
                return (
                  <div key={priority} className="priority-item">
                    <select 
                      value={formData.priorities.indexOf(priority) + 1 || ''}
                      onChange={(e) => {
                        const newPriorities = [...formData.priorities];
                        const oldIndex = newPriorities.indexOf(priority);
                        if (oldIndex > -1) newPriorities.splice(oldIndex, 1);
                        if (e.target.value) {
                          newPriorities.splice(parseInt(e.target.value) - 1, 0, priority);
                        }
                        updateFormData('priorities', null, newPriorities.slice(0, 5));
                      }}
                    >
                      <option value="">-</option>
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <span>{labels[priority]}</span>
                  </div>
                );
              })}
            </div>

            <div className="button-group">
              <button onClick={() => setCurrentStep(5)}>Back</button>
              <button className="btn-primary" onClick={handleSubmit}>
                Get AI Recommendation
              </button>
            </div>
          </div>
        );

      case 7: // Results (changed from case 8)
        return results && (
          <div className="card results-card">
            <h2>Your Personalized Career Recommendation</h2>
            
            <div className="recommendation">
              <h3>{results.ai_recommendation}</h3>
              <p className="confidence">{results.confidence_level}</p>
            </div>

            <div className="section">
              <h3>📝 Your Career Analysis</h3>
              <p className="edit-hint">💡 Click below to edit or personalize your recommendation</p>
              <div 
                className="editable-analysis"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  // Save the edited content
                  setResults({...results, detailed_analysis: e.target.innerText});
                }}
              >
                {results.detailed_analysis || 
                 `Based on your profile, here's our comprehensive analysis:

${results.key_insights ? results.key_insights.join(' ') : ''}

Your next steps should include:
${results.action_items ? results.action_items.map(item => `• ${item}`).join('\n') : ''}

This recommendation is tailored to your unique combination of academic background, experience, and personal preferences. Remember that this is a starting point for your decision-making process - consider discussing these insights with mentors, professors, or industry professionals who know you well.`}
              </div>
            </div>

            <div className="button-group">
              <button onClick={() => {
                setCurrentStep(0);
                setResults(null);
                // Reset form
                setFormData({
                  academic: { domain: '', gpa: '', papers: '', thesis: '' },
                  experience: { internship: '', research: '', teaching: '', enjoyed: '' },
                  whyPhd: [],
                  whyIndustry: [],
                  workStyle: { environment: '', preference: '' },
                  futureVision: '',
                  priorities: []
                });
              }}>Start New Assessment</button>
              
              <button 
                className="btn-primary"
                onClick={() => {
                  // Allow user to continue refining
                  setCurrentStep(1);
                }}
              >
                Refine My Answers
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="App">
        <div className="App-header">
          <h1>🎯 PathFinder AI</h1>
          <p>AI-Powered Career Decision Assistant</p>
        </div>
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <h2>AI is analyzing your profile...</h2>
            <p>This will take just a moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1>🎯 PathFinder AI</h1>
        <p>AI-Powered Career Decision Assistant for Masters Students</p>
      </div>

      <div className="container">
        {/* Progress indicator */}
        {currentStep > 0 && currentStep < 7 && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
            <p className="progress-text">Step {currentStep} of 6</p>
          </div>
        )}
        
        {renderStep()}
      </div>

      <footer>
        <p>PathFinder AI - Built with FastAPI + React + Hugging Face AI</p>
      </footer>
    </div>
  );
}

export default App;