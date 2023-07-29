import { AppSettings } from '../model/appsettings';
import { DUMMY_SERVER_API_URL } from '../constants/ApiURLConst';
import { Injectable } from '@angular/core';
import { LoginUserInfo } from '../model/LoginUserInfo';
import { Message } from '../model/apiresponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppUtil {
  public getAppURL(): string {
    return environment.appUrl;
  }

  public getLoginInfo(): LoginUserInfo {
    var loginInfo: LoginUserInfo = null;
    if (localStorage.getItem('loginUserInfo') != null) {
      loginInfo = JSON.parse(localStorage.getItem('loginUserInfo'));
    }
    return loginInfo;
  }

}
