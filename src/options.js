
import { Symbols } from './module-symbols.js'

const
	$ = Symbols(), {
		$_addOption,
		$_options,
		$_pending,
		$_reducePendingOptions,
		$_types
	} = $

class Options {

	constructor( options ) {
		this[$_options] = new Map()
		this[$_pending] = new Map()
		this[$_types] = new Map()
	}

	[$_addOption]( name, v ) {
		if( this[$_types].has(name) ) {
			const
				type = this[$_types].get(name),
				validator = type.validator

			let isValid, value

			if( this[$_options].has(name) ) {
				if( type.has.merge ) {
					({ isValid, value } = validator.validate(v))

					if( isValid ) {
						this[$_options].set(name, validator.merge(this[$_options].get(name), value))
					} // else keep existing value
				} // without merge we don't validate, because we keep the existing value
			
			} else {
				({ isValid, value } = validator.validate(v))
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
					validator = type.validator,
					{ isReduced, value } = validator.reduce(values)
				
				if( isReduced ) {
					this[$_options].set(name, value)
					this[$_pending].delete(name)
				}
			}
		}
	}

	addTypes( types ) {
		for( const [name, type] of Object.entries(types) ) {
			const subtype = this[$_types].get(name)
			this[$_types].set(name, subtype ? type.mergeSubtype(subtype) : type)
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
		
	}

}

export { Options }

