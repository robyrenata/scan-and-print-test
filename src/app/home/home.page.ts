import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Plugins } from "@capacitor/core";
const { FujitsuThermalPrinter } = Plugins;
const { Toast } = Plugins;

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements AfterViewInit {
  scanResult: string = null;
  @ViewChild("inputRef", { static: false }) scanInput;

  constructor() {}

  ngAfterViewInit() {
    console.log("el ref input scan", this.scanInput);
    // if ((this.scanInput.nativeElement.value.length = 13)) {
    // }
  }

  ionViewDidEnter() {
    console.log("scan result?", this.scanResult);
    this.scanInput.setFocus();
  }

  inputChange(event) {
    console.log("event", event);
    console.log("event which?", event.which);
    console.log("ngmodel", this.scanResult);

    console.log("cek keypress?", this.scanInput);

    if (event.which === 13 && this.scanResult.length === 13) {
      console.log("PRINT");
      this.scanResult = null;
      this.allInOnePrinting(this.scanResult);
    }
  }

  allInOnePrinting(textToBePrinted: string) {
    FujitsuThermalPrinter.GetUsbDevice().then(
      res => {
        console.log("res permission", res);
        this.showToast(res.message);
        if (res) {
          FujitsuThermalPrinter.Connect().then(
            res => {
              console.log("res connect", res);
              this.showToast(res.message);
              if (res) {
                FujitsuThermalPrinter.PrintText({ code: textToBePrinted }).then(
                  res => {
                    this.showToast(res.message);
                    console.log("res print", res);
                  },
                  err => {
                    this.showToast(err.message);
                    console.log("err print", err);
                  }
                );
              }
            },
            err => {
              this.showToast(err.message);
              console.log("err connect", err);
            }
          );
        }
      },
      err => {
        this.showToast(err.message);
        console.log("err message", err.message);
        console.log("err get usb device", err);
      }
    );
  }

  permissionPrint() {
    FujitsuThermalPrinter.GetUsbDevice().then(res => {
      this.showToast(res.message);
    });
  }

  connectPrint() {
    FujitsuThermalPrinter.Connect().then(res => {
      this.showToast(res.message);
    });
  }

  print() {
    console.log("text print?", this.scanResult);
    this.showToast("Print => " + this.scanResult.toString());
    FujitsuThermalPrinter.PrintText({
      code: this.scanResult.toString()
    }).then(res => {
      this.showToast(res.message);
      this.feedPaper();
      this.cutPaper();
    });
  }

  printQr() {
    console.log("print qr?");
    this.showToast("printing qr");

    FujitsuThermalPrinter.PrintQR({ code: "bambanguhuy" }).then(res => {
      this.showToast(res.message);
    });

    this.feedPaper();
    this.cutPaper();
  }

  feedPaper() {
    console.log("feeding paper");
    this.showToast("feeding paper");
  }

  cutPaper() {
    console.log("cutting paper");
    this.showToast("cutting paper");
  }

  status() {
    FujitsuThermalPrinter.GetPrinterStatus().then(res => {
      this.showToast(res.message);
      this.showToast(res);
    });
  }

  async showToast(message: string) {
    await Toast.show({
      text: message
    });
  }
}
