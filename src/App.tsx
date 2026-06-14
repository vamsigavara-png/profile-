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
            </>
          )
        )}
      </div>
    </div>
  );
}

export default App;
