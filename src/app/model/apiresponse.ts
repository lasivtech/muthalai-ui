export class ApiResponse {
  errorExists: boolean;
  messageList: Array<Message>;
  responseObject: any;
  errorPageIdList: Array<string>;
  fromJSON(json) {
    for (const propName in json) this[propName] = json[propName];
    return this;
  }
}

export class Message {
  message: string;
  messageId: string;
  messageType: string;
}
