'use strict'
const debug = require('debug')('k-together')

class Together {

	constructor(functions) {
		this._functions = functions || []
		this._state = {}
		this._isRunning = false
		this._completed = 0
		this._errors = []
	}

	run(state, userCallback) {
		debug('run()')

		if (typeof state === 'function') {
			userCallback = state
			state = undefined
		}

		if (typeof userCallback !== 'function') {
			throw new TypeError('missing a callback parameter')
		}

		if (this._isRunning) {
			throw new Error('already running')
		}

		this._state = state || {}
		this._isRunning = true
		this._completed = 0
		this._errors = []

		let internalCallback = (err, state) => {
			this._isRunning = false

			setImmediate(() => {
				userCallback(this._errors, this._state)
			})
		}

		for (var i = this._functions.length - 1; i >= 0; i--) {
			this._functions[i](this._state, this._completionCallback(i, state, internalCallback))
		}
	}

	_completionCallback(index, state, internalCallback) {
		let callbackWasInvoked = false

		return (err) => {

			debug('next callback')

			if (callbackWasInvoked) {
				debug('callbackWasInvoked')
				let e = new Error('callback was already invoked, callback was already invoked, check err.cause for the offending function')
				e.cause = this._functions[index]
				throw e
			}

			callbackWasInvoked = true

			this._completed++

			if (err) {
				debug('error')
				// TODO this is not so good, since it is not our error object...
				e.cause = this._functions[index]
				return this.errors.push(err)
			}

			if (this._completed === this._functions.length) {
				debug('_run() finished')
				return internalCallback()
			}
		}
	}
}

module.exports = Together
