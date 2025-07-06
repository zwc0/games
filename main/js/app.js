// #region DOM Element Targets
const divErrors = document.getElementById('errors');
const btnStart = document.getElementById('start');
const btnStop = document.getElementById('stop');
const btnConfig = document.getElementById('btnConfig');
const root = document.getElementById('root');
// #endregion DOM Element Targets

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

const imports = [
	'./modules/random-letter.js',
	'./modules/random-letter.js',
	'./modules/random-letter.js',
	'./modules/random-letter.js',
	// './js/modules/countdown.js',
];

const initializedModules = new Set();

btnStart.addEventListener('click', () => {
	initializedModules.forEach(x=>x.start());
});

async function init(){
	const notificationCheck = await requestNotificationPermissions();
	if (!notificationCheck.success){
		divErrors.textContent = notificationCheck.errorMsg;
	}

	imports.forEach((src)=>{
		const container = document.createElement('div');
		root.appendChild(container);
		import(src)
			.then(module => {
				const m = module.default({container});
				initializedModules.add(m);
			})
			.catch(err => console.error('src: ', src, err));
	});
}

init();