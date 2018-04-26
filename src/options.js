
import { Symbols } from './module-symbols.js'
import { TypeModifier } from './type-modifier.js'

const
	WARN = 1,
	$ = Symbols(), {
		$_,
		$_addOption,
		$_options,
		$_pending,
		$_reducePendingOptions,
		$_types
	} = $

class InvalidType extends Error {}

class Options {

	constructor( options ) {
		this[$_options] = new Map()
		this[$_pending] = new Map()
		this[$_types] = new Map()
	}

	[$_addOption]( name, v ) {
		const type = this[$_types].get(name)

		if( type && !type.has.isSuper ) {
			let isValid, value

			if( this[$_options].has(name) ) {
				if( type.has.merge ) {
					({ isValid, value } = type.validator.validate(v))

					if( isValid ) {
						this[$_options].set(name, validator.merge(this[$_options].get(name), value))
					} // else keep existing value
				} // without merge we don't validate, because we keep the existing value
			
			} else {
				({ isValid, value } = type.validator.validate(v))
				if( isValid ) {
					this[$_options].set(name, value)
				}
			}
	
		} else if( this[$_pending].has(name) ) {
			this[$_pending].get(name).push(v)

		} else {
			this[$_pending].set(name, [ v ])
		}
	}

	[$_reducePendingOptions]( types ) {
		for( const name of Object.keys(types) ) {
			const values = this[$_pending].get(name)
			
			if( values ) {
				const
					type = this[$_types].get(name),
					{ isReduced, value } = type.validator.reduce(values)
				
				if( isReduced ) {
					this[$_options].set(name, value)
					this[$_pending].delete(name)
				}
			}
		}
	}

	addTypes( types ) {
		for( const [name, type] of Object.entries(types) ) {
			if( type instanceof TypeModifier ) {
				const subtype = this[$_types].get(name)
				this[$_types].set(name, subtype ? type.mergeSubtype(subtype) : type)

			} else {
				throw new InvalidType(`Encountered invalid type: [${name}] while adding types`)
			}
		}

		this[$_reducePendingOptions](types)
	}
	// add/validate option values
	addOptions( options ) {
		for( let [name, value] of Object.entries(options) ) {
			this[$_addOption](name, value)
		}
	}
	// setup options for use on class instance
	attachTo( instance ) {
		let	target,
			options = this

		instance[$_] = {}
		for( let [name, value] of this[$_options] ) {
			target = this[$_types].get(name).has.isPublic ? instance : instance[$_]

			Object.defineProperty(target, name, {
				get() {
					return options[$_options].get(name)
				},
				set( v ) {
					const
						validator = options[$_types].get(name).validator,
						{ isValid, value } = validator.validate(v)

					if( isValid ) {
						options[$_options].set(name, value)

					} else if( WARN ) {
						console.warn(`Unable to set option: [${name}] with invalid value: [${value}].`)
					}
				},
				enumerable: false,
				configurable: false
			})
		}
	}

}

export { Options, $_ }

