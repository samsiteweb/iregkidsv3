import { NgModule } from "@angular/core";

import { PlatformModule } from "@angular/cdk/platform";
import { ObserversModule } from "@angular/cdk/observers";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
/**
 * NgModule that includes all Material modules that are required to serve the demo-app.
 */
@NgModule({
  exports: [
    ObserversModule,
    PlatformModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule
  ]
})
export class CustomMaterialModule {}
