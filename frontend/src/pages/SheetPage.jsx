import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import AppLayout from '../components/AppLayout';

function DifficultyPill({ difficulty }) {
  const colorClass =
    difficulty === 'Easy'
      ? 'pill-easy'
      : difficulty === 'Medium'
      ? 'pill-medium'
      : 'pill-tough';

  return <span className={`pill ${colorClass}`}>{difficulty}</span>;
}

export default function SheetPage() {
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const [topicsRes, progressRes] = await Promise.all([
          api.get('/topics'),
          api.get('/progress')
        ]);
        setTopics(topicsRes.data || []);
        setProgress(progressRes.data || {});
      } catch (err) {
        const msg =
          err.response?.data?.message || 'Failed to load data. Please refresh.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalStats = useMemo(() => {
    let total = 0;
    let done = 0;
    topics.forEach((topic) => {
      topic.problems.forEach((p) => {
        total += 1;
        if (progress[p.id]) done += 1;
      });
    });
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
  }, [topics, progress]);

  const handleToggle = async (problemId) => {
    const nextValue = !progress[problemId];
    setProgress((prev) => ({ ...prev, [problemId]: nextValue }));
    try {
      await api.post('/progress', { problemId, completed: nextValue });
    } catch (err) {
      // revert on failure
      setProgress((prev) => ({ ...prev, [problemId]: !nextValue }));
      // optional: show toast; keeping UI simple with console for now
      // eslint-disable-next-line no-console
      console.error('Failed to update progress', err);
    }
  };

  const headerRight = (
    <div className="progress-summary">
      <span className="progress-label">Overall Progress</span>
      <span className="progress-value">
        {totalStats.done}/{totalStats.total} ({totalStats.percent}%)
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="centered">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <AppLayout headerRight={headerRight}>
      {error && <div className="error-banner">{error}</div>}
      <div className="sheet-page">
        <div className="sheet-header-block">
          <h2>Topic-wise DSA Sheet</h2>
          <p className="sheet-subtitle">
            Work through curated topics and mark problems as you complete them.
          </p>
        </div>
        <div className="sheet-content">
          {topics.map((topic) => {
            const topicTotal = topic.problems.length;
            const topicDone = topic.problems.filter((p) => progress[p.id]).length;
            const topicPercent = topicTotal
              ? Math.round((topicDone / topicTotal) * 100)
              : 0;

            return (
              <section key={topic.id} className="topic-card">
                <div className="topic-header">
                  <div>
                    <h3>{topic.title}</h3>
                    {topic.description && (
                      <p className="topic-description">{topic.description}</p>
                    )}
                  </div>
                  <div className="topic-progress">
                    <span className="progress-label">Topic Progress</span>
                    <span className="progress-value">
                      {topicDone}/{topicTotal} ({topicPercent}%)
                    </span>
                  </div>
                </div>
                <div className="problems-table">
                  <div className="problems-header">
                    <span className="col-checkbox">Done</span>
                    <span className="col-status">Status</span>
                    <span className="col-title">Problem</span>
                    <span className="col-difficulty">Level</span>
                    <span className="col-links">Tutorials / Practice / Article</span>
                  </div>
                  {topic.problems.map((problem) => {
                    const completed = !!progress[problem.id];
                    return (
                      <div key={problem.id} className="problem-row">
                        <span className="col-checkbox">
                          <input
                            type="checkbox"
                            checked={completed}
                            onChange={() => handleToggle(problem.id)}
                          />
                        </span>
                        <span className="col-status">
                          <span
                            className={
                              completed
                                ? 'status-pill status-completed'
                                : 'status-pill status-pending'
                            }
                          >
                            {completed ? 'Completed' : 'Pending'}
                          </span>
                        </span>
                        <span className="col-title">{problem.title}</span>
                        <span className="col-difficulty">
                          <DifficultyPill difficulty={problem.difficulty} />
                        </span>
                        <span className="col-links">
                          {problem.youtubeUrl && (
                            <a
                              href={problem.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="link-chip"
                            >
                              YouTube
                            </a>
                          )}
                          {problem.leetCodeUrl && (
                            <a
                              href={problem.leetCodeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="link-chip"
                            >
                              LeetCode
                            </a>
                          )}
                          {problem.codeforcesUrl && (
                            <a
                              href={problem.codeforcesUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="link-chip"
                            >
                              Codeforces
                            </a>
                          )}
                          {problem.articleUrl && (
                            <a
                              href={problem.articleUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="link-chip"
                            >
                              Article
                            </a>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

