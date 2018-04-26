
import { TYPES } from './utility.js'
import { Symbols } from './module-symbols.js'

const
	WARN = true,
	$ = Symbols(), {
		$_fallbackValidate,
		$_type,
		$_validate,
		$_validateAndReduce,
	} = $,
	{ STR, FN, OBJ, NUM, BOOL, SYM, UNDEF } = TYPES

class InvalidOption extends Error {}

class OptionValidator {

	constructor( type, name, ...args ) {
		this[$_type] = type
		this.validate = this[$[name]].bind(this, ...args)
	}

	merge(existingValue, v) {
		let	value,
			isMerged = false

		if( this[$_type].merge ) {
			({ isMerged, value} = this[$_type].merge(existingValue, v))
		}

		return { isMerged, value }
	}

	reduce( values ) {
		let	value,
			isReduced = false

		if( !this[$_type].isSuper ) {
			if( this[$_type].merge ) {
				value = values.reduce(this[$_validateAndReduce])
			
			} else {
				value = values[0]
			}
			isReduced = true
		}
		
		return { isReduced, value }
	}

	[$_validateAndReduce]( existingValue, currentValue ) {
		let { isValid, value } = validator(currentValue)

		if( isValid ) {
			({ value } = validator.merge(existingValue, currentValue))
		
		} else {
			WARN && console.warn('Skipping invalid option value while reducing!') 
			value = existingValue
		}

		return value
	}

	[$_validate]( v, test ) {
		let	value,
			isValid = test

		if( isValid ) {
			value = v

		} else {
			({ isValid, value } = this[$_fallbackValidate](v))
		}

		return { isValid, value }
	}

	[$_fallbackValidate]( v ) {
		let	value,
			isValid = true
		
		if( this[$_type].dflt ) {
			WARN && console.warn('Setting invalid option value to default')
			value = type.dflt()

		} else if( this[$_type].nullOk ) {
			WARN && console.warn('Setting invalid option value to null')
			value = null

		} else if( this[$_type].undefOk ) {
			WARN && console.warn('Setting invalid option value to undefined')
			value = void 0

		} else {
			if( this[$_type].throw ) {
				throw new InvalidOption('Invalid option value encourntered')
			
			} else {
				isValid = false
				value = v
				WARN && console.warn('Invalid option value encountered')
			}
		}
			
		return { isValid, value }
	}

	[$.super]( v ) {
		return v
	}

	[$.any]( v ) {
		return v
	}

	[$.arr]( v ) {
		return validate(v, Array.isArray(v))
	}

	[$.bool]( v ) {
		return validate(v, typeof v === BOOL)
	}

	[$.el]( v ) {
		return validate(v, v instanceof HTMLElement)
	}

	[$.fn]( v ) {
		return validate(v, typeof v === FN)
	}

	[$.node]( v ) {
		return validate(v, v instanceof Node)
	}

	[$.num]( v ) {
		return validate(v, typeof v === NUM)
	}

	[$.obj]( v ) {
		return validate(v, typeof v === OBJ)
	}

	[$.str]( v ) {
		return validate(v, typeof v === STR)
	}

	[$.sym]( v ) {
		return validate(v, typeof v === SYM)
	}

	[$.anyOf]( arr, v ) {
		throw new InvalidOption('Feature not implemented')
	}

	[$.notOf]( arr, v ) {
		throw new InvalidOption('Feature not implemented')
	}

	[$.arrOf]( type, v ) {
		throw new InvalidOption('Feature not implemented')
	}

	[$.objOf]( type, v ) {
		throw new InvalidOption('Feature not implemented')
	}

	[$.instOf]( ctor, v ) {
		throw new InvalidOption('Feature not implemented')
	}

	[$.like]( obj, v ) {
		throw new InvalidOption('Feature not implemented')
	}

	[$.custom]( fn, v ) {
		return fn(this[$_type], v)
	}

}

export { OptionValidator, InvalidOption }

