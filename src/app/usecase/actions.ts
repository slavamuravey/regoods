import type { Action } from "./step-message";
import { IWebDriverCookie } from "selenium-webdriver";

export const GetActionType = "get";
export const ClickActionType = "click";
export const SendKeysActionType = "sendKeys";
export const RentPhoneActionType = "rentPhone";

export class Get implements Action {
  type: string = GetActionType;
  params: {
    url: string;
  }

  constructor(url: string) {
    this.params = {
      url
    };
  }
}

export class Click implements Action {
  type: string = ClickActionType;
}

export class SendKeys implements Action {
  type: string = SendKeysActionType;
  params: {
    keys: string;
  }

  constructor(keys: string) {
    this.params = {
      keys
    };
  }
}

export class RentPhone implements Action {
  type: string = RentPhoneActionType;
  params: {
    phone: string;
  }

  constructor(phone: string) {
    this.params = {
      phone
    };
  }
}

export class CreateUser implements Action {
  type: string = RentPhoneActionType;
  params: {
    id: string;
    cookies: IWebDriverCookie[];
  }

  constructor(id: string, cookies: IWebDriverCookie[]) {
    this.params = {
      id,
      cookies
    };
  }
}
