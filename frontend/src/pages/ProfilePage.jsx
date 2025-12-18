import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../state/AuthContext';
import AppLayout from '../components/AppLayout';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getChartColor(percent) {
  if (percent === 0) return '#6b7280'; // grey
  if (percent > 0 && percent <= 30) return '#ef4444'; // red
  if (percent > 30 && percent <= 60) return '#f97316'; // orange
  if (percent > 60 && percent < 100) return '#eab308'; // yellow
  return '#22c55e'; // 100% green
}

function PercentChart({ percent }) {
  const angle = Math.round((percent / 100) * 360);
  const color = getChartColor(percent);

  return (
    <div
      className="percent-chart"
      style={{
        '--angle': `${angle}deg`,
        '--chart-color': color
      }}
    >
      <div className="percent-chart-inner">
        <span className="percent-chart-value">{percent}%</span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
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
          err.response?.data?.message || 'Failed to load profile data. Please refresh.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const { overall, courses } = useMemo(() => {
    let total = 0;
    let done = 0;
    const courseList = topics.map((topic) => {
      const topicTotal = topic.problems.length;
      let topicDone = 0;
      topic.problems.forEach((p) => {
        if (progress[p.id]) topicDone += 1;
      });
      total += topicTotal;
      done += topicDone;
      const percent = topicTotal ? Math.round((topicDone / topicTotal) * 100) : 0;
      const remaining = topicTotal - topicDone;
      const statusText =
        percent === 100 ? 'Course completed' : `${remaining}/${topicTotal} remaining`;
      return {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        done: topicDone,
        total: topicTotal,
        percent,
        remaining,
        statusText
      };
    });

    const overallPercent = total ? Math.round((done / total) * 100) : 0;

    return {
      overall: { total, done, percent: overallPercent },
      courses: courseList
    };
  }, [topics, progress]);

  const headerRight = (
    <div className="progress-summary">
      <span className="progress-label">Overall Progress</span>
      <span className="progress-value">
        {overall.done}/{overall.total} ({overall.percent}%)
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
      <section className="profile-hero">
        <h2>
          {getGreeting()}, <span className="highlight-text">{user?.email}</span>
        </h2>
        <p className="profile-subtitle">
          Here&apos;s a snapshot of your DSA courses and how far you&apos;ve progressed.
        </p>
      </section>

      <section className="courses-grid">
        {courses.map((course) => (
          <article key={course.id} className="course-card">
            <div className="course-main">
              <h3 className="course-title">{course.title}</h3>
              {course.description && (
                <p className="course-description">{course.description}</p>
              )}
              <div className="course-meta">
                <span className="course-status-text">{course.statusText}</span>
                <span className="course-count-text">
                  Solved {course.done}/{course.total}
                </span>
              </div>
            </div>
            <PercentChart percent={course.percent} />
          </article>
        ))}
      </section>
    </AppLayout>
  );
}


