
const
	PRIMITIVE_TYPES = new Map([
		[ 'super', {} ],
		[ 'any', { valid: 8 } ],
		[ 'arr', { valid: [], invalid: {} } ],
		[ 'bool', { valid: true, invalid: 1 } ],
		[ 'el', { valid: document.createElement('div'), invalid: document.createTextNode('') } ],
		[ 'fn', { valid: () => {}, invalid: {} } ],
		[ 'node', { valid: document.createTextNode(''), invalid: {} } ],
		[ 'num', { valid: 1, invalid: '1' } ],
		[ 'obj', { valid: {}, invalid: 8 } ],
		[ 'str', { valid: 'string', invalid: 8 } ],
		[ 'sym', { valid: Symbol('sym'), invalid: {} } ]
	]),
	COMPOUND_TYPES = new Map([
		[ 'anyOf', {} ],
		[ 'notOf', {} ],
		[ 'arrOf', {} ],
		[ 'objOf', {} ],
		[ 'instOf', {} ],
		[ 'like', {} ],
		[ 'custom', {} ]
	]),
	SUPPORTED_TYPES = new Map(function*() {
		yield* PRIMITIVE_TYPES
		yield* COMPOUND_TYPES
	}())

export { PRIMITIVE_TYPES, COMPOUND_TYPES, SUPPORTED_TYPES }

