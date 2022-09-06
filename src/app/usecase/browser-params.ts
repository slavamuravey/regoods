export interface BrowserParams {
  browser: "chrome" | "firefox";
  headless?: boolean;
  quit: boolean;
  proxy?: string;
  userAgent: string | boolean;
}
