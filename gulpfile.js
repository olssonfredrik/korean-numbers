const isDebug = false;
const rfbuild = require('@rocketfuel-toolchain/build')(
	[
		'./node_modules/@rocketfuel/core/',
		'./'
	],
	'Source/EntryPoint.ts',
	isDebug );

exports.build = rfbuild.build;
exports.clean = rfbuild.clean;

exports.default = rfbuild.build;
