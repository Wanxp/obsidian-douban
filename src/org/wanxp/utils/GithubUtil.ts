export default class GithubUtil {

	/**
	 * get gists content as object
	 * @param gistId
	 * @param fileName
	 */
	public static async getGistsData(gistId:string, fileName:string): Promise<string> {
		const gistUrl = `https://api.github.com/gists/${gistId}`
		return fetch(gistUrl)
			.then(response => response.json())
			.then(data => {
				const files = Object.keys(data.files);
				const file = files[0];
				return data.files[file].content;
			})
			.catch(error => console.error(error));
	}
}
