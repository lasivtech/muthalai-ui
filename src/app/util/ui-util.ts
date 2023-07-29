import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from '../model/apiresponse';

@Injectable({
  providedIn: 'root',
})
export class UIUtil {
  constructor(private router: Router) {}
  public showSuccessMessage(msg: string, title?: string): void {
   console.log(msg);
  }

  public showErrorMessage(msg: string, title?: string): void {
    console.log(msg);
  }

  public scrollToErrorPosition(messageList: Array<any>): void {
    if (messageList != null && messageList.length > 0) {
      let errorElement = document.getElementById(messageList[0].messageId);
      if (errorElement != null) {
        errorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }
    }
  }

  public stringArrayToTagCompDataArray(
    strEmailArray: Array<string>
  ): Array<any> {
    let retArray: Array<any> = new Array<any>();
    if(strEmailArray == null || strEmailArray.length == 0){
      return retArray;
    }
    for (let i = 0; i < strEmailArray.length; i++) {
      retArray.push({
        value: strEmailArray[i],
        display: strEmailArray[i],
      });
    }
    return retArray;
  }

  public tagCompDataArrayToStringArray(compDataArray: Array<any>): Array<any> {
    let retArray: Array<string> = new Array<string>();
    if(compDataArray == null || compDataArray.length == 0){
      return retArray;
    }
    for (let i = 0; i < compDataArray.length; i++) {
      retArray.push(compDataArray[i].value);
    }
    return retArray;
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  covertMsgListToMap(messageList: Array<Message>): Map<string, string> {
    var errorMessageMap = new Map<string, string>();
    if (messageList == null || messageList.length == 0) {
      return null;
    }
    for (let i = 0; i < messageList.length; i++) {
      errorMessageMap.set(messageList[i].messageId, messageList[i].message);
    }
    return errorMessageMap;
  }

}
