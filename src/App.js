import { useState } from 'react';

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
  const [jobs, setJobs] = useState([
    { id: 1, company: 'Amazon',   role: 'Business Analyst Intern',      status: 'Applied',   type: 'Internship', dateApplied: '2026-02-15' },
    { id: 2, company: 'Google',   role: 'Data Analyst Intern',          status: 'Screening', type: 'Internship', dateApplied: '2026-02-17' },
    { id: 3, company: 'Pfizer',   role: 'Business Analyst – Analytics', status: 'Interview', type: 'Full-Time',  dateApplied: '2026-02-13' },
    { id: 4, company: 'Deloitte', role: 'Data Analyst Intern',          status: 'Rejected',  type: 'Internship', dateApplied: '2026-02-10' },
  ]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [form, setForm] = useState({
    company: '', role: '', status: 'Applied', type: 'Internship', dateApplied: ''
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAdd() {
    if (!form.company || !form.role) return;
    const newJob = {
      id: Date.now(),
      company: form.company,
      role: form.role,
      status: form.status,
      type: form.type,
      dateApplied: form.dateApplied,
    };
    setJobs([...jobs, newJob]);
    setForm({ company: '', role: '', status: 'Applied', type: 'Internship', dateApplied: '' });
  }

  function handleDelete(id) {
    setJobs(jobs.filter(j => j.id !== id));
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
    // Outer wrapper — full screen, no overflow
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#F1F5F9',
      padding: '16px',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>

      {/* ── HEADER + STATS in one row ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        flexShrink: 0
      }}>

        {/* Left — spacer so title stays centered */}
        <div style={{ flex: 1 }} />

        {/* Center — Title */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1 style={{ color: '#1A3F6F', fontSize: '33px', margin: 0, fontWeight: '800' }}>
            Jaisukh's Job Tracker
          </h1>
          <p style={{ color: '#64748B', fontSize: '20px', marginTop: '3px' }}>
            Data / Business Analyst Roles · 2026
          </p>
        </div>

        {/* Right — Stat Cards */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <StatCard number={applied}    label="Applied"    />
          <StatCard number={interviews} label="Interviews" />
          <StatCard number={offers}     label="Offers"     />
          <StatCard number={rejected}   label="Rejected"   />
        </div>

      </div>

      {/* ── FORM ── fixed height */}
      <div style={{
        background: 'white', borderRadius: '10px', padding: '14px 18px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '12px', flexShrink: 0
      }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1A3F6F', marginBottom: '10px' }}>
          ➕ Add New Application
        </div>

        {/* Row 1 */}
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

        {/* Row 2 */}
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
            <input style={inputStyle} type="date" name="dateApplied" value={form.dateApplied} onChange={handleChange} />
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

      {/* ── TABLE ── this section takes remaining space and scrolls inside */}
      <div style={{
        flex: 1,               // takes ALL remaining height
        overflow: 'hidden',    // hides outer scroll
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        minHeight: 0           // important — allows flex child to shrink
      }}>

        {/* Table header — fixed */}
        <div style={{
          padding: '10px 16px', borderBottom: '1px solid #F1F5F9',
          flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#1A3F6F' }}>
            Applications ({filteredJobs.length} of {jobs.length})
          </span>

          {/* Filter buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '1.5px solid',
                  borderColor: activeFilter === f ? '#1A3F6F' : '#E2E8F0',
                  background: activeFilter === f ? '#1A3F6F' : 'white',
                  color: activeFilter === f ? 'white' : '#64748B',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable table body */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1A3F6F', position: 'sticky', top: 0, zIndex: 1 }}>
                {['Company', 'Role', 'Type', 'Status', 'Date Applied', ''].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left',
                    color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job, i) => (
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
                  <td style={{ padding: '11px 16px', color: '#475569', fontSize: '12px' }}>{job.dateApplied || '—'}</td>
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
        </div>
      </div>

    </div>
  );
}

export default App;