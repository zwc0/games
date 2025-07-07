// #region DOM Element Targets
const divErrors = document.getElementById('errors');
const btnStart = document.getElementById('start');
const btnStop = document.getElementById('stop');
const btnConfig = document.getElementById('btnConfig');
const textareaModules = document.getElementById('modules');
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

async function displayNotification(notificationData){
	if (!checkNotificationPermissions().success)
		return;
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

// #endregion Notifications

const importPresets = {
	'Scattergories': [
		'./modules/random-letter.js',
		'./modules/countdown.js',
	],
};

let imports = importPresets['Scattergories'];
textareaModules.value = imports.join('\n');
textareaModules.addEventListener('change', () => {
	imports = textareaModules.value.split('\n').map(x=>x?.trim?.()).filter(x=>x);
	initImports();
});

const initializedModules = new Set();

btnStart.addEventListener('click', () => {
	initializedModules.forEach(x=>x.start());
});

async function initImports(){
	initializedModules.forEach(async x=>{
		try{
			await x?.dispose?.();
		}catch(e){
			console.error(e);
		}finally{
			initializedModules.delete(x);
		}
	});

	root.innerHTML = '';

	imports.forEach((src)=>{
		const container = document.createElement('div');
		root.appendChild(container);
		import(src)
			.then(module => {
				const m = module.default({container, actions: {
					displayNotification
				}});
				initializedModules.add(m);
			})
			.catch(err => console.error('src: ', src, err));
	});
}

async function init(){
	const notificationCheck = await requestNotificationPermissions();
	if (!notificationCheck.success){
		divErrors.textContent = notificationCheck.errorMsg;
	}

	initImports();
}

init();