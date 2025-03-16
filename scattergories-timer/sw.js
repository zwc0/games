/// <reference lib="webworker" />

self.addEventListener('install', event => {
	self.skipWaiting();
});

self.addEventListener('activate', function (event) {
	event.waitUntil(
		clients.claim()
	);
});

// self.addEventListener('message', async (event) => {
// 	if (event.data.type !== 'notification')
// 		return;
// 	console.log(event.data);
// 	self.registration.showNotification(event.data.notificationData.title, event.data.notificationData.options);
// });