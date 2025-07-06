
/**
 * 
 * @param {HTMLElement} el 
 * @param {boolean} enabled 
 */
function enableBtn(el, enabled = true){
	el.disabled = !enabled;
}

const duration = () =>
	1000 * 60 * document.getElementById('configTimerMinutes').value
	+ 1000 * document.getElementById('configTimerSeconds').value;

function startTimer(){
	const endTime = +new Date() + duration();
	const abortController = new AbortController();
	abortController.signal.addEventListener('abort', () => {
		clearInterval(interval);
		enableBtn(btnStart);
		enableBtn(btnStop, false);
	});

	const stop = () => abortController.abort();

	enableBtn(btnStart, false);

	function checkTime(){
		const diff = endTime - new Date();
		if (diff <= 0) {
			divtimer.textContent ='0:00';
			stop();
			if (checkNotificationPermissions().success){
				const notificationData = {
					title: 'Stop!',
					options: {
						tag: `scattergories-timer-${endTime}`,
					},
				};
				//Trigger notification via service worker as android currently only supports the API via SW.
				//	This also HAS to be from the SW. Using the calling servicWorker...showNotification() doesn't work.
				//Tag in this case doesn't prevent duplicate alerts for some reason.
				//Only call second notification if service worker attempt fails.
				const swController = navigator?.serviceWorker?.controller;
				if (swController)
					swController.postMessage({type: 'notification', notificationData});
				else
					new Notification(notificationData.title, notificationData.options)
						.addEventListener('click', e=>e?.target?.close());;
			}
			return;
		}
		const diffSeconds = Math.ceil(diff / 1000);
		const minutes = Math.floor(diffSeconds / 60);
		const seconds = diffSeconds % 60;
		divtimer.textContent =`${minutes}:${seconds.toString().padStart(2, 0)}`;
	}
	const interval = setInterval(checkTime, 250);
	checkTime();

	enableBtn(btnStop);
	btnStop.addEventListener('click', ()=>{
		stop();
	}, {
		signal: abortController.signal,
	});
}