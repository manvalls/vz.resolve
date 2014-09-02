
var Property = require('vz.property'),
    nextTick = require('vz.next-tick'),
    
    callback = new Property(),
    thisArg = new Property(),
    
    canResolveSync = false,
    resolveSyncFlag = false,
    resolveResult = null;

function Resolver(cb,that){
  callback.of(this).set(cb);
  thisArg.of(this).set(that || this);
}

Object.defineProperty(Resolver.prototype,'resolve',{value: function(data){
  
  if(canResolveSync){
    resolveSyncFlag = true;
    resolveResult = data;
  }else callback.of(this).get().call(thisArg.of(this).get(),data);
  
}});

function clearFlag(){
  canResolveSync = false;
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
  
  canResolveSync = true;
  resolveSyncFlag = false;
  nextTick(clearFlag);
  func.apply(resolver,args);
  clearFlag();
  
  if(resolveSyncFlag){
    ret = resolveResult;
    resolveSyncFlag = null;
    resolveResult = null;
  }
  
  return ret;
};

module.exports.deferred = {};

