require('@babel/register')({
    presets: ['@babel/preset-env']
})

require('@babel/polyfill')

const app = require('./app');

module.exports = app.listen(3000, () => {
    console.log('-----------------------------------------');
    console.log(`Process ${process.pid} is listening to all incoming requests on ${process.env.APP_PORT}`);

});