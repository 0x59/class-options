const
	TYPES = require('./types.js')

const
	INFO = 1,
	WARN = 1,
	{ UNDEF, STR, BOOL, NUM, FN, OBJ, SYM } = TYPES,
	DEFAULT_DELIMITER = ' '

class Option {
	static makeDefaultDescriptor() {
		return {
			merge: false,
			type: STR,
			dflt: ''
		}
	}
	
	constructor( descriptor = {}, name = 'unknown' ) {
		this._name = name
		this._validateDescriptor(descriptor)
		this._validateValue()
	}

	_validateDescriptor( descriptor ) {
		if( typeof descriptor !== OBJ ) {
			throw new Error(`[${this._name}] option descriptor not an object`)
		}

		this._descriptor = Object.assign(Option.makeDefaultDescriptor(), descriptor)

		let { merge, delimiter, type, validator, values } = this._descriptor

		if( type !== void 0 ) {
			if( typeof type === STR ) {
				if( !Object.values(TYPES).includes(type) ) {
					throw new Error(`[${this._name}] option descriptor type string must be valid against the typeof operator`)
				}
			
			} else if( typeof type !== FN ) {
				throw new Error(`[${this._name}] option descriptor type is not a string or function`)
			}
		}

		if( merge !== void 0 && typeof merge !== BOOL ) {
			throw new Error(`[${this._name}] option descriptor merge is not boolean`)
		}

		if( merge ) {
			if( delimiter !== void 0 && typeof delimiter !== STR ) {
				throw new Error(`[${this._name}] option descriptor delimiter not a string`)
			}

			if( delimiter === void 0 && type === STR ) {
				this._descriptor.delimiter = DEFAULT_DELIMITER
			}

		} else if( delimiter !== void 0 ) {
			this._descriptor.delimiter = void 0
			WARN && console.warn(`[${this._name}] option descriptor delimiter ignored when not merging`)
		}

		if( values !== void 0 ) {
			if( typeof values !== OBJ && !Array.isArray(values) ) {
				throw new Error(`[${this._name}] option descriptor possible values must be specified as an array or object`)
			}
		}

		if( validator !== void 0 ) {
			if( typeof validator !== FN ) {
				throw new Error(`[${this._name}] option descriptor custom validator must be callable`)
			}
		}
	}

	_validateValue( v ) {
		let argValue = !!arguments.length,
			hasValue = this._descriptor.hasOwnProperty('value'),
			hasDefault = this._descriptor.hasOwnProperty('dflt'),
			{ type, dflt, validator, merge, value, values } = this._descriptor
		
		if( argValue ) {
			value = v
		
		} else if( hasValue ) {
			if( Object.keys(this._descriptor).length === 1 ) {
				return
			}

		} else if( hasDefault ) {
			this._descriptor.value = value = dflt

		} else {
			throw new Error(`[${this._name}] option descriptor definition must include a value or a default value`)
		}

		if( type !== void 0 ) {
			if( typeof type === STR ) {
				if( typeof value !== type ) {
					throw new Error(`[${this._name}] option value not of type: ${type}`)
				}
			
			} else if( typeof type === FN ) {
				if( !(value instanceof type) && value !== dflt ) {
					throw new Error(`[${this._name}] option value not an instance of: ${type.name}`)
				}

			} else {
				WARN && console.warn(`[${this._name}] option type checking skipped due to unsupported type validation`)
			}
		}

		// todo: plain object checking
		if( merge ) {
			if( type !== STR && type !== OBJ && !Array.isArray(value) ) {
				throw new Error(`[${this._name}] option merging can only be performed on arrays, strings, and plain objects`)
			}
		}

		if( values ) {
			if( Array.isArray(values) ) {
				if( !values.includes(value) ) {
					INFO && console.dir(value)
					throw new Error(`[${this._name}] value not in possible valid values`)
				}

			} else if( typeof values === OBJ ) {
				if( !Object.values(values).includes(value) ) {
					INFO && console.dir(value)
					throw new Error(`[${this._name}] value not in possible valid values`)
				}
				
			} else {
				WARN && console.warn(`[${this._name}] values type checking skipped due to unsupported validation`)
			}
		}

		if( validator && !validator(value) ) {
			throw new Error(`[${this._name}] value failed custom validation`)
		}
	}

	// todo: deep merge, plain object checking
	_mergeValue( v ) {
		if( typeof v === STR ) {
			this._descriptor.value += this._descriptor.value ? this._descriptor.delimiter + v : v

		} else if( Array.isArray(v) ) {
			this._descriptor.value = this._descriptor.value.concat(v)
		
		} else if( typeof v === OBJ ) {
			Object.assign(this._descriptor.value, v)
		}
	}

	_shiftValues() {
		let	{ type, value } = this._descriptor

		if( type === STR ) {
			this._descriptor.value = ''

		} else if( Array.isArray(value) ) {
			this._descriptor.value = []
		
		} else if( type === OBJ ) {
			this._descriptor.value = {}
		
		} else {
			throw new Error(`Unsupported merge type encountered while shifting values for option [${this._name}]`)
		}

		return value
	}

	value( v ) {
		if( !arguments.length ) {
			return this._descriptor.value
		}
		
		this._validateValue(v)

		if( this._descriptor.merge ) {
			this._mergeValue(v)

		} else {
			this._descriptor.value = v
		}
	}

	values( arr , shift = false ) {
		let shiftValues

		if( !Array.isArray(arr) ) {
			WARN && console.warn(`[${this._name}] option values must be specified in an array: treated as single value`)
			this.value(arr)
			return
		}

		if( this._descriptor.merge ) {
			if( shift ) {
				shiftValues = this._shiftValues()
			}

			for( let v of arr ) {
				this.value(v)
			}
			
			if( shift && shiftValues ) {
				this.value(shiftValues)
			}
		
		} else {
			if( arr.length > 1 ) {
				WARN && console.warn(`[${this._name}] option descriptor ignored pending options while not merging`)
			}
			this.value(arr[0])
		}
	}
}

module.exports = Option
