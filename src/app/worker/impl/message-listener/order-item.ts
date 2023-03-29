import { ChildProcess } from "child_process";
import { OrderItemNotificationStepMessageType, StepMessage } from "../../../scenario/step-message";
import fs from "fs";
import { createOrdersFilePath } from "../../../../utils/utils";
import type { MessageListener } from "../../message-listener";

export class OrderItemMessageListener implements MessageListener {
  async on(msg: StepMessage, childProcess: ChildProcess, jobId: string, params: any) {
    if (msg.type === OrderItemNotificationStepMessageType) {
      const { data: { phone, vendorCode, name, price, size, orderDate, receiveDate, status } } = msg;

      await fs.promises.appendFile(createOrdersFilePath(), [
        `"${phone}"`,
        `"${vendorCode}"`,
        `"${name}"`,
        `"${price}"`,
        `"${size}"`,
        `"${orderDate}"`,
        `"${receiveDate}"`,
        `"${status}"`
      ].join(",") + "\n");
    }
  }
}
