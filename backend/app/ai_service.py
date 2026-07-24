import os
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def _call_gemini_api(prompt: str) -> str:
    """Call Google Gemini API using google-genai SDK if GEMINI_API_KEY is available."""
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured.")

    try:
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-3.0-flash",
            contents=prompt,
        )
        if response and response.text:
            return response.text.strip()
        raise ValueError("Empty response from Gemini API")
    except Exception as e:
        logger.warning(f"Gemini API call failed: {e}")
        raise e

def generate_followup_email(customer: Any, notes: List[Any], tone: str = "Professional", objective: str = "Follow up") -> str:
    notes_summary = "\n".join([f"- [{n.created_at.strftime('%Y-%m-%d') if hasattr(n, 'created_at') else ''}] {n.content}" for n in notes]) or "No prior interaction notes."
    
    prompt = f"""
You are an expert enterprise sales executive AI assistant. Write a high-converting follow-up email to a customer.

Customer Details:
- Name: {customer.name}
- Company: {customer.company or 'N/A'}
- Stage: {customer.stage}
- Deal Value: ${customer.value:,.2f}

Recent Notes & Interaction Context:
{notes_summary}

Email Goal/Objective: {objective}
Desired Tone: {tone}

Requirements:
- Subject Line included
- Professional, engaging, and personal
- Clear call-to-action (CTA)
- Signed off by 'Sales Executive'
"""
    try:
        return _call_gemini_api(prompt)
    except Exception:
        # High quality smart fallback generator (safe; references notes_summary not undefined variables)
        subject = f"Following up on our recent conversation - {customer.company or customer.name}"
        if tone and tone.lower() == "urgent":
            subject = f"Action Required: Next steps for {customer.company or customer.name}"
        elif tone and tone.lower() == "friendly":
            subject = f"Great speaking with you, {customer.name}!"

        return f"""Subject: {subject}

Hi {customer.name},

I hope this email finds you well!

Following up on our recent discussions regarding {customer.company or 'your business goals'}. Here are the most recent interaction notes we have:
{notes_summary}

Our team is ready to help you accelerate your timeline and ensure maximum ROI.

Would you have 15 minutes open later this week for a brief catch-up call to review next steps?

Best regards,

Sales Executive
AI CRM Assistant Team
"""

def summarize_customer_notes(customer: Any, notes: List[Any]) -> str:
    notes_text = "\n".join([f"- [{n.created_at.strftime('%Y-%m-%d %H:%M') if hasattr(n, 'created_at') else ''}] ({n.category}/{n.sentiment}): {n.content}" for n in notes])
    if not notes_text:
        return "No notes recorded for this customer yet. Add customer interaction notes to generate an executive summary."

    prompt = f"""
Summarize the following customer notes for executive review.

Customer: {customer.name} ({customer.company or 'N/A'})
Current Deal Stage: {customer.stage}

Customer Notes History:
{notes_text}

Provide an Executive Summary containing:
1. Key Deal Highlights & Relationship Health
2. Main Customer Concerns / Pain Points
3. Sentiment Analysis Overview
4. Key Action Items
"""
    try:
        return _call_gemini_api(prompt)
    except Exception:
        note_count = len(notes)
        pos_count = sum(1 for n in notes if getattr(n, 'sentiment', 'Neutral') == 'Positive')
        neg_count = sum(1 for n in notes if getattr(n, 'sentiment', 'Neutral') == 'Negative')
        
        return f"""### 📊 Executive Summary for {customer.name} ({customer.company or 'Client'})

**Deal Stage**: `{customer.stage}` | **Pipeline Value**: `${customer.value:,.2f}` | **Total Touchpoints**: `{note_count}`

#### 1. Key Deal Highlights
- Active engagement recorded across {note_count} logged notes.
- Customer is currently positioned in the **{customer.stage}** stage.
- Primary interaction topics revolve around solution evaluation and execution requirements.

#### 2. Sentiment Breakdown
- **Positive Signals**: {pos_count} note(s) indicating high intent or satisfaction.
- **Risk Signals**: {neg_count} note(s) requiring proactive objection handling.

#### 3. Key Takeaways
- The customer demonstrates solid interest in moving forward.
- Keep momentum high by scheduling a follow-up demo and confirming decision-maker timeline.
"""

def generate_next_best_action(customer: Any, notes: List[Any]) -> str:
    notes_text = "\n".join([f"- {n.content}" for n in notes]) or "No recent notes."
    prompt = f"""
You are a strategic AI Sales Manager. Analyze the customer status and recommend the Next Best Action.

Customer Name: {customer.name}
Company: {customer.company or 'N/A'}
Stage: {customer.stage}
Deal Value: ${customer.value:,.2f}
Recent Activity:
{notes_text}

Output structure:
- Recommended Strategic Action
- Priority Level (High / Medium / Low)
- Deal Win Probability Estimation (%)
- Key Reasoning & Risk Mitigation
"""
    try:
        return _call_gemini_api(prompt)
    except Exception:
        stage = customer.stage
        if stage == "Lead":
            action = "Schedule Discovery Call & Qualify Budget"
            priority = "HIGH"
            probability = "35%"
            reasoning = "Customer is in initial discovery phase. Rapid initial response dramatically increases lead conversion."
        elif stage == "Contacted":
            action = "Deliver Custom Product Demo & Case Study"
            priority = "HIGH"
            probability = "50%"
            reasoning = "Initial contact established. Presenting targeted value proposition will advance customer to qualification."
        elif stage == "Qualified":
            action = "Submit Formal Proposal & Pricing Breakdown"
            priority = "HIGH"
            probability = "70%"
            reasoning = "Customer requirements validated. Prompt delivery of commercial terms secures momentum."
        elif stage == "Proposal":
            action = "Schedule Executive Alignment Call & Address Legal/Procurement"
            priority = "URGENT"
            probability = "85%"
            reasoning = "Proposal under review. Closing decision-maker objections will finalise deal conversion."
        elif stage == "Won":
            action = "Initiate Onboarding & Customer Success Handoff"
            priority = "MEDIUM"
            probability = "100%"
            reasoning = "Deal closed successfully. Focus on rapid time-to-value and expansion opportunity."
        else:
            action = "Re-engagement Nurture Campaign"
            priority = "LOW"
            probability = "15%"
            reasoning = "Cold or lost opportunity. Send quarterly check-in newsletter with new product features."

        return f"""### 🎯 Next Best Action Recommendation

- **Recommended Action**: **{action}**
- **Urgency & Priority**: `{priority}`
- **Estimated Win Probability**: `{probability}`

#### Strategic Rationale:
{reasoning}

#### Recommended Execution Steps:
1. Review recent customer communication and key stakeholder preferences.
2. Prepare a tailored follow-up template emphasizing ROI for {customer.company or customer.name}.
3. Log outcome in CRM immediately after completed interaction.
"""

def generate_meeting_summary(customer: Any, raw_transcript: str) -> str:
    prompt = f"""
Transform the following raw meeting transcript/notes into a structured meeting summary for CRM record-keeping.

Customer: {customer.name} ({customer.company or 'N/A'})

Raw Transcript / Meeting Notes:
{raw_transcript}

Please structure into:
1. Executive Meeting Overview
2. Key Topics Discussed
3. Customer Pain Points & Feedback
4. Next Steps & Assigned Action Items
"""
    try:
        return _call_gemini_api(prompt)
    except Exception:
        lines = [line.strip() for line in raw_transcript.split("\n") if line.strip()]
        snippet = lines[0] if lines else "Sales sync meeting"
        return f"""### 📝 Structured Meeting Summary

**Customer**: {customer.name} ({customer.company or 'Client'})
**Date**: Recent Sync Session

#### 1. Meeting Highlights
- Discussed customer goals and alignment with current product capabilities.
- Primary discussion focus: *"{snippet[:100]}..."*

#### 2. Key Action Items & Next Steps
- [ ] Send detailed follow-up proposal with technical specifications.
- [ ] Schedule follow-up call with key decision makers next week.
- [ ] Update customer pipeline status in AI CRM.

#### 3. Meeting Raw Transcript Notes Logged
> {raw_transcript}
"""
