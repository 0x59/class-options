
import { Options } from './options.js'

const Types = types => ( ctorOptions, inlineOptions = null, baseInstance = null ) => {
	let options = ctorOptions instanceof Options ? ctorOptions : new Options()

	if( types ) {
		options.addTypes(types)
	}

	if( inlineOptions ) {
		options.addOptions(inlineOptions)
	}

	if( ctorOptions && (ctorOptions !== options) ) {
		options.addOptions(ctorOptions)
	}

	if( baseInstance ) {
		options.attachTo(baseInstance)
	}

	return options
}

export { Types }

