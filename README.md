deasync
=======
deasync provides a JavaScript wrapper to run Node.js event loop. The core of deasync  is writen in C++.

## Motivation
Suppose you maintain a library that exposes a function <code>getData</code>. Your users call it to get actual data:   
<code>var output = getData();</code>  
Under the hood data is saved in a file so you implemented <code>getData</code> using Node.js built-in <code>fs.readFileSync</code>. It's obvious both <code>getData</code> and <code>fs.readFileSync</code> are sync functions. One day you were told to switch the underlying data source to a repo such as MongoDB which can only be accessed asynchronously. You were also told to avoid pissing off your users, <code>getData</code> API cannot be changed to return merely a promise or demand a callback parameter. How do you meet both requirements?

You may tempted to use [node-fibers](https://github.com/laverdet/node-fibers) or a module derived from it, but node fibers can only wrap async function call into a sync function inside a fiber. In the case above you cannot assume all  callers are inside fibers. For similar reason ES6 generators won't work either. What really needed is a way to block subsequent JavaScript from running without blocking entire thread. Ideally the blockage is removed as soon as the result of async function is available. A less ideal but acceptable alternative is a `sleep` function which you can use to implement the blockage such as ```while(!done) sleep(100);```. It is less ideal because sleep duration has to be guessed. It is important the `sleep` function doesn't block the thread, nor should it incur busy wait that pegs the CPU to 100%. 

deasync provides an implementation of such `sleep` function.

## Usages
* Sleep 

```
function SyncFunction(){
  var ret;
  setTimeout(function(){
      ret = "hello";
  },3000);
  while(ret === undefined) {
    require('deasync').sleep(100);
  }
  // returns hello with sleep and undefined otherwise
  return ret;    
}
```

* Generic wrapper of async function with standard API signature `function(p1,...pn,function cb(err,res){})`

```
var deasync = require('deasync');
var cp = require('child_process');
var exec = deasync(cp.exec);
// output result of ls -la
console.log(exec('ls -la'));
// done is printed last with deasync as anticipated and first otherwise.
console.log('done');
```

## Installation
Prerequisites: Except on a few platforms where binary distribution is included, deasync uses node-gyp to compile C++ source code so you may need the compilers listed in [node-gyp](https://github.com/TooTallNate/node-gyp). 

To install, run 
```npm install deasync```
