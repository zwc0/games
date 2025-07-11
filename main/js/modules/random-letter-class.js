import '../types/index.js';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function generateRandomLetter(){
	const rn = Math.floor(Math.random() * 26);
	return letters[rn];
}

/**
 * @param {ModuleConstructor} params
 * @returns {ModuleReturn}
 */
export default class {
	constructor(params) {
		params.container.innerHTML = `<div>
			Letter:
			<br />
			<span data-id="letter">Press Start to begin</span>
		</div>`;
		this.elLetter = params.container.querySelector('[data-id="letter"]');
	}
	start() {
		this.elLetter.textContent = generateRandomLetter();
	}
	dispose() {
		//cleanup event listeners	
	}
};