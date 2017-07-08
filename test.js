const t = require('tap')
var bindObj = require('./bind-obj-methods.js')
var obj, m

function makeObj () {
  var obj = {
    method: function () { return this.foo },
    foo: 'bar'
  }

  Object.defineProperty(obj, 'secretMethod', {
    value: function () {
      return 'secret' + this.method()
    },
    enumerable: false,
    configurable: true,
    writable: true
  })

  return obj
}

// pretend we already bound secretMethod
obj = makeObj()
bindObj(obj, null, [ 'secretMethod', 'method' ])
m = obj.method
t.equal(m(), undefined)
m = obj.secretMethod
t.throws(m)

obj = makeObj()
bindObj(obj, obj, { secretMethod: true })
m = obj.method
t.equal(m(), 'bar')
m = obj.secretMethod
t.throws(m)

obj = makeObj()
bindObj(obj, obj)
m = obj.method
t.equal(m(), 'bar')
m = obj.secretMethod
t.equal(m(), 'secretbar')

obj = makeObj()
bindObj(obj, Object.prototype)
m = obj.hasOwnProperty
t.equal(m('hasOwnProperty'), true)
