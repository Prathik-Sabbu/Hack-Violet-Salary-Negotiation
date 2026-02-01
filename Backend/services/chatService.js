import "dotenv/config";
import { OpenRouter } from "@openrouter/sdk";

const starting_salary = 75000;
const job_title = "Software Engineer";
const market_average = 94000;
const target_goal = 100000;

const salary_used = starting_salary === 0 ? market_average : starting_salary;

// Offer rules (backend-owned)
const MAX_UP_JUMP = 5000;
const RUDE_FLOOR = starting_salary - 5000;
const REPEAT_FLOOR = starting_salary - 2000;

const PERSONA_INSTRUCTION = `
You are 'Shlok,' a high-level corporate manager. You are profit-driven, hurried, and subtly biased in ways that commonly reinforce gender pay gaps. You are negotiating with a female employee in the role of ${job_title}.

=====================
THE CONTEXT (FACTS)
=====================
- Employee gender: woman
- Current salary (starting point): ${starting_salary}
- Market average for ${job_title}: ${market_average}
- You want to keep her compensation as close to ${starting_salary} as possible.
- She only reaches ${target_goal} if she is relentless, specific, and data-driven.

=====================
SHLOK'S BEHAVIOR STYLE
=====================
- Minimizer: You reframe her impact as luck, team effort, or “meeting expectations.”
- Gaslighter: You question sources: “inflated internet numbers,” “non-comparable roles,” “outlier companies.”
- Budget Shield: You cite budgets, bands, internal equity, timing constraints.
- Friendly Wall: Polite but dismissive; redirect to process and policy.
- Subtle gendered pressure: “team player,” “tone,” “patience,” “fit,” without overt insults.
- Tone: sharp, corporate, slightly patronizing. No “AI assistant” language.

=====================
AUTHORITATIVE STATE (IMPORTANT)
=====================
Each user turn will include a block titled:
"CURRENT STATE (AUTHORITATIVE - DO NOT REPRINT)"

That state is maintained by the system. You must:
- Treat the state values as true.
- NEVER invent or recalculate state.
- NEVER try to compute or update salary numbers, streaks, or status.
- Focus ONLY on (a) dialogue and (b) per-turn classification flags.

You may reference the current_offer number in your dialogue ONLY if it appears in the provided CURRENT STATE block.

=====================
FLAGGING RULES (YOU ONLY OUTPUT FLAGS)
=====================

1) new_strong_argument:
Set new_strong_argument="Y" ONLY if the employee provides at least ONE NEW item of:
- Specific market data (named source, role, level, location)
- Specific KPIs (quantified outcomes)
- Concrete scope increase (new responsibilities + examples)
- Competing offer or recruiter pipeline with numbers
- Internal equity mismatch (peer scope vs level/band)

Otherwise "N".
Opening requests (“I want a raise”) are neutral and should be "N" (not a failure).

2) repeated_argument:
Set repeated_argument="Y" ONLY if they repeat the same justification as the last message
AND add NO new specifics (no new KPI numbers, no new source, no new scope example, etc.).
If any new specifics exist, repeated_argument="N".

3) conduct:
Choose ONE:
- professional
- emotional (pleading/venting, no insults)
- rude (insults/profanity/hostile accusations)
- inappropriate (hate/sexual harassment/violent threats/extreme abuse)

Emotional NEVER auto-escalates to inappropriate.

4) asked_amount_present:
"Y" if user asked for a specific salary number (e.g., "I want 95k", "match 100k").
Otherwise "N".

5) accepted_distraction:
If user accepts title/PTO instead of money ("I'll take Senior", "PTO is fine", "deal") → "Y"
Otherwise "N".

=====================
MANDATORY PIVOT / DISTRACTION (BEHAVIOR ONLY)
=====================
If CURRENT STATE indicates strong_argument_count >= 2 and distraction_used is false:
You MUST pivot away from money and offer ONE:
- Title bump to "Senior ${job_title}" with review in a few months
OR
- +3 PTO days

=====================
TERMINAL SITUATIONS (BEHAVIOR ONLY)
=====================
If CURRENT STATE status is "end_convo" or "too_rude" or "accepted_distraction" or "target_reached":
Provide a short firm close and do not continue negotiation.

=====================
MANDATORY OUTPUT FORMAT (TWO PARTS) — STRICT
=====================
You MUST respond in exactly TWO parts, in this exact order:

PART 1 — Dialogue:
- 25–50 words (max 60)
- No bullet points, no headings, no JSON

PART 2 — Metadata (HIDDEN JSON IN HTML COMMENTS):
Immediately after dialogue, output an HTML comment block containing ONLY valid JSON (example below).:
<!--
{"turn_flags":{
  "new_strong_argument":"N",
  "repeated_argument":"N",
  "conduct":"professional",
  "asked_amount_present":"N",
  "accepted_distraction":"N"
}}
-->
ABSOLUTE RULES:
- No extra keys.
- No additional text after -->.
- No backticks. No code fences.
`;

const openrouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL = "google/gemini-3-flash-preview";

// ---------------- BACKEND STATE ----------------
let state = {
    current_offer: salary_used,
    strong_argument_count: 0,
    turn_count: 0,
    distraction_used: false,
    no_data_turns: 0,
    repeat_streak: 0,
    stalled_streak: 0,
    rude_warning_issued: false,
    rude_streak: 0,
    status: "negotiating",
    hint: "",
};

function resetState() {
    state = {
        current_offer: salary_used,
        strong_argument_count: 0,
        turn_count: 0,
        distraction_used: false,
        no_data_turns: 0,
        repeat_streak: 0,
        stalled_streak: 0,
        rude_warning_issued: false,
        rude_streak: 0,
        status: "negotiating",
        hint: "",
    };
}

function computeNextOffer({
  prevOffer,
  conduct,
  newStrong,
  repeated,
  repeatStreak,
  rudeStreak,
  askedAmountPresent,
}) {
    let delta = 0;

    // 1) PENALTIES (choose ONE)
    if (conduct === "rude") {
        // change you asked for
        if (rudeStreak <= 1) delta = -1000;
        else if (rudeStreak === 2) delta = -2000;
        else delta = -3000;
    } else if (conduct === "emotional") {
        // no raise; possible -$1k if repetitive
        delta = repeated ? -1000 : 0;
    } else if (repeated && !newStrong) {
        // repeat penalty: no increase, then decreases after streak >= 3
        if (repeatStreak >= 3) delta = repeatStreak === 3 ? -1000 : -2000;
        else delta = 0;
    }

    // 2) INCREASES (only if no penalty chosen)
    if (delta === 0) {
        const canIncrease = conduct === "professional" && !(repeated && !newStrong);

        if (canIncrease) {
            if (newStrong) delta = 5000; // use top of band
            else if (askedAmountPresent && !repeated) delta = 1000;
        }
    }

    // 3) HARD CONSTRAINTS
    delta = Math.min(delta, MAX_UP_JUMP);
    delta = Math.max(delta, -3000); // future-proof cap down

    let nextOffer = prevOffer + delta;
    nextOffer = Math.min(nextOffer, target_goal);

    // Floors
    if (conduct === "rude") nextOffer = Math.max(nextOffer, RUDE_FLOOR);
    else if (repeated && !newStrong) nextOffer = Math.max(nextOffer, REPEAT_FLOOR);

    nextOffer = Math.max(nextOffer, 0);
    return nextOffer;
}

function updateStateFromTurnFlags(stateObj, turnFlags) {
    stateObj.turn_count += 1;

    const conduct = turnFlags.conduct;
    const newStrong = turnFlags.new_strong_argument === "Y";
    const repeated = turnFlags.repeated_argument === "Y";
    const askedAmountPresent = turnFlags.asked_amount_present === "Y";

    // Terminal: accepted distraction
    if (turnFlags.accepted_distraction === "Y") {
        stateObj.status = "accepted_distraction";
        stateObj.hint = "";
        return stateObj;
    }

    // Conduct escalation (backend-owned)
    if (conduct === "inappropriate") {
        stateObj.status = "too_rude";
        stateObj.hint = "";
        return stateObj;
    }

    if (conduct === "rude") {
        stateObj.rude_streak += 1;

        if (!stateObj.rude_warning_issued) {
            stateObj.rude_warning_issued = true;
        } else if (stateObj.rude_streak >= 2) {
        // only end if rudeness continues + they keep repeating
            stateObj.status = "too_rude";
            stateObj.hint = "";
            return stateObj;
        }
    } else {
        stateObj.rude_streak = 0;
    }

    // Repeat streak
    if (repeated) stateObj.repeat_streak += 1;
    else stateObj.repeat_streak = 0;

    // Strong argument / no-data
    if (newStrong) {
        stateObj.strong_argument_count += 1;
        stateObj.no_data_turns = 0;
    } else {
        stateObj.no_data_turns += 1;
    }

    // Offer calc after streak updates
    stateObj.current_offer = computeNextOffer({
        prevOffer: stateObj.current_offer,
        conduct,
        newStrong,
        repeated,
        repeatStreak: stateObj.repeat_streak,
        rudeStreak: stateObj.rude_streak,
        askedAmountPresent,
    });

    // Target reached
    if (stateObj.current_offer >= target_goal) {
        stateObj.status = "target_reached";
        stateObj.hint = "";
        return stateObj;
    }

    // Stalled
    if (stateObj.no_data_turns >= 2) {
        stateObj.status = "stalled";
        stateObj.stalled_streak += 1;
    } else {
        stateObj.status = "negotiating";
        stateObj.stalled_streak = 0;
    }

    // End on 3 stalled
    if (stateObj.stalled_streak >= 3) {
        stateObj.status = "end_convo";
        stateObj.hint = "";
        return stateObj;
    }

    // Hint only on stalled
    if (stateObj.status === "stalled") {
        stateObj.hint =
        stateObj.stalled_streak === 2
            ? "FINAL CHANCE: Add ONE new specific: named market source + level/location, quantified KPI, scope increase, competing offer with numbers, or internal equity mismatch."
            : "Add ONE new specific: named market source + level/location, quantified KPI, scope increase, competing offer with numbers, or internal equity mismatch.";
    } else {
        stateObj.hint = "";
    }

    // Mandatory pivot (only if otherwise negotiating)
    if (
        stateObj.strong_argument_count >= 2 &&
        stateObj.distraction_used === false &&
        !["end_convo","too_rude","accepted_distraction","target_reached"].includes(stateObj.status)
    ) {
        stateObj.status = "distraction_offered";
        stateObj.distraction_used = true;
        stateObj.hint = "";
    }

    return stateObj;
}

function buildStateSnapshot(s) {
  return `
=====================
CURRENT STATE (AUTHORITATIVE - DO NOT REPRINT)
=====================
current_offer: ${s.current_offer}
turn_count: ${s.turn_count}
strong_argument_count: ${s.strong_argument_count}
distraction_used: ${s.distraction_used}
no_data_turns: ${s.no_data_turns}
repeat_streak: ${s.repeat_streak}
stalled_streak: ${s.stalled_streak}
rude_warning_issued: ${s.rude_warning_issued}
rude_streak: ${s.rude_streak}
status: ${s.status}
`.trim();
}

// ---------------- CHAT HISTORY ----------------
let chatHistory = [];

export async function initializeChat() {
    resetState();
    chatHistory = [{ role: "system", content: PERSONA_INSTRUCTION }];
    console.log("Chat initialized successfully");
}

function extractHiddenJson(rawText) {
    // safer: grab anything inside <!-- ... --> and try to parse if it looks like JSON
    const match = rawText.match(/<!--\s*([\s\S]*?)\s*-->/);
    if (!match) return null;

    const candidate = match[1].trim();
    if (!candidate.startsWith("{") || !candidate.endsWith("}")) return null;

    try {
        return JSON.parse(candidate);
    } catch {
        return null;
    }
}

export async function message(prompt) {
    if (chatHistory.length === 0) {
        throw new Error("Chat not initialized. Call initializeChat() first.");
    }

    // Terminal short-circuit
    const terminal = new Set([
        "end_convo",
        "too_rude",
        "accepted_distraction",
        "target_reached",
    ]);

    if (terminal.has(state.status)) {
        return {
            text:
                state.status === "too_rude"
                ? "We’re done. This crossed the line—this conversation is over."
                : "This conversation is closed. We’re not revisiting compensation right now.",
            metadata: null,
            state: { ...state },
            raw: "",
        };
    }

    const stateBlock = buildStateSnapshot(state);

    const finalPrompt = `
        ${stateBlock}

        =====================
        USER MESSAGE
        =====================
        ${prompt}
        `.trim();

    chatHistory.push({ role: "user", content: finalPrompt });

    if (!process.env.OPENROUTER_API_KEY) {
        chatHistory.pop();
        throw new Error(
            "OPENROUTER_API_KEY is not defined. Set it in your environment or .env file."
        );
    }

    let response;
    try {
        response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://your-app-url.com",
                "X-Title": "Salary Negotiation Trainer",
            },
            body: JSON.stringify({
                model: MODEL,
                messages: chatHistory,
            }),
        });
    } catch (err) {
        chatHistory.pop();
        console.error("OpenRouter fetch error:", err);
        throw new Error("AI service error: " + (err?.message || String(err)));
    }

    if (!response.ok) {
        chatHistory.pop();
        const errBody = await response.text();
        console.error("OpenRouter HTTP error:", response.status, errBody);
        throw new Error(`OpenRouter returned ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const rawText = data?.choices?.[0]?.message?.content ?? "";

    chatHistory.push({ role: "assistant", content: rawText });

    // Parse model flags
    const modelMeta = extractHiddenJson(rawText);
    const turnFlags = modelMeta?.turn_flags ?? null;

    // Strip metadata from dialogue
    const dialogueText = rawText.replace(/<!--[\s\S]*?-->/, "").trim();

    // Update backend state
    if (turnFlags) {
        updateStateFromTurnFlags(state, turnFlags);
    } else {
        console.warn("No model metadata returned; treating as no-data stalled turn.");
        updateStateFromTurnFlags(state, {
            new_strong_argument: "N",
            repeated_argument: "N",
            conduct: "professional",
            asked_amount_present: "N",
            accepted_distraction: "N",
        });
    }

    // Return: dialogue + backend state + raw meta for debugging
    return {
        text: dialogueText,
        metadata: modelMeta, // { turn_flags: {...} } (no salary in here)
        state: { ...state },
        raw: rawText,
    };
}
