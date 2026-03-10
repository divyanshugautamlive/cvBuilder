import React from 'react';

/**
 * Mars Cover Letter Template - Clean, compact, ATS-safe
 * Sans-serif with teal accent left border
 */
const CLMarsTemplate = ({ data, resumeData }) => {
    const accent = '#0d9488';
    const formatDate = () =>
        new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div style={{
            fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
            color: '#1f2937',
            lineHeight: '1.65',
            padding: '36px 40px',
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
            {/* Top accent bar */}
            <div style={{ height: '4px', background: accent, borderRadius: '2px 2px 0 0', marginBottom: '28px' }} />

            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                paddingBottom: '20px', borderBottom: `2px solid ${accent}20`, marginBottom: '24px'
            }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                        {resumeData.personalInfo?.fullName || 'Your Name'}
                    </h1>
                    {resumeData.personalInfo?.title && (
                        <p style={{ fontSize: '13px', fontWeight: '600', color: accent, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {resumeData.personalInfo.title}
                        </p>
                    )}
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#6b7280', lineHeight: '1.8' }}>
                    {resumeData.personalInfo?.email && <div>{resumeData.personalInfo.email}</div>}
                    {resumeData.personalInfo?.phone && <div>{resumeData.personalInfo.phone}</div>}
                    {resumeData.personalInfo?.location && <div>{resumeData.personalInfo.location}</div>}
                </div>
            </div>

            {/* Date */}
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px' }}>{formatDate()}</p>

            {/* Recipient */}
            {(data.recipientName || data.recipientTitle || data.companyName) && (
                <div style={{ marginBottom: '20px', fontSize: '13px', lineHeight: '1.7' }}>
                    {data.recipientName && <p style={{ margin: 0, fontWeight: '600' }}>{data.recipientName}</p>}
                    {data.recipientTitle && <p style={{ margin: 0, color: '#6b7280' }}>{data.recipientTitle}</p>}
                    {data.companyName && <p style={{ margin: 0, color: '#6b7280' }}>{data.companyName}</p>}
                </div>
            )}

            {/* Greeting */}
            <p style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 16px' }}>
                Dear {data.recipientName || 'Hiring Manager'},
            </p>

            {/* Body with accent left border */}
            <div style={{
                borderLeft: `3px solid ${accent}`,
                paddingLeft: '18px',
                marginBottom: '24px',
            }}>
                {data.opening ? (
                    <p style={{ fontSize: '13.5px', margin: '0 0 14px', color: '#374151' }}>{data.opening}</p>
                ) : (
                    <p style={{ fontSize: '13.5px', margin: '0 0 14px', color: '#9ca3af', fontStyle: 'italic' }}>Your opening paragraph will appear here...</p>
                )}

                {data.body ? (
                    <p style={{ fontSize: '13.5px', margin: '0 0 14px', color: '#374151' }}>{data.body}</p>
                ) : (
                    <p style={{ fontSize: '13.5px', margin: '0 0 14px', color: '#9ca3af', fontStyle: 'italic' }}>Your main content will appear here...</p>
                )}

                {data.closing ? (
                    <p style={{ fontSize: '13.5px', margin: 0, color: '#374151' }}>{data.closing}</p>
                ) : (
                    <p style={{ fontSize: '13.5px', margin: 0, color: '#9ca3af', fontStyle: 'italic' }}>Your closing paragraph will appear here...</p>
                )}
            </div>

            {/* Signature */}
            <div style={{ marginTop: '28px' }}>
                <p style={{ fontSize: '14px', margin: '0 0 20px', color: '#374151' }}>Sincerely,</p>
                <p style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#111827' }}>
                    {resumeData.personalInfo?.fullName || 'Your Name'}
                </p>
            </div>
        </div>
    );
};

export default CLMarsTemplate;
