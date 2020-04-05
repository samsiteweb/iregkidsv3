import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { RegserviceService } from "src/app/providers/services/reg/regservice.service";
import { SuccessResponse } from "src/app/interface/get/success";
import { ImageUpload } from "src/app/interface/interface";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-org-reg",
  templateUrl: "./org-reg.component.html",
  styleUrls: ["./org-reg.component.scss"],
})
export class OrgRegComponent implements OnInit {
  OrgForm: FormGroup;
  message: any;
  imagePath: any;
  imgURL: any;
  validateContacts: any = false;
  accCodeText: any = "Get Code";
  selected: any;
  isSelectActive: boolean = false;
  hintColor: any;
  accountCodeStatus: false;
  validateCustomField = false;
  errorAlert: "* this field is requreid";
  formLoading: boolean = false;
  formSubmited: boolean = false;
  data: SuccessResponse;
  isGetCodeActive: boolean = false;
  codeValidationComplete: boolean = false;
  showHint: boolean = false;
  labelColor: string = "red";
  errorMessage: string;
  selectedImage: any;
  verifiedAccountCode: string;

  response: SuccessResponse;
  ngOnInit(): void {
    this.hintColor = "#ff0000";
    this.selected = "Get Code";
  }

  constructor(
    private fb: FormBuilder,
    private registrationService: RegserviceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let contactregex: RegExp = /([1-9][0-9]*)|0/;

    this.accCodeText;

    this.OrgForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(emailregex)]],
      contact: ["", Validators.required],
      address: ["", Validators.required],
      country: ["", Validators.required],
      accountCode: ["", Validators.required],
    });

    if (this.accCodeText == "Get Code") {
      this.OrgForm.get("accountCode").disable();
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.OrgForm.controls[controlName].hasError(errorName);
  };

  getErrorEmail() {
    let control = this.OrgForm;
    return control.get("email").hasError("required")
      ? "*Field is required"
      : control.get("email").hasError("pattern")
      ? "*Not a valid emailaddress"
      : control.get("email").hasError("alreadyInUse")
      ? "*This emailaddress is already in use"
      : "";
  }

  onSubmit(values) {
    this.formLoading = true;
    if (!this.codeValidationComplete) {
      this.message = "*Account Code validation incomplete";
      this.showHint = true;
      this.formLoading = false;
    }

    if (this.OrgForm.valid && this.codeValidationComplete) {
      let body = {
        ...this.OrgForm.value,
        accountCode: this.verifiedAccountCode,
      };
      this.registrationService.registerUser(body).subscribe(
        (data: SuccessResponse) => {
          console.log(data);
          this.response = data;

          this.formLoading = false;

          if (this.selectedImage) {
            let params: ImageUpload = {
              id: data.Result,
              type: "Logo",
            };
            this.registrationService
              .imageUpload(params, this.selectedImage)
              .subscribe(
                (data) => {
                  console.log(data, "Image upload data");
                  this.formSubmited = true;
                },
                (err) => {
                  console.log("Image Upload has errors");
                  this.formSubmited = true;
                }
              );
          } else {
            this.formSubmited = true;
          }
        },
        (err) => {
          console.log(err);
          this.errorMessage = err.error.Message;
          this.formSubmited = false;
          this.formLoading = false;
        }
      );
    }
  }

  navigate(data) {
    switch (data) {
      case "forward":
        this.router.navigateByUrl(`reg/continue/${this.verifiedAccountCode}`);
        break;
      case "back":
        this.router.navigateByUrl("/login");
        break;
      default:
        break;
    }
  }

  triggerAccountCodeType(data) {
    console.log(data.value);
    this.accCodeText = data.value;
    if (this.accCodeText == "Get Code") {
      this.OrgForm.get("accountCode").disable();
    } else {
      this.OrgForm.get("accountCode").enable();
    }
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

  handleAccoundCode() {
    switch (this.selected) {
      case "Get Code":
        this.validateContacts = true;
        if (!this.getErrorEmail() && !this.hasError("contact", "required")) {
          this.isGetCodeActive = true;
          this.registrationService
            .requestAccountCode(
              this.OrgForm.value.email,
              this.OrgForm.value.contact
            )
            .subscribe(
              (data) => {
                console.log(data);
                this.data = data;
                this.handleVerificationInputs(
                  true,
                  "Verify",
                  `Your Account Code has been sent to ${this.OrgForm.value.email} or ${this.OrgForm.value.contact}`
                );
                this.OrgForm.get("accountCode").enable();
              },
              (err) => {
                this.handleVerificationInputs(false, this.accCodeText, err);
              }
            );
        }
        break;
      case "Verify":
        this.validateContacts = true;
        this.validateCustomField = true;
        if (
          !this.getErrorEmail() &&
          !this.hasError("contact", "required") &&
          !this.hasError("accountCode", "required")
        ) {
          this.isGetCodeActive = true;
          this.registrationService
            .validateRequestedAccountCode(
              this.data.Result,
              this.OrgForm.value.accountCode
            )
            .subscribe(
              (data) => {
                console.log(data);
                this.handleVerificationInputs(
                  true,
                  "Verified",
                  `Account Code verification was successful`
                );
              },
              (err) => {
                this.handleVerificationInputs(
                  false,
                  this.accCodeText,
                  err.error.Message
                );
              }
            );
        }
        break;
      case "Custom Code":
        this.validateCustomField = true;
        if (!this.hasError("accountCode", "required")) {
          this.isGetCodeActive = true;
          this.registrationService
            .validateCustomAccoutCode(this.OrgForm.value.accountCode)
            .subscribe(
              (data) => {
                this.verifiedAccountCode = this.OrgForm.value.accountCode;
                this.handleVerificationInputs(true, "Confirmed", data.Message);
              },
              (err) => {
                this.handleVerificationInputs(
                  false,
                  this.accCodeText,
                  err.error.Message
                );
              }
            );
        }

        break;
      default:
        break;
    }
  }
  handleVerificationInputs(
    status: boolean,
    btnText: string,
    hintMessage: string
  ) {
    this.isGetCodeActive = false;
    this.labelColor = "red";
    this.accCodeText = btnText;
    this.message = hintMessage;
    if (status === true) {
      this.labelColor = "green";
      this.isSelectActive = true;
      this.codeValidationComplete = status;
      this.OrgForm.get("email").disable();
      this.OrgForm.get("contact").disable();
      this.OrgForm.get("accountCode").disable();
    }

    if (this.accCodeText === "Verify") {
      this.codeValidationComplete = false;
    }

    if (this.selected === "Custom Code") {
      this.OrgForm.get("email").enable();
      this.OrgForm.get("contact").enable();
    }
  }
}
