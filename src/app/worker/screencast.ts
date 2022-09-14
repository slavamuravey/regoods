import CDP from "chrome-remote-interface";
import Protocol from "devtools-protocol";
import { v4 as uuid } from "uuid";
import { storeScreencastFrame } from "../utils/utils";

process.on("message", async ({ debuggerAddress }) => {
  let client: CDP.Client;

  try {
    const [host, port] = debuggerAddress.split(":");

    client = await CDP({
      host: host,
      port: port
    });
    const { Page } = client;

    await Page.enable();

    await Page.startScreencast({ format: 'png', everyNthFrame: 1, quality: 100, maxWidth: 1280, maxHeight: 720 });

    let counter = 0;
    const screencastId = uuid();

    Page.on("screencastFrame", async ({ data, metadata, sessionId }: Protocol.Page.ScreencastFrameEvent) => {
      await Page.screencastFrameAck({sessionId: sessionId});

      counter++;

      await storeScreencastFrame(screencastId, `screencast-frame-${counter}.png`, data);
    });
    client.on("disconnect", async () => {
      console.log("disconnected");
      process.exit();
    });
  } catch (err) {
    console.error(err);
  }
});
