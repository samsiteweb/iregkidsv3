import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { RegserviceService } from "src/app/providers/services/reg/regservice.service";
import { SuccessResponse } from "src/app/interface/get/success";
import { Router, ActivatedRoute } from "@angular/router";
import { ImageUpload } from "src/app/interface/interface";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "app-admin-reg",
  templateUrl: "./admin-reg.component.html",
  styleUrls: ["./admin-reg.component.scss"],
})
export class AdminRegComponent implements OnInit {
  errorMessage: string;
  message: string;
  selectedImage;
  isSelected: any;
  response: any;
  verifyForm: FormGroup;
  accountCodeVerified: boolean = false;
  AdminForm: FormGroup;
  errorAlert: "* this field is requreid";
  formSubmited = false;
  logoUrl: string;
  tokenHolder: any;
  isConflict = false;
  isAccFormLoading = false;
  formLoading: boolean = false;
  hide = true;
  imagePath: any;
  imgURL: any;
  isLogo = false;
  constructor(
    private fb: FormBuilder,
    private registrationService: RegserviceService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let contactregex: RegExp = /([1-9][0-9]*)|0/;
    this.AdminForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(emailregex)]],
      contact: ["", Validators.required],
      username: ["", Validators.required],
      password: ["", Validators.required],
    });

    this.verifyForm = this.fb.group({
      accountCode: ["", [Validators.required]],
    });

    this.route.data.subscribe((data) => {
      if (data["AccountDetails"]) {
        this.accountCodeVerified = true;
        this.response = data["AccountDetails"];
        console.log(this.response, "RESPO");
        this.tokenHolder = this.response;
        console.log(this.response);
        this.logoUrl = `${this.registrationService.REST_URL_PARAMS}/Image/${this.response.Info.Id}`;

        this.imageLoad();
      }
    });
  }

  preview(files) {
    console.log(files[0]);
    if (files.length === 0) return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    this.selectedImage = files[0];
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  verifyAccountCode(formValue) {
    console.log(formValue);
    this.isAccFormLoading = true;
    if (this.verifyForm.valid) {
      this.registrationService
        .validateCodeBeforeReg(formValue.accountCode)
        .subscribe(
          (data: SuccessResponse) => {
            this.response = data;
            this.router.navigateByUrl(`/reg/continue/${formValue.accountCode}`);
            this.isAccFormLoading = false;
            this.accountCodeVerified = true;
          },
          (err) => {
            this.isAccFormLoading = false;
            this.errorMessage = err.error.Message;
          }
        );
    } else {
      console.log("invalid");
      this.isAccFormLoading = false;
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.AdminForm.controls[controlName].hasError("required");
  };

  getErrorEmail() {
    let control = this.AdminForm;
    return control.get("email").hasError("required")
      ? "*Field is required"
      : control.get("email").hasError("pattern")
      ? "*Not a valid emailaddress"
      : control.get("email").hasError("alreadyInUse")
      ? "*This emailaddress is already in use"
      : "";
  }

  initializeForm() {}

  imageLoad() {
    this.http.get(this.logoUrl).subscribe(
      (data) => {
        if (data) {
          this.isLogo = true;
        }
      },
      (err) => {
        console.log(err.status, "islogo error");
        if (err.status == 200) {
          this.isLogo = true;
        }
      }
    );
  }
  onSubmit(values) {
    this.formLoading = true;
    console.log(values);
    if (this.AdminForm.valid) {
      console.log(
        this.response.Info.Id,
        this.response.Token.Token,
        this.AdminForm.value
      );
      this.registrationService
        .continueRegistration(this.response.Token.Token, this.AdminForm.value)
        .subscribe(
          (data: any) => {
            console.log(data, "reg data");
            this.response = data;
            console.log(this.response.ExistingUserId);

            if (this.response.ExistingUserId) {
              this.isConflict = true;
              this.formLoading = false;
            } else {
              if (this.selectedImage) {
                let params: ImageUpload = {
                  id: data.UserId,
                  type: "Profile",
                };
                this.registrationService
                  .imageUpload(params, this.selectedImage)
                  .subscribe(
                    (data) => {
                      console.log(data, "Image upload data");
                      this.formSubmited = true;
                      this.formLoading = false;
                    },
                    (err) => {
                      console.log("Image Upload has errors");
                      this.formSubmited = true;
                      this.formLoading = false;
                    }
                  );
              } else {
                this.formSubmited = true;
                this.formLoading = false;
              }
            }
          },
          (err) => {
            console.log(err);
            this.errorMessage = err.error.Message;
            this.formLoading = false;
          }
        );
      this.formLoading = false;
    } else {
      this.formLoading = false;
    }
  }

  navigate() {
    this.router.navigateByUrl("/login");
  }

  conflictResolver(data) {
    console.log(this.tokenHolder, "token held");
    this.isConflict = false;
    switch (data) {
      case "forward":
        this.registrationService
          .continueExistingUser(
            this.response.ExistingUserId,
            this.tokenHolder.Token.Token,
            this.AdminForm.value
          )
          .subscribe(
            (data: any) => {
              console.log(data);
              this.response = data;

              if (this.selectedImage) {
                let params: ImageUpload = {
                  id: data.UserId,
                  type: "Profile",
                };
                this.registrationService
                  .imageUpload(params, this.selectedImage)
                  .subscribe(
                    (data) => {
                      console.log(data, "Image upload data");

                      this.formSubmited = true;
                      this.formLoading = false;
                    },
                    (err) => {
                      console.log("Image Upload has errors");
                      this.formSubmited = true;
                      this.formLoading = false;
                    }
                  );
              } else {
                this.formSubmited = true;
                this.formLoading = false;
              }
            },
            (err) => {
              this.errorMessage = err.error.Message;
              this.formLoading = false;
            }
          );
        break;
      case "back":
        this.router.navigateByUrl("/reg/continue");
        break;

      default:
        break;
    }
  }
  ngOnInit(): void {}
}
