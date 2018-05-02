
import { PRIMITIVE_TYPES, COMPOUND_TYPES } from './supported-types.js'
import { Type } from './src/type.js'
import { TypeModifier } from './src/type-modifier.js'

const expect = chai.expect

describe('Type', function() {

	it('should export an object', function() {
		expect(Type).to.be.an('object')
	})

	describe('Interface', function() {

		for( const type of PRIMITIVE_TYPES.keys() ) {
			it(`should return an instance of [TypeModifier] when accessing: ${type}`, function() {
				expect(Type[type]).to.be.an.instanceof(TypeModifier)
			})
		}

		for( const type of COMPOUND_TYPES.keys() ) {
			it(`should return an instance of [TypeModifier] when executing: ${type}()`, function() {
				expect(Type[type]()).to.be.an.instanceof(TypeModifier)
			})
		}

	})

})

