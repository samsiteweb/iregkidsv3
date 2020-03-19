import { OrgRegComponent } from "./reg/org-reg/org-reg.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ForgotPasswordComponent } from "./auth/forgot-password/forgot-password.component";
import { LoginPageComponent } from "./auth/login-page/login-page.component";
import { AdminRegComponent } from "./reg/admin-reg/admin-reg.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginPageComponent
  },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
  },
  {
    path: "reset",
    component: ForgotPasswordComponent
  },
  {
    path: "reg/admin",
    component: AdminRegComponent
  },
  {
    path: "reg/continue",
    component: OrgRegComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
