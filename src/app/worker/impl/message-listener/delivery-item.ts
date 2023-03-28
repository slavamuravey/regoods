import { ChildProcess } from "child_process";
import { DeliveryItemNotificationStepMessageType, StepMessage } from "../../../scenario/step-message";
import fs from "fs";
import { createDeliveryCodesFilePath } from "../../../../utils/utils";
import type { MessageListener } from "../../message-listener";

export class DeliveryItemMessageListener implements MessageListener {
  async on(msg: StepMessage, childProcess: ChildProcess, jobId: string, params: any) {
    if (msg.type === DeliveryItemNotificationStepMessageType) {
      const { data: { phone, profileName, size, sizeRu, address, code, status, vendorCode } } = msg;

      await fs.promises.appendFile(createDeliveryCodesFilePath(), [
        `"${phone}"`,
        `"${profileName}"`,
        `"${size}"`,
        `"${sizeRu}"`,
        `"${address}"`,
        `"${code}"`,
        `"${status}"`,
        `"${vendorCode}"`
      ].join(",") + "\n");
    }
  }
}
