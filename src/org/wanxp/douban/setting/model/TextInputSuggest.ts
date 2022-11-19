import {App, ISuggestOwner, Scope} from "obsidian";
import Suggest from "./Suggest";
import { createPopper, type Instance as PopperInstance } from "@popperjs/core";


// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes

export abstract class TextInputSuggest<T> implements ISuggestOwner<T> {
	protected app: App;
	protected inputEl: HTMLInputElement;

	private popper: PopperInstance;
	private scope: Scope;
	private suggestEl: HTMLElement;
	private suggest: Suggest<T>;

	constructor(app: App, inputEl: HTMLInputElement) {
		this.app = app;
		this.inputEl = inputEl;
		this.scope = new Scope();

		this.suggestEl = createDiv("suggestion-container");
		const suggestion = this.suggestEl.createDiv("suggestion");
		this.suggest = new Suggest(this, suggestion, this.scope);

		this.scope.register([], "Escape", this.close.bind(this));

		this.inputEl.addEventListener("input", this.onInputChanged.bind(this));
		this.inputEl.addEventListener("focus", this.onInputChanged.bind(this));
		this.inputEl.addEventListener("blur", this.close.bind(this));
		this.suggestEl.on("mousedown", ".suggestion-container", (event: MouseEvent) => {
			event.preventDefault();
		});
	}

	onInputChanged(): void {
		const inputStr = this.inputEl.value;
		const suggestions = this.getSuggestions(inputStr);

		if (suggestions.length > 0) {
			this.suggest.setSuggestions(suggestions);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			this.open((<any>this.app).dom.appContainerEl, this.inputEl);
		}
	}

	open(container: HTMLElement, inputEl: HTMLElement): void {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(<any>this.app).keymap.pushScope(this.scope);

		container.appendChild(this.suggestEl);
		this.popper = createPopper(inputEl, this.suggestEl, {
			placement: "bottom-start",
			modifiers: [
				{
					name: "sameWidth",
					enabled: true,
					fn: ({ state, instance }) => {
						// Note: positioning needs to be calculated twice -
						// first pass - positioning it according to the width of the popper
						// second pass - position it with the width bound to the reference element
						// we need to early exit to avoid an infinite loop
						const targetWidth = `${state.rects.reference.width}px`;
						if (state.styles.popper.width === targetWidth) {
							return;
						}
						state.styles.popper.width = targetWidth;
						instance.update();
					},
					phase: "beforeWrite",
					requires: ["computeStyles"],
				},
			],
		});
	}

	close(): void {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(<any>this.app).keymap.popScope(this.scope);

		this.suggest.setSuggestions([]);
		this.popper.destroy();
		this.suggestEl.detach();
	}

	abstract getSuggestions(inputStr: string): T[];
	abstract renderSuggestion(item: T, el: HTMLElement): void;
	abstract selectSuggestion(item: T): void;
}
