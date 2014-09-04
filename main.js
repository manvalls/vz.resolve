
var Property = require('vz.property'),
    nextTick = require('vz.next-tick'),
    
    callback = new Property(),
    thisArg = new Property(),
    
    canResolveSync = new Property(),
    resolveSyncFlag = new Property(),
    resolveResult = new Property();

function Resolver(cb,that){
  canResolveSync.of(this).set(false);
  callback.of(this).set(cb);
  thisArg.of(this).set(that || this);
}

Object.defineProperty(Resolver.prototype,'resolve',{value: function(data){
  
  if(canResolveSync.of(this).get()){
    resolveSyncFlag.of(this).set(true);
    resolveResult.of(this).set(data);
  }else callback.of(this).get().call(thisArg.of(this).get(),data);
  
}});

function clearFlag(resolver){
  canResolveSync.of(resolver).set(false);
}

module.exports = function(func,args,callback,thisArg){
  var resolver,
      ret = module.exports.deferred;
  
  if(args.apply){
    thisArg = callback;
    callback = args;
    args = null;
  }
  
  args = args || [];
  
  resolver = new Resolver(callback,thisArg);
  
  canResolveSync.of(resolver).set(true);
  resolveSyncFlag.of(resolver).set(false);
  nextTick(clearFlag,[resolver]);
  func.apply(resolver,args);
  clearFlag(resolver);
  
  if(resolveSyncFlag.of(resolver).get()){
    ret = resolveResult.of(resolver).get();
    resolveSyncFlag.of(resolver).set(null);
    resolveResult.of(resolver).set(null);
  }
  
  return ret;
};

module.exports.deferred = {
  toString: function(){ return Math.random() + '-' + Date.now(); }
};

