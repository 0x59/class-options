
import { Options } from './src/options.js'

const
	PUBLIC_METHODS = new Map([
		[ 'addTypes', 'to add types' ],
		[ 'addOptions', 'to add options' ],
		[ 'attachTo', 'to attach options to the instance' ]
	]),
	expect = chai.expect

describe('Options', function() {

	it('should export a constructor function', function() {
		expect(Options).to.be.a('function')
		expect(new Options()).to.be.an('object')
	})

	describe('Interface', function() {

		for( const [methodName, testDescription] of PUBLIC_METHODS ) {
			it(`should provide a method ${testDescription}`, function() {
				expect(new Options()[methodName]).to.be.a('function')
			})
		}

	})

	describe('Usage', function() {

		describe('#addTypes()', function() {

		})
		
		describe('#addOptions()', function() {

		})

		describe('#attachTo()', function() {

		})

	})

})

