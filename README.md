# vz resolve

**DEPRECATED** in favour of [vz.yielded](https://www.npmjs.org/package/vz.yielded "vz.yielded")

[![NPM](https://nodei.co/npm/vz.resolve.png?downloads=true)](https://nodei.co/npm/vz.resolve/)

No piece of software is ever completed, feel free to contribute and be humble

## Sample usage:

```javascript

var resolve = require('vz.resolve'),
    nextTick = require('vz.next-tick'),
    result;

result = resolve(function solve(){
  if(Math.random() < 0.5) this.resolve('Hello world');
  else nextTick(solve,[],this);
},function(data){
  console.log('Received asynchronously:',data);
});

if(result != resolve.deferred) console.log('Received synchronously:',result);

```
## Reference

### resolve(function[,arguments],callback[,thisArg])

This function executes *function* with *arguments* or an empty array as arguments, and a new Resolver as the thisArg. If Resolver.resolve is called within *function*, then this function returns the value passed to that call, otherwise it returns resolve.deferred, a unique object representing that the task could not be completed synchronously, and executes *callback* with *thisArg* as thisArg when Resolver.resolve is called.
