import '../types/index.js';

function startTimer({duration, divtimer, displayNotification}){
	const endTime = +new Date() + duration;
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

const parseDuration = (duration) => {
	if (!duration) {
		return;
	}
	try{
		if (duration.includes(':')) {
			const [minutes, seconds] = duration.split(':');
			return 1000 * 60 * minutes + 1000 * seconds;
		}
		return (Number(duration) || 0) * 1000 * 60;
	}catch(e){
		return;
	}
}

/**
 * @param {ModuleConstructor} params
 * @returns {ModuleReturn}
 */
export default function (params, _duration) {
	const duration = parseDuration(_duration);
	if (!duration) {
		params.container.innerHTML = `<div>
			Duration param is required. Config example: 
			<br />
			{module} 1
		</div>`;
		return;
	}

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
				duration,
				divtimer: elTimer,
				displayNotification: params.actions.displayNotification
			});
			abortController = res.abortController;
		},
	dispose: () => {
			abortController?.abort();
		},
	};
};