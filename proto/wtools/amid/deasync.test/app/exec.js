var deasync = require('../../deasync/Main.ss')
var cp = require('child_process')
var exec = deasync(cp.exec)
exec('ls -la')
