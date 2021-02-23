const t = require('tap')
var bindObj = require('./bind-obj-methods.js')
var obj, m

function makeObj () {
  var obj = {
    method () { return this.foo },
    foo: 'bar'
  }

  Object.defineProperty(obj, 'secretMethod', {
    value () {
      return 'secret' + this.method()
    },
    enumerable: false,
    configurable: true,
    writable: true
  })

  Object.defineProperty(obj, 'writable', {
    value () {
      return 'writable' + this.method()
    },
    configurable: false,
    writable: true
  })

  Object.defineProperty(obj, 'readonly', {
    value () {
      return 'readonly' + (this === global ? '' : 'error')
    },
    configurable: false,
    writable: false
  })

  Object.defineProperty(obj, 'getter', {
    get () {
      return 'getter' + (this === global ? '' : 'error')
    },
    configurable: true
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
m = obj.writable
t.equal(m(), 'writablebar')
m = obj.readonly
t.equal(m(), 'readonly')

// This is a weird thing to do but here it is.
m = Object.getOwnPropertyDescriptor(obj, 'getter').get
t.equal(m(), 'getter')

obj = makeObj()
bindObj(obj, Object.prototype)
m = obj.hasOwnProperty
t.equal(m('hasOwnProperty'), true)
