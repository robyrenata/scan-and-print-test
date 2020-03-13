import { Component, ViewChild, ElementRef, AfterViewInit, TemplateRef } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { FujitsuThermalPrinter } = Plugins;
const { Toast } = Plugins;
import domtoimage from 'dom-to-image-improved';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
	scanResult: string = null;
	@ViewChild('inputRef', { static: false }) scanInput;
	@ViewChild('tpl', { static: false }) tpl: TemplateRef<any>;
	responseDebug = 'null';

	constructor(private elRef: ElementRef) {}

	ngAfterViewInit() {
		console.log('el ref input scan', this.scanInput);
		// if ((this.scanInput.nativeElement.value.length = 13)) {
		// }
		console.log('template ref', this.tpl['nativeElement']);
	}

	ionViewDidEnter() {
		console.log('scan result?', this.scanResult);
		this.scanInput.setFocus();
	}

	inputChange(event) {
		console.log('event', event);
		console.log('event which?', event.which);
		console.log('ngmodel', this.scanResult);

		console.log('cek keypress?', this.scanInput);

		if (event.which === 13 && this.scanResult.length === 13) {
			console.log('PRINT');
			this.scanResult = null;
			this.allInOnePrinting(this.scanResult);
		}
	}

	allInOnePrinting(textToBePrinted: string) {
		FujitsuThermalPrinter.GetUsbDevice().then(
			(res) => {
				console.log('res permission', res);
				this.showToast(res.message);
				if (res) {
					FujitsuThermalPrinter.Connect().then(
						(res) => {
							console.log('res connect', res);
							this.showToast(res.message);
							if (res) {
								FujitsuThermalPrinter.PrintText({ code: textToBePrinted }).then(
									(res) => {
										this.showToast(res.message);
										console.log('res print', res);
									},
									(err) => {
										this.showToast(err.message);
										console.log('err print', err);
									},
								);
							}
						},
						(err) => {
							this.showToast(err.message);
							console.log('err connect', err);
						},
					);
				}
			},
			(err) => {
				this.showToast(err.message);
				console.log('err message', err.message);
				console.log('err get usb device', err);
			},
		);
	}

	permissionPrint() {
		FujitsuThermalPrinter.GetUsbDevice().then(
			(res) => {
				this.showToast(res.message);
				this.responseDebug = res.message;
			},
			(err) => {
				this.responseDebug = err;
			},
		);
	}

	connectPrint() {
		FujitsuThermalPrinter.Connect().then(
			(res) => {
				this.showToast(res.message);
				this.responseDebug = res.message;
			},
			(err) => {
				// this.showToast(err.message);
				this.responseDebug = err;
			},
		);
	}

	print() {
		console.log('text print?', this.scanResult);
		// this.showToast("Print => " + this.scanResult.toString());
		FujitsuThermalPrinter.PrintText({
			code:
				'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."',
			paperFeed: 64,
			cutPaper: 0,
		}).then(
			(res) => {
				this.showToast(res.message);
				this.responseDebug = res.message;
				// this.feedPaper();
				// this.cutPaper();
			},
			(err) => {
				this.responseDebug = err;
			},
		);
	}

	printQr() {
		console.log('print qr?');
		this.showToast('printing qr');

		FujitsuThermalPrinter.PrintQR({ code: 'bambanguhuy1233224' }).then((res) => {
			this.showToast(res.message);
		});

		this.feedPaper();
		this.cutPaper();
	}

	feedPaper() {
		console.log('feeding paper');
		this.showToast('feeding paper');
	}

	cutPaper() {
		console.log('cutting paper');
		this.showToast('cutting paper');
	}

	status() {
		FujitsuThermalPrinter.GetPrinterStatus().then(
			(res) => {
				this.showToast(res.message);
				this.responseDebug = res.message;
			},
			(err) => {
				this.responseDebug = err;
			},
		);
	}

	async showToast(message: string) {
		await Toast.show({
			text: message,
		});
	}

	printImageDOM() {
		// domtoimage
		//   .toJpeg(document.getElementById("itLayout"), { quality: 1 })
		//   .then(function(dataUrl) {
		//     var link = document.createElement("a");
		//     link.download = "my-image-name.jpeg";
		//     link.href = dataUrl;
		//     link.click();
		//   });

		// domtoimage.toBlob(document.getElementById("itLayout")).then(function(blob) {
		//   console.log("blob", blob);
		// });
		// const self = this
		console.log('checkk', document.getElementById('itLayout'));
		domtoimage
			.toPng(document.getElementById('itLayout'))
			.then(function(dataUrl) {
				console.log('data url base 64', dataUrl);

				// self.printImageTest(dataUrl);
				FujitsuThermalPrinter.PrintImageBmp({
					base64: dataUrl,
					cutPaper: 0,
					paperFeed: 64,
				}).then((res) => {
					this.showToast(res.message);
					this.responseDebug = res.message;
				}),
					(err) => {
						this.responseDebug = err;
					};
			})
			.catch(function(error) {
				console.error('oops, something went wrong!', error);
			});
	}

	printImageTest(img) {
		FujitsuThermalPrinter.PrintImageBmp({
			base64: img,
			cutPaper: 0,
			paperFeed: 64,
		}).then((res) => {
			this.showToast(res.message);
			this.responseDebug = res.message;
		}),
			(err) => {
				this.responseDebug = err;
			};
	}

	beep() {
		FujitsuThermalPrinter.Beep({ t1: 3, t2: 5 }).then((res) => {
			this.showToast(res.message);
		});
	}
}
