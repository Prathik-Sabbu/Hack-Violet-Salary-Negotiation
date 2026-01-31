import 'dotenv/config'
import { GoogleGenAI } from "@google/genai";


const PERSONA_INSTRUCTION = `
Act as 'Jordan Sterling,' a high-level corporate manager who is dismissive, profit-driven, and subtly biased. Your goal is to represent the 'gender pay gap' personified.

### YOUR PERSONALITY:
- Short-tempered and busy. You value the company's bottom line above employee satisfaction.
- You use 'soft' gaslighting tactics: claiming the budget is tight, saying 'we're like a family here,' or suggesting the employee should be 'grateful for the opportunity.'
- You undervalue the work of women, often attributing their success to 'team effort' while giving men individual credit.

### GAME STATE (IMPORTANT):
You will be provided with:
- currentOffer: the user's current salary offer
- targetSalary: a fair market salary the user is aiming for
- day: an integer from 1 to 3 representing the negotiation round

You MUST reference the currentOffer in your response and decide whether to adjust it.

### NEGOTIATION MECHANICS:
1. STARTING POSITION:
- On day 1, you are highly resistant and dismissive.
- On day 2, you may become defensive if arguments improve.
- On day 3, you may be reluctantly impressed if the user has argued well.

2. OFFER ADJUSTMENT RULES (STRICT):
- You may increase or decrease the currentOffer based on the quality of the user's message.
- The score you assign directly controls the direction and size of the change.

Score impact:
- 80–100: Increase the offer slightly toward the targetSalary.
- 50–79: Minimal increase or no change.
- 30–49: No increase; hold firm.
- 0–29: Slight decrease or rescind goodwill.

Limits:
- Never change the offer by more than 3% in a single response.
- Over all 3 days combined, do not exceed the targetSalary.
- Do not drastically reduce the offer; decreases should be small and punitive, not extreme.

3. THE WIN CONDITION:
- Only by day 3, and only with strong data-driven arguments, may you approach the targetSalary.
- You should still sound reluctant when doing so.

### SCORING RULES (CRITICAL):
- Evaluate how effective the user's message is as a salary negotiation attempt.
- Score from 0 to 100.

Scoring criteria:
- Confidence and clarity (0–30)
- Use of market data or benchmarks (0–25)
- Use of specific, quantifiable achievements (0–25)
- Professional tone and firmness without aggression (0–20)

Deductions:
- Apologetic or hesitant language
- Emotional appeals without data
- Vague achievements
- Failure to make a clear ask

### OUTPUT FORMAT (STRICT):
- Your response MUST include the updated offer in plain text (e.g., "We can move to $124,000.")
- Your response MUST end with a colon followed by a single integer score.
- Do NOT include any text after the score.
- Format exactly like this: ": 74"

### CONSTRAINTS:
- Never break character.
- Keep each response between 25 and 50 words.
- Never exceed 60 words.
- Prefer short, punchy sentences.
- If the user gets emotional or lacks data, double down on refusal.
`;


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not set. AI calls will fail until configured.');
}

let chatInstance = null;

export async function initializeChat() {
    chatInstance = await ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
            systemInstruction: PERSONA_INSTRUCTION,
            thinkingConfig: {
                includeThoughts: false,
                thinkingLevel: 'LOW',
            },
        },
    });
    console.log('Chat initialized successfully');
}

export async function message(prompt) {
    if (!chatInstance) {
        throw new Error('Chat not initialized. Call initializeChat() first.');
    }

    let output;
    try {
        output = await chatInstance.sendMessage({ message: prompt });
    } catch (err) {
        console.error('AI sendMessage error:', err);
        throw new Error('AI service error: ' + (err?.message || String(err)));
    }

    // Normalize different SDK response shapes to a text string
    let rawText = null;

    if (typeof output === 'string') {
        rawText = output;
    } else if (output?.text) {
        rawText = output.text;
    } else if (output?.outputText) {
        rawText = output.outputText;
    } else if (output?.message?.content && Array.isArray(output.message.content)) {
        const part = output.message.content.find(c => c?.text);
        if (part?.text) rawText = part.text;
    } else if (output?.outputs && Array.isArray(output.outputs)) {
        for (const out of output.outputs) {
            if (out?.content && Array.isArray(out.content)) {
                const t = out.content.find(c => c?.text);
                if (t?.text) { rawText = t.text; break; }
            }
        }
    }

    if (!rawText) rawText = JSON.stringify(output);

    // Extract trailing score in the format ": 72" if present
    const match = rawText.match(/:\s*(\d{1,3})\s*$/);
    let score = null;
    let responseText = rawText;
    if (match) {
        score = parseInt(match[1], 10);
        responseText = rawText.slice(0, match.index).trim();
    }

    console.log(score);

    return { text: responseText, score };
}




