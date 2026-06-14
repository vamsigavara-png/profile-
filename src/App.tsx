import { useEffect, useState } from 'react';
import './App.css';

type GitHubProfile = {
  login: string;
  avatar_url: string;
  html_url: string;
  blog: string | null;
  bio: string | null;
  followers: number;
  following: number;
};

const GITHUB_USER = 'vamsigavara-png';
const PROFILE_URL = `https://api.github.com/users/${GITHUB_USER}`;

function setThemeAttribute(theme: 'light' | 'dark') {
  try {
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    /* ignore server */
  }
}

function App() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadGitHubData() {
      try {
        const profileRes = await fetch(PROFILE_URL);

        if (!profileRes.ok) {
          throw new Error('Failed to load GitHub profile.');
        }

        const profileData = (await profileRes.json()) as GitHubProfile;

        setProfile(profileData);
      } catch (err) {
        setError((err as Error).message || 'Failed to load GitHub data.');
      } finally {
        setLoading(false);
      }
    }

    loadGitHubData();
  }, []);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('theme');
      return (saved as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    setThemeAttribute(theme);
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  return (
    <div className="app">
      <div className="app-card">
        <section className="hero">
          <div>
            <h1>vamsi profile</h1>
            <p>
              Showing the public GitHub profile and website links for{' '}
              <strong>{GITHUB_USER}</strong>.
            </p>
          </div>
          <div className="top-nav">
            <button className="btn btn-ghost" onClick={() => window.open(`https://github.com/${GITHUB_USER}`, '_blank')}>View on GitHub</button>
            <button
              aria-label="Toggle theme"
              className="btn btn-accent"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? 'Dark' : 'Light'} mode
            </button>
          </div>
        </section>

        {loading ? (
          <p className="status">Loading GitHub data...</p>
        ) : error ? (
          <p className="status error">{error}</p>
        ) : (
          profile && (
            <>
                <div className="profile-card">
                    <img src={profile.avatar_url} alt={profile.login} />
                    <div>
                      <h2>{profile.login}</h2>
                      {profile.bio && <p>{profile.bio}</p>}
                      <div className="stats-grid">
                        <div className="stat-card">
                          <span className="stat-value">{profile.followers}</span>
                          <span className="stat-label">Followers</span>
                        </div>
                        <div className="stat-card">
                          <span className="stat-value">{profile.following}</span>
                          <span className="stat-label">Following</span>
                        </div>
                      </div>
                      <div className="website-links">
                        <a href={profile.html_url} target="_blank" rel="noreferrer">
                          GitHub profile
                        </a>
                        {profile.blog ? (
                          <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer">
                            Website
                          </a>
                        ) : (
                          <span className="no-website">No website available</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* About, Projects, Contact sections */}
                  <section className="about-section">
                    <h3>About</h3>
                    <p>{profile.bio || "Hi — I'm Vamsi. Welcome to my profile site."}</p>
                  </section>

                  <section className="projects-section">
                    <h3>Projects (websites)</h3>
                    <p className="muted">Only websites are shown — no GitHub repository links.</p>
                    <div className="repo-grid">
                      {(
                        [
                          { id: 'p1', name: 'Personal Blog', url: 'https://vamsigavara-png.github.io' , description: 'Blog and notes.'},
                          { id: 'p2', name: 'Project One', url: 'https://example.com/project-one', description: 'Live demo site.'},
                          { id: 'p3', name: 'Project Two', url: 'https://example.org/project-two', description: 'Demo and docs.'}
                        ]
                      ).map((p) => (
                        <a key={p.id} href={p.url} className="repo-card" target="_blank" rel="noreferrer">
                          <h4>{p.name}</h4>
                          {p.description && <p>{p.description}</p>}
                          <div className="repo-meta">
                            <span>Website</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>

                  <section className="contact-section">
                    <h3>Contact</h3>
                    <p className="muted">Email: <a href="mailto:content-vamsigavara@gmail.com">content-vamsigavara@gmail.com</a></p>
                    <p className="muted">Phone: <a href="tel:+19492641156">+1 949-264-1156</a>, <a href="tel:+19398504835">+1 939-850-4835</a></p>
                  </section>
            </>
          )
        )}
      </div>
    </div>
  );
}

export default App;
