import http from 'https';
import cron from 'node-cron';

const cronJob = () => {
	return cron.schedule('*/14 * * * *', () => {
		http.get('https://nc-news-qvv1.onrender.com', () => {
			console.log('Pinged!');
		});
	});
};

export default cronJob;
