import { OrgRegComponent } from "./reg/org-reg/org-reg.component";
import { AdminRegComponent } from "./reg/admin-reg/admin-reg.component";
import { BrowserModule } from "@angular/platform-browser";

import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginPageComponent } from "./auth/login-page/login-page.component";
import { ForgotPasswordComponent } from "./auth/forgot-password/forgot-password.component";
import { CustomMaterialModule } from "./shared.module";

@NgModule({
  declarations: [AppComponent, LoginPageComponent, ForgotPasswordComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    AdminRegComponent,
    OrgRegComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
