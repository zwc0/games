import '../types/index.js';

const duration = () =>
	1000 * 60 * 0
	+ 1000 * 5;

function startTimer({divtimer, displayNotification}){
	const endTime = +new Date() + duration();
	const abortController = new AbortController();
	abortController.signal.addEventListener('abort', () => {
		clearInterval(interval);
	});

	const stop = () => abortController.abort();

	function checkTime(){
		const diff = endTime - new Date();
		if (diff <= 0) {
			divtimer.textContent ='0:00';
			stop();
			displayNotification({
				title: 'Stop!',
				options: {
					tag: `scattergories-timer-${endTime}`,
				},
			});
			return;
		}
		const diffSeconds = Math.ceil(diff / 1000);
		const minutes = Math.floor(diffSeconds / 60);
		const seconds = diffSeconds % 60;
		divtimer.textContent =`${minutes}:${seconds.toString().padStart(2, 0)}`;
	}
	const interval = setInterval(checkTime, 250);
	checkTime();

	return {abortController};
}

/**
 * @param {ModuleConstructor} params
 * @returns {ModuleReturn}
 */
export default (params) => {
	params.container.innerHTML = `<div>
			Time remaining:
			<br />
			<span data-id="timer">0:00</span>
		</div>`;
	const elTimer = params.container.querySelector('[data-id="timer"]');
	let abortController;

	return {
		start: () => {
			abortController?.abort();
			const res = startTimer({
				divtimer: elTimer, displayNotification: params.actions.displayNotification
			});
			abortController = res.abortController;
		},
		dispose: () => {
			//cleanup event listeners	
		},
	};
};