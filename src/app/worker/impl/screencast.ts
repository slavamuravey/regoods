import CDP from "chrome-remote-interface";
import Protocol from "devtools-protocol";
import { container } from "../../service-container";
import type { ScreencastFrameListener } from "../screencast-frame-listener";

export interface ScreencastMessageListenerMessage {
  jobId: string,
  debuggerAddress: {
    host: string;
    port: number;
  };
}

process.on("message", async ({ jobId, debuggerAddress }: ScreencastMessageListenerMessage) => {
  let client: CDP.Client;

  const listener: ScreencastFrameListener = container.get("screencast-frame-listener");

  try {
    const { host, port } = debuggerAddress;
    client = await CDP({
      host,
      port
    });
    const { Page } = client;

    await Page.enable();

    await Page.startScreencast({ format: "png", everyNthFrame: 1, quality: 100, maxWidth: 1280, maxHeight: 720 });

    let counter = 0;
    Page.on("screencastFrame", async ({ data, metadata, sessionId }: Protocol.Page.ScreencastFrameEvent) => {
      await Page.screencastFrameAck({ sessionId });

      counter++;

      await listener.onScreencastFrame(jobId, data, counter);
    });
    client.on("disconnect", async () => {
      console.log("screencast message: ", "disconnected");
      process.exit();
    });
  } catch (err) {
    console.error("screencast error: ", err);
    process.exit();
  }
});
