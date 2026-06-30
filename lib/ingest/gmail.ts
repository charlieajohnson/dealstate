import type {SourceAdapter} from "./pipeline";

type GmailAdapterEnv = {
  GMAIL_CLIENT_ID?: string;
  GMAIL_CLIENT_SECRET?: string;
  GMAIL_REDIRECT_URI?: string;
  TOKEN_ENCRYPTION_KEY?: string;
} & Record<string, string | undefined>;

export function createGmailAdapter(env: GmailAdapterEnv = process.env): SourceAdapter {
  return {
    source: "gmail",
    async sync() {
      if (!env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET || !env.GMAIL_REDIRECT_URI || !env.TOKEN_ENCRYPTION_KEY) {
        throw new Error("TODO(pass2): Gmail OAuth credentials and encrypted token storage are required for live sync.");
      }

      throw new Error("TODO(pass2): Implement Gmail history sync once OAuth approval and mailbox credentials are available.");
    },
  };
}
