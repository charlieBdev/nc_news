const app = require('./app/app');
const { default: cronJob } = require('./pinger/pinger');
const { PORT = 9090 } = process.env;

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}...`);
});

if (process.env.NODE_ENV === 'production') {
	cronJob.start();
}
