import UserAgent from "user-agents";

export const USER_AGENT_RANDOM = "random";

export function createUserAgentString(userAgent: string): string {
  if (userAgent === USER_AGENT_RANDOM) {
    return String(new UserAgent({ deviceCategory: "desktop" }));
  }

  return userAgent
}

