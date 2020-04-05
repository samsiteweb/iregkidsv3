import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpHeaders,
} from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { retry, catchError, finalize } from "rxjs/operators";
import { SuccessResponse } from "src/app/interface/get/success";
import { ImageUpload } from "src/app/interface/interface";

export interface AdminReg {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  username: string;
  password: string;
}

export interface OrgReg {
  accountCode: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  country: string;
}

@Injectable({
  providedIn: "root",
})
export class RegserviceService {
  public REST_URL_PARAMS = "https://iregisterkids.com/prod_sup/api";

  constructor(private httpClient: HttpClient) {}
  handleError(error: HttpErrorResponse) {
    let errorMessage = "Unknown Error";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.statusText;
    } else if (error.error instanceof ProgressEvent) {
      errorMessage = `Check internet connectivity`;
    } else {
      errorMessage = error.error.Message;
    }
    return throwError(errorMessage);
  }

  setParams(params) {
    const options = { params: new HttpParams({ fromObject: params }) };
    return options;
  }
  requestAccountCode(email: string, phoneNumber: number) {
    let params = {
      email: email,
      sms: phoneNumber,
      expires: "3",
    };
    return this.httpClient
      .get<SuccessResponse>(
        `${this.REST_URL_PARAMS}/NewRegistration/RequestAccountCode`,
        this.setParams(params)
      )
      .pipe(catchError(this.handleError));
  }
  validateRequestedAccountCode(id: string, code: string) {
    let params = {
      id: id,
      code: code,
    };
    return this.httpClient.put<SuccessResponse>(
      `${this.REST_URL_PARAMS}/NewRegistration/ValidateAccountCode`,
      "",
      this.setParams(params)
    );
  }

  validateCustomAccoutCode(code) {
    const options = { params: new HttpParams().set("code", code) };
    return this.httpClient.get<SuccessResponse>(
      `${this.REST_URL_PARAMS}/NewRegistration/ValidateCustomAccountCode`,
      options
    );
  }

  registerUser(body: OrgReg) {
    return this.httpClient.post<SuccessResponse>(
      `${this.REST_URL_PARAMS}/NewRegistration
  `,
      body
    );
  }

  continueRegistration(token: string, body: AdminReg) {
    const options = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.httpClient.post(
      `${this.REST_URL_PARAMS}/ContinueRegistration`,
      body,
      options
    );
  }
  continueExistingUser(id: string, token: string, body: AdminReg) {
    const options = {
      params: new HttpParams().set("id", id),

      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.httpClient.post(
      `${this.REST_URL_PARAMS}/ContinueRegistration`,
      body,
      options
    );
  }

  validateCodeBeforeReg(code) {
    const options = { params: new HttpParams().set("code", code) };
    return this.httpClient.get(
      `${this.REST_URL_PARAMS}/ContinueRegistration`,
      options
    );
  }

  imageUpload(params: ImageUpload, body) {
    const formData = new FormData();

    formData.append("image", body);
    return this.httpClient.post(
      `${this.REST_URL_PARAMS}/Image`,
      formData,
      this.setParams(params)
    );
  }

  passwordResetVerify(cred: string) {
    let params = {
      cred: cred,
    };
    return this.httpClient.get<SuccessResponse>(
      `${this.REST_URL_PARAMS}/ForgotPassword`,
      this.setParams(params)
    );
  }

  passwordReset(id: string, cred: string, code: string) {
    let params = {
      id: id,
      cred: cred,
      code: code,
    };
    return this.httpClient.get<SuccessResponse>(
      `${this.REST_URL_PARAMS}/ForgotPassword/UpdateCredential`,
      this.setParams(params)
    );
  }
}
