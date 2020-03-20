import { AdminRegComponent } from "./reg/admin-reg/admin-reg.component";
import { RegCompComponent } from "./reg/reg-comp/reg-comp.component";
import { OrgRegComponent } from "./reg/org-reg/org-reg.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ForgotPasswordComponent } from "./auth/forgot-password/forgot-password.component";
import { LoginPageComponent } from "./auth/login-page/login-page.component";

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
    path: "reg",
    component: RegCompComponent,
    children: [
      {
        path: "admin",
        component: AdminRegComponent
      },
      {
        path: "continue",
        component: OrgRegComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
