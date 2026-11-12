import OpenAI from "openai";

let client: OpenAI | null = null;

/**
 * Built lazily. Constructing the client at module scope throws when the key
 * is absent, which breaks `next build` anywhere the secret isn't set.
 */
export function openai(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

/**
 * The model that writes the checklist. Overridable by env so it can be
 * changed without a deploy. The default is the one already proven in the
 * other apps in this account.
 */
export const MODEL = process.env.OPENAI_CHECKLIST_MODEL || "gpt-4o";
