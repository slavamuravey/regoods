import CDP from "chrome-remote-interface";
import Protocol from "devtools-protocol";
import fs from "fs";

(async () => {
  let client: CDP.Client;

  try {
    client = await CDP({
      port: 9222
    });
    const { Page } = client;

    await Page.enable();

    await Page.startScreencast({ format: 'png', everyNthFrame: 1, quality: 100, maxWidth: 1280, maxHeight: 720 });

    let counter = 0;
    Page.on("screencastFrame", async ({ data, metadata, sessionId }: Protocol.Page.ScreencastFrameEvent) => {
      await Page.screencastFrameAck({sessionId: sessionId});

      counter++;
      fs.writeFileSync('screen-' + counter + '.png', Buffer.from(data, 'base64'));
    });
    client.on("disconnect", async () => {
      console.log("disconnected");
    })
  } catch (err) {
    console.error(err);
  }
})();