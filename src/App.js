import { useState, useEffect } from 'react';
import { supabase } from './supabase';

function StatCard(props) {
  return (
    <div style={{
      background: 'white', borderRadius: '8px', padding: '6px 14px',
      textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'inline-block', margin: '0 4px'
    }}>
      <div style={{ fontSize: '20px', fontWeight: '800', color: '#2E6DA4' }}>{props.number}</div>
      <div style={{ fontSize: '14px', color: '#64748B' }}>{props.label}</div>
    </div>
  );
}

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [form, setForm] = useState({
    company: '', role: '', status: 'Applied', type: 'Internship', date_applied: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase fetch error:', error);
        setError('Failed to load jobs: ' + error.message);
        setJobs([]);
      } else {
        console.log('Fetched jobs:', data);
        setJobs(data || []);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error: ' + err.message);
      setJobs([]);
    }
    setLoading(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAdd() {
    if (!form.company || !form.role) return;
    const newJob = {
      company: form.company,
      role: form.role,
      status: form.status,
      type: form.type,
      date_applied: form.date_applied || null,
    };
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([newJob])
        .select();
      if (error) {
        console.error('Supabase insert error:', error);
        alert('Error adding job: ' + error.message);
      } else {
        setJobs([data[0], ...jobs]);
        setForm({ company: '', role: '', status: 'Applied', type: 'Internship', date_applied: '' });
      }
    } catch (err) {
      console.error('Network error adding job:', err);
      alert('Network error: ' + err.message);
    }
  }

  async function handleDelete(id) {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Supabase delete error:', error);
        alert('Error removing job: ' + error.message);
      } else {
        setJobs(jobs.filter(j => j.id !== id));
      }
    } catch (err) {
      console.error('Network error deleting job:', err);
      alert('Network error: ' + err.message);
    }
  }

  const applied    = jobs.filter(j => j.status === 'Applied').length;
  const interviews = jobs.filter(j => j.status === 'Interview').length;
  const offers     = jobs.filter(j => j.status === 'Offer').length;
  const rejected   = jobs.filter(j => j.status === 'Rejected').length;

  const filteredJobs = activeFilter === 'All'
    ? jobs
    : jobs.filter(j => j.status === activeFilter);

  const inputStyle = {
    padding: '7px 12px', borderRadius: '8px', border: '1.5px solid #E2E8F0',
    fontSize: '12px', fontFamily: 'Segoe UI', outline: 'none', width: '100%',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '10px', fontWeight: '700', color: '#64748B',
    display: 'block', marginBottom: '3px', textTransform: 'uppercase'
  };

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: '#F1F5F9', padding: '16px', boxSizing: 'border-box', overflow: 'hidden'
    }}>

      {/* ── HEADER + STATS ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '12px', flexShrink: 0
      }}>
        <div style={{ flex: 1 }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1 style={{ color: '#1A3F6F', fontSize: '33px', margin: 0, fontWeight: '800' }}>
            Jaisukh's Job Tracker
          </h1>
          <p style={{ color: '#64748B', fontSize: '20px', marginTop: '3px' }}>
            Data / Business Analyst Roles · 2026
          </p>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <StatCard number={applied}    label="Applied"    />
          <StatCard number={interviews} label="Interviews" />
          <StatCard number={offers}     label="Offers"     />
          <StatCard number={rejected}   label="Rejected"   />
        </div>
      </div>

      {/* ── FORM ── */}
      <div style={{
        background: 'white', borderRadius: '10px', padding: '14px 18px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '12px', flexShrink: 0
      }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1A3F6F', marginBottom: '10px' }}>
          ➕ Add New Application
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div>
            <label style={labelStyle}>Company</label>
            <input style={inputStyle} name="company" value={form.company} onChange={handleChange} placeholder="e.g. Google" />
          </div>
          <div>
            <label style={labelStyle}>Role</label>
            <input style={inputStyle} name="role" value={form.role} onChange={handleChange} placeholder="e.g. Data Analyst Intern" />
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <select style={inputStyle} name="type" value={form.type} onChange={handleChange}>
              <option>Internship</option>
              <option>Full-Time</option>
              <option>Contract</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} name="status" value={form.status} onChange={handleChange}>
              <option>Applied</option>
              <option>Screening</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date Applied</label>
            <input style={inputStyle} type="date" name="date_applied" value={form.date_applied} onChange={handleChange} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <button onClick={handleAdd} style={{
              padding: '7px 20px', background: '#1A3F6F', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '12px',
              fontWeight: '700', cursor: 'pointer', height: '32px'
            }}>
              Add Application
            </button>
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div style={{
        flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        background: 'white', borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minHeight: 0
      }}>
        <div style={{
          padding: '10px 16px', borderBottom: '1px solid #F1F5F9',
          flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#1A3F6F' }}>
            Applications ({filteredJobs.length} of {jobs.length})
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'].map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                padding: '4px 12px', borderRadius: '20px', fontSize: '11px',
                fontWeight: '600', cursor: 'pointer', border: '1.5px solid',
                borderColor: activeFilter === f ? '#1A3F6F' : '#E2E8F0',
                background: activeFilter === f ? '#1A3F6F' : 'white',
                color: activeFilter === f ? 'white' : '#64748B',
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '14px' }}>
              ⏳ Loading your applications...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#EF4444', fontSize: '13px' }}>
              ❌ {error}
              <br /><br />
              <button onClick={fetchJobs} style={{ padding: '8px 16px', background: '#1A3F6F', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                Retry
              </button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1A3F6F', position: 'sticky', top: 0, zIndex: 1 }}>
                  {['Company', 'Role', 'Type', 'Status', 'Date Applied', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94A3B8', fontSize: '13px' }}>
                      No applications yet — add your first one above! 🚀
                    </td>
                  </tr>
                ) : filteredJobs.map((job, i) => (
                  <tr key={job.id} style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? 'white' : '#FAFBFC' }}>
                    <td style={{ padding: '11px 16px', fontWeight: '700', color: '#0F172A', fontSize: '13px' }}>{job.company}</td>
                    <td style={{ padding: '11px 16px', color: '#475569', fontSize: '12px' }}>{job.role}</td>
                    <td style={{ padding: '11px 16px', color: '#475569', fontSize: '12px' }}>{job.type}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                        background: job.status === 'Applied' ? '#EFF6FF' : job.status === 'Screening' ? '#E0F2FE' : job.status === 'Interview' ? '#F5F3FF' : job.status === 'Offer' ? '#ECFDF5' : '#FEF2F2',
                        color: job.status === 'Applied' ? '#3B82F6' : job.status === 'Screening' ? '#0EA5E9' : job.status === 'Interview' ? '#8B5CF6' : job.status === 'Offer' ? '#10B981' : '#EF4444',
                      }}>
                        {job.status}
                      </span>
                    </td>
                    <td style={{ padding: '11px 16px', color: '#475569', fontSize: '12px' }}>{job.date_applied || '—'}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <button onClick={() => handleDelete(job.id)} style={{
                        background: '#FEF2F2', border: '1px solid #FECACA',
                        color: '#EF4444', borderRadius: '6px', padding: '3px 10px',
                        fontSize: '11px', cursor: 'pointer'
                      }}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}

export default App;