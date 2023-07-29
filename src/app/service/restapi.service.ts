import { Injectable, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ApiResponse } from '../model/apiresponse';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppUtil } from '../util/apputil';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';
import { UIUtil } from '../util/ui-util';

@Injectable({
  providedIn: 'root',
})
export class RestApiService implements OnInit {
  private BASE_URL: string = this.appUtil.getAppURL();

  constructor(
    private http: HttpClient,
    private router: Router,
    private appUtil: AppUtil,
    private uiUtil: UIUtil,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {}

  commonSuccessHandler(responseObj: any, successHandler: any) {
    if (
      responseObj != null &&
      responseObj.errorExists &&
      responseObj.messageList[0].messageId === 'SESSION_EXPIRED'
    ) {
      this.uiUtil.showErrorMessage('Session Expired, logging out');
      localStorage.removeItem('loginUserInfo');
      this.router.navigateByUrl('login', { skipLocationChange: true });
    } else if (successHandler != null) {
      successHandler(responseObj);
    }
  }

  commonFailureHandler(error: HttpErrorResponse, failureHander: any) {
    if (error.error != null && error.error.hasOwnProperty('messageList')) {
      if (
        error.error.errorExists == true &&
        error.error.messageList[0].messageId == 'SESSION_EXPIRED'
      ) {
        this.uiUtil.showErrorMessage('Session Expired, logging out');
        localStorage.removeItem('loginUserInfo');
        this.router.navigate(['login']);
      }else if (
        error.error.errorExists == true &&
        error.error.messageList[0].messageId == 'INVALID_ACCESS_PERMISSION'
      ) {
        this.uiUtil.showErrorMessage('Invalid Access Permission, logging out');
        localStorage.removeItem('loginUserInfo');
        this.router.navigate(['login']);
      } else if (error.status == 400) {
        if (failureHander == null) {
          this.uiUtil.showErrorMessage('Input Data - Validation Error');
        }
      } else {
        if (failureHander == null) {
          this.uiUtil.showErrorMessage(error.error.messageList[0].message);
        }
      }
    } else if (error.status != null) {
      this.uiUtil.showErrorMessage('Internal Server Error');
    } else {
      this.uiUtil.showErrorMessage('Remote connectivity error !');
    }
    if (failureHander != null) {
      failureHander(error.error);
    }
  }

  addCommonHandlersToHttpClient(
    httpClnt: Observable<any>,
    successHandler: any,
    failureHandler: any
  ) {
    this.spinner.show();
    if (successHandler != null || failureHandler != null) {
      httpClnt.subscribe({
        next: (responseObj: any) => {
          this.spinner.hide();
          this.commonSuccessHandler(responseObj, successHandler);
        },
        error: (responseObj: any) => {
          this.spinner.hide();
          this.commonFailureHandler(responseObj, failureHandler);
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    }
    return httpClnt;
  }

  getHeaders() {
    /*
    let loginInfoStr = localStorage.getItem('loginInfo');
    if (loginInfoStr != null) {
      var loginInfo: CustomerDeviceLoginInfo = JSON.parse(loginInfoStr);
      //console.log(loginInfo.authToken);
      return new HttpHeaders({
        'Content-Type': 'application/json',
        applicationType: 'RESTAURANT_CUSTOMER_APP',
        authToken: loginInfo.authToken,
      });
    }
      */
    return new HttpHeaders({
      'Content-Type': 'application/json',
      applicationType: 'METEOR_FIREBALL',
      clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }

  getItem(
    endpoint: String,
    successHandler?: any,
    failureHandler?: any
  ): Observable<any> {
    const httpOptions = {
      headers: this.getHeaders(),
      withCredentials: true,
    };
    return this.addCommonHandlersToHttpClient(
      this.http.get<any>(this.BASE_URL + endpoint, httpOptions).pipe(
        tap((data) => {
          this.parseData(data);
        }),
        catchError(this.handleError)
      ),
      successHandler,
      failureHandler
    );
  }

  postItem(
    endpoint: string,
    body: any,
    successHandler?: any,
    failureHandler?: any
  ): Observable<ApiResponse> {
    const httpOptions = {
      headers: this.getHeaders(),
    };

    return this.addCommonHandlersToHttpClient(
      this.http.post<any>(this.BASE_URL + endpoint, body, httpOptions).pipe(
        tap((data) => {
          this.parseData(data);
        }),
        catchError(this.handleError)
      ),
      successHandler,
      failureHandler
    );
  }

  putItem(
    endpoint: string,
    body: any,
    successHandler?: any,
    failureHandler?: any
  ): Observable<ApiResponse> {
    const httpOptions = {
      headers: this.getHeaders(),
    };
    return this.addCommonHandlersToHttpClient(
      this.http.put<any>(this.BASE_URL + endpoint, body, httpOptions).pipe(
        tap((data) => {
          this.parseData(data);
        }),
        catchError(this.handleError)
      ),
      successHandler,
      failureHandler
    );
  }

  deleteItem(
    endpoint: string,
    body: any,
    successHandler?: any,
    failureHandler?: any
  ): Observable<ApiResponse> {
    const httpOptions = {
      headers: this.getHeaders(),
      withCredentials: true,
      body: body,
    };

    return this.addCommonHandlersToHttpClient(
      this.http.delete<any>(this.BASE_URL + endpoint, httpOptions).pipe(
        tap((data) => {
          this.parseData(data);
        }),
        catchError(this.handleError)
      ),
      successHandler,
      failureHandler
    );
  }

  serverApiCall(
    method: string,
    url: string,
    body?: any,
    successHandler?: any,
    failureHandler?: any
  ): Observable<ApiResponse> {
    if (method == 'GET') {
      return this.getItem(url, successHandler, failureHandler);
    } else if (method == 'POST') {
      return this.postItem(url, body, successHandler, failureHandler);
    } else if (method == 'PUT') {
      return this.putItem(url, body, successHandler, failureHandler);
    } else if (method == 'DELETE') {
      return this.deleteItem(url, body, successHandler, failureHandler);
    }
  }

  parseData(res: any) {
    const body = res;
    const apiResponse = new ApiResponse();
    apiResponse.fromJSON(body);
    return apiResponse;
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      //Client-side errors
      let errorMessage = `Error: ${error.error.message}`;
      this.uiUtil.showErrorMessage(errorMessage);
      return throwError(errorMessage);
    } else if (error.error instanceof ProgressEvent) {
      this.uiUtil.showErrorMessage('Connection Error');
      return throwError(error);
    }
    return throwError(error);
  }
}
