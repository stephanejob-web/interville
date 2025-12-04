import './About.css';

export const About = () => {
  return (
    <div className="about">
      <h1>À propos d'Interville</h1>
      <div className="about-content">
        <p>
          Interville est une application moderne développée avec React et Express.
        </p>
        <div className="about-features">
          <h2>Technologies utilisées</h2>
          <ul>
            <li>React 19</li>
            <li>React Router DOM v7</li>
            <li>Vite</li>
            <li>Express.js</li>
            <li>Axios</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
