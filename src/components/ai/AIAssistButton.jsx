import React, { useState } from 'react';
import '../../styles/ai-components.css';

/**
 * AI Assist Button - Provides AI content generation for form fields
 * Note: Requires API key configuration for production use
 */
const AIAssistButton = ({
    context,
    onGenerate,
    placeholder = "Describe what you want to generate...",
    fieldName = "content"
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [userPrompt, setUserPrompt] = useState('');
    const [error, setError] = useState('');

    // Simulated AI generation (replace with actual API call in production)
    const generateContent = async (prompt) => {
        // For demo purposes, generate content based on context and prompt
        // In production, this would call the Anthropic API
        const templates = {
            summary: `Results-driven professional with ${Math.floor(Math.random() * 10) + 3}+ years of experience delivering impactful solutions. Proven track record of leading cross-functional teams and driving measurable business outcomes. Passionate about leveraging technology and data-driven insights to solve complex challenges and exceed organizational goals.`,
            experience: `• Led cross-functional team of ${Math.floor(Math.random() * 10) + 5} members, delivering projects 15% ahead of schedule\n• Implemented process improvements resulting in ${Math.floor(Math.random() * 30) + 20}% efficiency gains\n• Collaborated with stakeholders to define requirements and deliver solutions that exceeded expectations`,
            bullet: `Spearheaded initiative resulting in ${Math.floor(Math.random() * 50) + 10}% improvement in key metrics, recognized by leadership for exceptional performance`,
            cover_opening: `I am writing to express my strong interest in the ${context.includes('position') ? 'advertised position' : 'opportunity'} at your organization. With my background in delivering results and passion for excellence, I am confident I would be a valuable addition to your team.`,
            cover_body: `Throughout my career, I have consistently demonstrated the ability to drive results and exceed expectations. My experience has equipped me with a unique combination of technical expertise and leadership skills that align perfectly with this role's requirements.`,
            cover_closing: `I am excited about the opportunity to contribute to your organization's continued success. I look forward to discussing how my skills and experience can benefit your team.`
        };

        // Determine which template to use based on context
        let content = templates.summary;
        if (context.toLowerCase().includes('experience') || context.toLowerCase().includes('bullet')) {
            content = templates.experience;
        } else if (context.toLowerCase().includes('opening')) {
            content = templates.cover_opening;
        } else if (context.toLowerCase().includes('body')) {
            content = templates.cover_body;
        } else if (context.toLowerCase().includes('closing')) {
            content = templates.cover_closing;
        }

        // Add variation based on user prompt
        if (prompt.toLowerCase().includes('metric') || prompt.toLowerCase().includes('number')) {
            content = content.replace(/\d+%/, `${Math.floor(Math.random() * 40) + 25}%`);
        }

        return content;
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');

        try {
            const generatedText = await generateContent(userPrompt);
            onGenerate(generatedText);
            setShowPrompt(false);
            setUserPrompt('');
        } catch (err) {
            console.error('AI generation error:', err);
            setError('Failed to generate content. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="ai-assist-container">
            <button
                onClick={() => setShowPrompt(!showPrompt)}
                className="ai-button"
                type="button"
                disabled={isLoading}
            >
                ✨ AI Assist
            </button>

            {showPrompt && (
                <>
                    <div className="ai-overlay" onClick={() => setShowPrompt(false)} />
                    <div className="ai-prompt-modal">
                        <h3 className="ai-modal-title">AI Content Assistant</h3>
                        <p className="ai-modal-subtitle">
                            Describe what you'd like to generate for your {fieldName}
                        </p>

                        <textarea
                            value={userPrompt}
                            onChange={(e) => setUserPrompt(e.target.value)}
                            placeholder={placeholder}
                            rows={3}
                            className="ai-textarea"
                        />

                        {error && <p className="ai-error">{error}</p>}

                        <div className="ai-quick-actions">
                            <span className="ai-quick-label">Quick:</span>
                            <button
                                type="button"
                                onClick={() => setUserPrompt('Make it more impactful with metrics')}
                                className="ai-quick-btn"
                            >
                                Add Metrics
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserPrompt('Use stronger action verbs')}
                                className="ai-quick-btn"
                            >
                                Action Verbs
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserPrompt('Make it more concise')}
                                className="ai-quick-btn"
                            >
                                Shorten
                            </button>
                        </div>

                        <div className="ai-actions">
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="ai-generate-btn"
                            >
                                {isLoading ? 'Generating...' : 'Generate'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowPrompt(false)}
                                className="ai-cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AIAssistButton;
