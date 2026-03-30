

import {i18nHelper} from "../lang/helper";

	export class ClipboardUtil {

		public static async writeImage(data:ArrayBuffer, options: ClipboardOptions = defaultClipboardOptions) {
			if (!data || data.byteLength == 0) {
				throw new Error(i18nHelper.getMessage('130110'));
			}
			const { clipboard, nativeImage } = require('electron');
			const isWebp = this.isWebp(data);
			let image = nativeImage.createFromBuffer(Buffer.from(data));
			if ((!image || image.isEmpty()) && isWebp) {
				image = await this.createNativeImageFromWebp(data);
			}
			if (!image || image.isEmpty()) {
				throw new Error(i18nHelper.getMessage('130110'));
			}
			clipboard.clear();
			clipboard.writeImage(image);
			await new Promise(resolve => setTimeout(resolve, 100));
			const clipboardImage = clipboard.readImage();
			if (!clipboardImage || clipboardImage.isEmpty()) {
				throw new Error(i18nHelper.getMessage('130110'));
			}
			console.log(`Copied to clipboard as HTML`);
		}

	private static isWebp(data: ArrayBuffer): boolean {
		const bytes = new Uint8Array(data);
		if (bytes.length < 12) {
			return false;
		}
		return bytes[0] === 0x52
			&& bytes[1] === 0x49
			&& bytes[2] === 0x46
			&& bytes[3] === 0x46
			&& bytes[8] === 0x57
			&& bytes[9] === 0x45
			&& bytes[10] === 0x42
			&& bytes[11] === 0x50;
	}

	private static async createNativeImageFromWebp(data: ArrayBuffer) {
		const { nativeImage } = require('electron');
		const imageElement = await this.loadImage(URL.createObjectURL(new Blob([data], {type: 'image/webp'})));
			try {
				const canvas = document.createElement('canvas');
				canvas.width = imageElement.naturalWidth || imageElement.width;
				canvas.height = imageElement.naturalHeight || imageElement.height;
				const context = canvas.getContext('2d');
				if (!context) {
					throw new Error(i18nHelper.getMessage('130110'));
				}
				context.drawImage(imageElement, 0, 0);
				return nativeImage.createFromDataURL(canvas.toDataURL('image/png'));
		} finally {
			imageElement.src = '';
		}
	}

	private static loadImage(url: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => {
				URL.revokeObjectURL(url);
				resolve(image);
			};
				image.onerror = () => {
					URL.revokeObjectURL(url);
					reject(new Error(i18nHelper.getMessage('130110')));
				};
				image.src = url;
			});
	}

}



interface ClipboardOptions {
	contentType?: string,
}

const defaultClipboardOptions: ClipboardOptions = {
	contentType: 'text/plain',
}
