self.addEventListener('install', () => {
	fetch('https://api.test.profcomff.com/marketing/v1/action', {
		method: 'POST',
		body: JSON.stringify({
			action: 'app install',
		}),
	});
});
