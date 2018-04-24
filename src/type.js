
import { TypeModifier } from './type-modifier.js'

class _Type {

	get super() {
		return new TypeModifier('super')
	}

	get any() {
		return new TypeModifier('any')
	}

	get arr() {
		return new TypeModifier('arr')
	}

	get bool() {
		return new TypeModifier('bool')
	}

	get el() {
		return new TypeModifier('el')
	}

	get fn() {
		return new TypeModifier('fn')
	}

	get node() {
		return new TypeModifier('node')
	}

	get num() {
		return new TypeModifier('num')
	}

	get obj() {
		return new TypeModifier('obj')
	}

	get str() {
		return new TypeModifier('str')
	}

	get sym() {
		return new TypeModifier('sym')
	}

	anyOf( arr ) {
		return new TypeModifier('anyOf', arr)
	}

	notOf( arr ) {
		return new TypeModifier('notOf', arr)
	}

	arrOf( type ) {
		return new TypeModifier('arrOf', type)
	}

	objOf( type ) {
		return new TypeModifier('objOf', type)
	}

	instOf( ctor ) {
		return new TypeModifier('instOf', ctor)
	}

	like( obj ) {
		return new TypeModifier('like', obj)
	}

	custom( fn ) {
		return new TypeModifier('custom', fn)
	}

}

const Type = new _Type()

export { Type }

