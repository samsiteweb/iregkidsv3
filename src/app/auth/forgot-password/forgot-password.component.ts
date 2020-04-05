import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { RegserviceService } from "src/app/providers/services/reg/regservice.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  resetForm: FormGroup;
  formLoading: boolean = false;
  errorMessage: string;
  message: string;
  response: any;
  verification = false;
  formSubmited = false;
  forgotVerified: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registrationService: RegserviceService
  ) {
    this.forgotForm = this.fb.group({
      cred: ["", [Validators.required]],
    });

    this.resetForm = this.fb.group({
      cred: ["", [Validators.required]],
      code: ["", [Validators.required]],
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.forgotForm.controls[controlName].hasError("required");
  };
  public hasErrorReset = (controlName: string, errorName: string) => {
    return this.resetForm.controls[controlName].hasError("required");
  };

  onSubmitVerify(value) {
    this.formLoading = true;
    if (this.forgotForm.valid) {
      console.log(value);

      this.registrationService.passwordResetVerify(value.cred).subscribe(
        (data) => {
          this.response = data;
          console.log(data);
          this.message =
            "Verification code has been sent to the contacts provided";
          this.verification = true;
          this.forgotVerified = true;
          this.formLoading = false;
        },
        (err) => {
          console.log(err, "err");
          this.errorMessage = err.error.Message;
          this.formLoading = false;
        }
      );
    } else {
      this.formLoading = false;
    }
  }

  onSubmitReset(value) {
    this.formLoading = true;
    if (this.resetForm.valid) {
      this.formLoading = false;
      this.registrationService
        .passwordReset(this.response, value.cred, value.code)
        .subscribe(
          (data) => {
            this.response = data;
            this.message = this.response.Message;
            this.formSubmited = true;
          },
          (err) => {
            console.log(err, "err");
            this.errorMessage = err.error.Message;
            this.formLoading = false;
          }
        );
      console.log(value);
    } else {
      this.formLoading = false;
    }
  }

  navigate() {
    this.router.navigateByUrl("/login");
  }

  ngOnInit(): void {}
}
