import {
	DEFAULT_TEMPLATE_CONTENT,
	DEFAULT_TEMPLATE_CONTENT_WITH_STATE,
} from "../src/org/wanxp/constant/DefaultTemplateContent";

describe("default template image paths", () => {
	it.each([
		["default", DEFAULT_TEMPLATE_CONTENT],
		["state", DEFAULT_TEMPLATE_CONTENT_WITH_STATE],
	])("wraps every %s template image destination so paths may contain spaces", (_, templates) => {
		const templateContents = Object.values(templates);
		const templatesWithImages = templateContents.filter((template) => template.includes("{{image}}"));

		expect(templatesWithImages).toHaveLength(6);
		for (const template of templatesWithImages) {
			expect(template).toContain("![image](<{{image}}>)");
			expect(template).not.toContain("![image]({{image}})");
			expect(template.replace(
				"{{image}}",
				"4. Archives/豆瓣/Attachments/p2885326350.jpg",
			)).toContain("![image](<4. Archives/豆瓣/Attachments/p2885326350.jpg>)");
		}
	});
});
