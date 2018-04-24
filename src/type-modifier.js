
import { Symbols } from './module-symbols.js'
import { OptionValidator } from './option-validator.js'

const
	$ = Symbols(), {
		$_type,
		$_validator
	} = $

class TypeModifier {

	get validator() {
		return this[$_validator]
	}

	set validator( _ ) {
		throw new Error('Modifying validator with type modifier not supported')
	}

	mergeSubtype( type ) {
		const
			supertype = this[$_type]
			subtype = type[$_type]

		if( subtype.isSuper ) {
			// keep isSuper false if false, true has no effect (overwrites true)
			Object.assign(supertype, subtype, { isSuper: supertype.isSuper })
			return this

		} else {
			return type
		}
	}

	constructor( validatorName, ...validatorArgs ) {
		
		if( name === 'super' ) {
			this[$_type] = {
				isSuper: true
			}

		} else {
			this[$_type] = {
				isSuper: false,
				isRequired: false,
				nullOk: false,
				undefOk: false,
				merge: false,
				throw: false,
				dflt: null
			}
		}

		this.has = new Proxy(this, {
			get: ( _this, prop ) => !!_this[$_type][prop]
		})

		this[$_validator] = new OptionValidator(this[$_type], validatorName, ...validatorArgs)
	}
	// is the key required on the options object
	get isRequired() {
		this[$_type].isRequired = true
		return this
	}
	// key present, = null
	get nullOk() {
		this[$_type].nullOk = true 
		return this
	}
	// key present, = void 0
	get undefOk() {
		this[$_type].undefOk = true
		return this
	}
	// merge with any super options encountered, does nothing if subclass doesn't define it
	get merge() {
		this[$_type].merge = true
		return this
	}
	// throw for invalid type with no default
	get throw() {
		this[$_type].throw = true 
		return this
	}
	// used if key isn't present or key is present and null/undef are not valid
	dflt( fn ) {
		this[$_type].dflt = fn
		return this
	}

}

export { TypeModifier }

