import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TicketTemplateComponent } from "./ticket-template.component";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [TicketTemplateComponent],
  imports: [CommonModule, IonicModule],
  exports: [TicketTemplateComponent]
})
export class TicketTemplateModule {}
