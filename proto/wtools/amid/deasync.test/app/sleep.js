var deasync = require('../../deasync/Main.ss')
var sleep = deasync(function (timeout, done) {
  setTimeout(done, timeout)
})
sleep(2000)
