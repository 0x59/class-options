const
	TYPES = require('./types.js')
	Option = require('./option.js')

const
	WARN = 1,
	{ UNDEF, STR, BOOL, NUM, FN, OBJ, SYM } = TYPES

class Options {
	constructor( options = {}, superOptions = {}, descriptors = {}, base = false ) {		
		let $

		if( typeof superOptions !== OBJ ) {
			throw new Error('Super options not an object')
		}
		
		if( typeof descriptors !== OBJ ) {
			throw new Error('Descriptors not an object')
		}
		
		if( options instanceof Options ) {
			$ = options

		} else if( typeof options === OBJ ) {
			$ = this

			Object.defineProperty($, '_options', {
				value: new Map()
			})
			
			Object.defineProperty($, '_pending', {
				value: new Map()
			})
			
			$.$addOptions(options)

		} else {
			throw new Error('Passed options not a Options instance or object')
		}
		
		$.$addOptions(superOptions)
		$.$addDescriptors(descriptors)
		$.$checkPendingOptions(!!base)

		return $
	}

	$addDescriptors( descriptors ) {
		for( const [name, des] of Object.entries(descriptors) ) {
			if( this._options.has(name) ) {
				throw new Error(`Duplicate descriptor defined for class option [${name}]`)
			}
			this._options.set(name, new Option(des, name))

			Object.defineProperty(this, name, {
				enumerable: true,
				get: () => this._options.get(name).value()
			})
		}
	}

	$addOptions( options ) {
		for( const [name, option] of Object.entries(options) ) {
			if( this._options.has(name) ) {
				this._options.get(name).value(option)

			} else {
				if( !this._pending.has(name) ) {
					this._pending.set(name, [])
				}
				this._pending.get(name).push(option)
			}
		}
	}

	$checkPendingOptions( base = false ) {
		for( const [name, optionList] of this._pending ) {
			if( this._options.has(name) ) {
				this._options.get(name).values(this._pending.get(name), true)
				this._pending.delete(name)
			
			} else if( base ) {
				WARN && console.warn(`No descriptor defined for class option [${name}]`)
				
				Object.defineProperty(this, name, {
					enumerable: true,
					get: () => this._pending.get(name)[0]
				})
			}
		}
	}
}

module.exports = Options
