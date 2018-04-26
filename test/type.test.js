
import { PRIMITIVE_TYPES, COMPOUND_TYPES } from './supported-types.js'
import { Type } from './src/type.js'
import { TypeModifier } from './src/type-modifier.js'

const expect = chai.expect

describe('Type', function() {

	it('should export an object', function() {
		expect(Type).to.be.an('object')
	})

	describe('Interface', function() {

		PRIMITIVE_TYPES.forEach(function(type) {
			it(`should return an instance of [TypeModifier] when accessing: ${type}`, function() {
				expect(Type[type]).to.be.an.instanceof(TypeModifier)
			})
		})

		COMPOUND_TYPES.forEach(function(type) {
			it(`should return an instance of [TypeModifier] when executing: ${type}()`, function() {
				expect(Type[type]()).to.be.an.instanceof(TypeModifier)
			})
		})

	})

})

