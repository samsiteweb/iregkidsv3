import { OrgRegComponent } from "./reg/org-reg/org-reg.component";
import { BrowserModule } from "@angular/platform-browser";

import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginPageComponent } from "./auth/login-page/login-page.component";
import { ForgotPasswordComponent } from "./auth/forgot-password/forgot-password.component";
import { CustomMaterialModule } from "./shared.module";
import { RegCompComponent } from "./reg/reg-comp/reg-comp.component";
import { AdminRegComponent } from "./reg/admin-reg/admin-reg.component";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CustomBtnComponent } from "./components/custom-btn/custom-btn.component";
import { DialogComponent } from "./components/dialog/dialog.component";
import { RegserviceService } from "./providers/services/reg/regservice.service";
import { AccountDetailsResolver } from "./reg/reg-comp/accountDetails-resolver.service";
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ForgotPasswordComponent,
    RegCompComponent,
    AdminRegComponent,
    OrgRegComponent,
    CustomBtnComponent,
    DialogComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    HttpClientModule,
  ],
  providers: [RegserviceService, AccountDetailsResolver],
  bootstrap: [AppComponent],
})
export class AppModule {}
