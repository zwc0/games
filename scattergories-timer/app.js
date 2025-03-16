// #region DOM Element Targets
const divErrors = document.getElementById('errors');
const divLetter = document.getElementById('letter');
const divtimer = document.getElementById('timer');
const btnStart = document.getElementById('start');
const btnStop = document.getElementById('stop');
// #endregion DOM Element Targets

/**
 * 
 * @param {HTMLElement} el 
 * @param {boolean} enabled 
 */
function enableBtn(el, enabled = true){
	el.disabled = !enabled;
}

// #region Notifications

/**
 * @typedef {{success: true}|{success: false; errorMsg: string;}} CheckResult
 */

/**
 * Check for notification support.
 * @returns {CheckResult}
 */
function checkNotificationSupport(){
	if (!('Notification' in window))
		return {
			success: false,
			errorMsg: 'This browser does not support notifications',
		};
	return {
		success: true,
	};
}

/**
 * Check for notification feature and permissions.
 * @returns {CheckResult}
 */
function checkNotificationPermissions(){
	const supportCheck = checkNotificationSupport();
	if (!supportCheck.success)
		return supportCheck;
	if (Notification.permission !== 'granted')
		return {
			success: false,
			errorMsg: 'Notification permissions denied',
		};
	return {
		success: true,
	};
}

/**
 * Request notification permissions.
 * @returns {Promise<CheckResult>}
 */
async function requestNotificationPermissions(){
	const supportCheck = checkNotificationSupport();
	if (!supportCheck.success)
		return supportCheck;
	if (await Notification.requestPermission() !== 'granted')
		return {
			success: false,
			errorMsg: 'Notification permissions denied',
		};
	return {
		success: true,
	};
}

// #endregion Notifications

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function generateRandomLetter(){
	const rn = Math.floor(Math.random() * 26);
	return letters[rn];
}

const duration = 1000 * 60 * 3;
function startTimer(){
	const endTime = +new Date() + duration;
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
						body: `scattergories-timer-${endTime}`,
						tag: `scattergories-timer-${endTime}`,
					},
				};
				//Trigger notification via service worker as android currently only supports the API via SW.
				//Tag in this case doesn't prevent duplicate alerts for some reason.
				//Only call second notification if service worker attempt fails.
				const swNotification = navigator?.serviceWorker?.registration?.showNotification?.(notificationData.title, notificationData.options);
				if (!swNotification)
					new Notification(notificationData.title, notificationData.options);
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

async function init(){
	const notificationCheck = await requestNotificationPermissions();
	if (!notificationCheck.success){
		divErrors.textContent = notificationCheck.errorMsg;
	}

	btnStart.addEventListener('click', () => {
		divLetter.textContent = generateRandomLetter();
		startTimer();
	});
}

init();