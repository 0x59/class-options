
import { SUPPORTED_TYPES } from './supported-types.js'
import { OptionValidator } from './src/option-validator.js'

const expect = chai.expect

describe('OptionValidator', function() {

	it('should export a constructor function', function() {
		expect(OptionValidator).to.be.a('function')
		expect(new OptionValidator({}, 'arr')).to.be.an('object')
	})

	describe('Internals', function() {
		
	})

	describe('Interface', function() {

		let type

		before(function() {
			type = {}
		})

		for( const name of SUPPORTED_TYPES.keys() ) {
			it(`should instantiate successfully for the supported type: ${name}`, function() {
				expect(() => new OptionValidator(type, name)).to.not.throw()
			})
		}

		for( const name of SUPPORTED_TYPES.keys() ) {
			it(`should provide a validate method for the supported type: ${name}`, function() {
				expect(new OptionValidator(type, name).validate).to.be.a('function')
			})
		}

		it('should provide a method to merge options', function() {
			expect(new OptionValidator(type, 'arr').merge).to.be.a('function')
		})

		it('should provide a method to reduce options', function() {
			expect(new OptionValidator(type, 'arr').reduce).to.be.a('function')
		})

	})

	describe('Usage', function() {

		describe('#validate()', function() {

			let type

			before(function() {
				type = {}
			})

			for( const [name, values] of SUPPORTED_TYPES ) {
				it(`should validate properly for the supported type: ${name}`, function() {
					let result = new OptionValidator(type, name).validate(values.valid)
					if( values.hasOwnProperty('valid') ) expect(result.isValid).to.be.true

					result = new OptionValidator(type, name).validate(values.invalid)
					if( values.hasOwnProperty('invalid') ) expect(result.isValid).to.be.false
				})
			}

		})
		
		describe('#merge()', function() {

		})

		describe('#reduce()', function() {

		})

	})

})

