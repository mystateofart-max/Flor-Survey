import { getResponses } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ReportPage() {
  let responses = [];
  try {
    responses = await getResponses();
  } catch (err) {
    console.error('Failed to load responses', err);
  }

  return (
    <main className="page-container" style={{ padding: '40px 20px', alignItems: 'flex-start', display: 'block' }}>
      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px' }}>Survey Responses & Report</h1>
          <div style={{ padding: '8px 16px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            Total Responses: <strong>{responses.length}</strong>
          </div>
        </div>

        {responses.length === 0 ? (
          <div style={{ padding: '40px', background: 'var(--surface)', borderRadius: '12px', textAlign: 'center', color: '#94A3B8', border: '1px solid var(--border)' }}>
            No responses yet. Share the survey link to get started!
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {responses.map((res, i) => (
              <div key={res.id} style={{ padding: '24px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                  <h3 style={{ color: 'var(--primary)' }}>Response #{responses.length - i}</h3>
                  <span style={{ color: '#94A3B8', fontSize: '14px' }}>
                    {new Date(res.created_at).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                  <div className="res-item">
                    <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '4px' }}>Identify losing member</p>
                    <p style={{ fontWeight: 500 }}>{res.q_identify_member}</p>
                  </div>
                  <div className="res-item">
                    <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '4px' }}>Try to save</p>
                    <p style={{ fontWeight: 500 }}>{res.q_try_to_save}</p>
                  </div>
                  <div className="res-item">
                    <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '4px' }}>Does it work</p>
                    <p style={{ fontWeight: 500 }}>{res.q_does_it_work}</p>
                  </div>
                  <div className="res-item">
                    <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '4px' }}>Track attendance</p>
                    <p style={{ fontWeight: 500 }}>{res.q_track_attendance}</p>
                  </div>
                  <div className="res-item">
                    <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '4px' }}>Frustration Rating (/10)</p>
                    <p style={{ fontWeight: 500 }}>{res.q_frustration_rating}</p>
                  </div>
                  <div className="res-item">
                    <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '4px' }}>Trainers identify attention</p>
                    <p style={{ fontWeight: 500 }}>{res.q_trainers_identify}</p>
                  </div>
                  <div className="res-item">
                    <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '4px' }}>Predictive feature help?</p>
                    <p style={{ fontWeight: 500 }}>{res.q_feature_help}</p>
                  </div>
                  <div className="res-item">
                    <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '4px' }}>Software manual labor</p>
                    <p style={{ fontWeight: 500 }}>{res.q_software_manual_labor}</p>
                  </div>
                  <div className="res-item">
                    <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '4px' }}>Rate 15% churn drop without work</p>
                    <p style={{ fontWeight: 500 }}>{res.q_churn_drop_rating}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
