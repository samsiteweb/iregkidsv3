import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { SuccessResponse } from "src/app/interface/get/success";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { RegserviceService } from "src/app/providers/services/reg/regservice.service";

@Injectable()
export class AccountDetailsResolver implements Resolve<SuccessResponse> {
  constructor(private registrationService: RegserviceService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<SuccessResponse> | Promise<SuccessResponse> | SuccessResponse {
    return this.registrationService.validateCodeBeforeReg(route.params["id"]);
  }
}
