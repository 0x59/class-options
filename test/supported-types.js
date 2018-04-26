
const
	PRIMITIVE_TYPES = [ 'super', 'any', 'arr', 'bool', 'el', 'fn', 'node', 'num', 'obj', 'str', 'sym' ],
	COMPOUND_TYPES = [ 'anyOf', 'notOf', 'arrOf', 'objOf', 'instOf', 'like', 'custom' ],
	SUPPORTED_TYPES = PRIMITIVE_TYPES.concat(COMPOUND_TYPES)

Object.freeze(PRIMITIVE_TYPES)
Object.freeze(COMPOUND_TYPES)
Object.freeze(SUPPORTED_TYPES)

export { PRIMITIVE_TYPES, COMPOUND_TYPES, SUPPORTED_TYPES }

