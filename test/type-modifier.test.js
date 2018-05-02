
import { SUPPORTED_TYPES } from './supported-types.js'
import { TYPE_MODIFIERS } from './type-modifiers.js'
import { TypeModifier } from './src/type-modifier.js'
import { OptionValidator } from './src/option-validator.js'

const expect = chai.expect

describe('TypeModifier', function() {

	it('should export a function', function() {
		expect(TypeModifier).to.be.a('function')
	})

	describe('Interface', function() {

		for( const type of SUPPORTED_TYPES.keys() ) {
			it(`should create an instance of [TypeModifier] for the supported type: ${type}`, function() {
				expect(new TypeModifier(type)).to.be.an.instanceof(TypeModifier)
			})
		}

		it('should throw for unsupported types', function() {
			expect(() => new TypeModifier('dsf')).to.throw()
		})

		describe('#validator', function() {

			it('should return an [OptionValidator] instance when accessed', function() {
				expect(new TypeModifier('any').validator).to.be.an.instanceof(OptionValidator)
			})

			it('should throw when attempting to assign', function() {
				expect(() => new TypeModifier('any').validator = void 0).to.throw()
			})

		})

		describe('modifiers + #has', function() {

			let	typeModifier

			beforeEach(function() {
				typeModifier = new TypeModifier('arr')
			})
			
			TYPE_MODIFIERS.forEach(function(modifier) {
				it(`should change type (by inspection) when accessed or executed: ${modifier}`, function() {
					expect(typeModifier.has[modifier]).to.be.false
					if( typeof typeModifier[modifier] === 'function' ) {
						expect(typeModifier[modifier](() => {})).to.be.an.instanceof(TypeModifier)

					} else {
						expect(typeModifier[modifier]).to.be.an.instanceof(TypeModifier)
					}
					expect(typeModifier.has[modifier]).to.be.true
				})
			})

			it('should support chaining all modifiers', function() {
				let step = typeModifier
				TYPE_MODIFIERS.forEach(function(modifier) {
					if( typeof typeModifier[modifier] === 'function' ) {
						step = step[modifier](() => {})

					} else {
						step = step[modifier]
					}
				})
				TYPE_MODIFIERS.forEach(function(modifier) {
					expect(step.has[modifier]).to.be.true
				})
			})

		})

		describe('#mergeSubtype()', function() {
			
			let supertype, subtype

			before(function() {
				supertype = new TypeModifier('arr')
				subtype = new TypeModifier('super')
			})

			it('should merge subtype descriptor properties over supertype descriptor properties, except: isSuper', function() {
				supertype.dflt(() => [])
				subtype.dflt(() => void 0).merge(( a, b ) => a.concat(b)).isPublic

				const mergedType = supertype.mergeSubtype(subtype)
				expect(mergedType.has.dflt).to.be.true
				expect(mergedType.has.merge).to.be.true
				expect(mergedType.has.isPublic).to.be.true

				const result = mergedType.validator.validate()
				expect(result.isValid).to.be.true
				expect(result.value).to.be.undefined
			})

		})

	})

})

