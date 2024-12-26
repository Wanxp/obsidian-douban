

export class ClipboardUtil {

	public static async writeImage(data:ArrayBuffer, options: ClipboardOptions = defaultClipboardOptions) {
		const { clipboard, nativeImage } = require('electron');

		await clipboard.writeImage(nativeImage.createFromBuffer(data));
		console.log(`Copied to clipboard as HTML`);
	}

}



interface ClipboardOptions {
	contentType?: string,
}

const defaultClipboardOptions: ClipboardOptions = {
	contentType: 'text/plain',
}

