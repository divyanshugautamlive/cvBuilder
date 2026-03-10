import React from 'react';

/**
 * Executive Cover Letter Template - Bold dark header with gradient accent
 * Professional, premium feel with dark banner and serif body
 */
const CLExecutiveTemplate = ({ data, resumeData }) => {
    const formatDate = () =>
        new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div style={{
            fontFamily: '"Georgia", "Times New Roman", serif',
            color: '#1a1a1a',
            lineHeight: '1.7',
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden',
        }}>
            {/* Gradient accent bar */}
            <div style={{
                height: '5px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            }} />

            {/* Dark header banner */}
            <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                padding: '32px 40px',
                color: '#ffffff',
            }}>
                <h1 style={{
                    fontSize: '24px', fontWeight: '700', margin: '0 0 6px',
                    fontFamily: '"Inter", system-ui, sans-serif',
                    letterSpacing: '0.02em',
                }}>
                    {resumeData.personalInfo?.fullName || 'Your Name'}
                </h1>
                <p style={{
                    fontSize: '12px', color: 'rgba(255,255,255,0.7)',
                    margin: 0, letterSpacing: '0.04em',
                    fontFamily: '"Inter", system-ui, sans-serif',
                }}>
                    {[
                        resumeData.personalInfo?.email,
                        resumeData.personalInfo?.phone,
                        resumeData.personalInfo?.location
                    ].filter(Boolean).join('  •  ')}
                </p>
            </div>

            {/* Body */}
            <div style={{ padding: '32px 40px' }}>
                {/* Date */}
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 22px' }}>{formatDate()}</p>

                {/* Recipient */}
                {(data.recipientName || data.recipientTitle || data.companyName) && (
                    <div style={{ marginBottom: '22px', fontSize: '14px', lineHeight: '1.6' }}>
                        {data.recipientName && <p style={{ margin: 0, fontWeight: '600' }}>{data.recipientName}</p>}
                        {data.recipientTitle && <p style={{ margin: 0, color: '#6b7280' }}>{data.recipientTitle}</p>}
                        {data.companyName && <p style={{ margin: 0, color: '#6b7280' }}>{data.companyName}</p>}
                    </div>
                )}

                {/* Greeting */}
                <p style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 18px', color: '#1a1a2e' }}>
                    Dear {data.recipientName || 'Hiring Manager'},
                </p>

                {/* Content paragraphs */}
                <div style={{ marginBottom: '24px' }}>
                    {data.opening ? (
                        <p style={{ fontSize: '14px', margin: '0 0 16px', textAlign: 'justify' }}>{data.opening}</p>
                    ) : (
                        <p style={{ fontSize: '14px', margin: '0 0 16px', color: '#9ca3af', fontStyle: 'italic' }}>Your opening paragraph will appear here...</p>
                    )}

                    {data.body ? (
                        <p style={{ fontSize: '14px', margin: '0 0 16px', textAlign: 'justify' }}>{data.body}</p>
                    ) : (
                        <p style={{ fontSize: '14px', margin: '0 0 16px', color: '#9ca3af', fontStyle: 'italic' }}>Your main content will appear here...</p>
                    )}

                    {data.closing ? (
                        <p style={{ fontSize: '14px', margin: 0, textAlign: 'justify' }}>{data.closing}</p>
                    ) : (
                        <p style={{ fontSize: '14px', margin: 0, color: '#9ca3af', fontStyle: 'italic' }}>Your closing paragraph will appear here...</p>
                    )}
                </div>

                {/* Signature */}
                <div style={{ marginTop: '32px' }}>
                    <p style={{ fontSize: '14px', margin: '0 0 24px' }}>Sincerely,</p>
                    <div style={{
                        borderTop: '2px solid #1a1a2e',
                        paddingTop: '10px',
                        display: 'inline-block',
                    }}>
                        <p style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#1a1a2e' }}>
                            {resumeData.personalInfo?.fullName || 'Your Name'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CLExecutiveTemplate;
