const http = require('https');
const cron = require('node-cron');

const cronJob = () => {
	return cron.schedule('*/14 * * * *', () => {
		http.get('https://nc-news-qvv1.onrender.com', () => {
			console.log('Pinged!');
		});
	});
};

module.exports = cronJob;
