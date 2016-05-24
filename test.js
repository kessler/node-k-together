'use strict'

const expect = require('chai').expect
const Together = require('./index.js')

describe('Together', () => {
	it('runs a bunch of functions in parallel', (done) => {
		let tick = 0
		let t = new Together([fn1, fn2])

		t.run((errors, state) => {
			expect(tick).to.be.gt(0)
			expect(state).to.have.property('fn1', 0)
			expect(state).to.have.property('fn2', 0)
			done()
		})

		function fn1(state, cb) {
			state.fn1 = tick
			cb()
		}

		function fn2(state, cb) {
			state.fn2 = tick
			cb()
		}

		process.nextTick(() => {
			tick++
		})
	})
})