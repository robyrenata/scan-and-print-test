import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { HomePage } from "./home.page";
import { TicketTemplateModule } from "../shared/common/ticket-template/ticket-template.module";
import { Pdf417BarcodeModule } from "pdf417-barcode";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: "",
        component: HomePage
      }
    ]),
    TicketTemplateModule,
    Pdf417BarcodeModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
