'use strict';

var Common = require('animates-common'),
	PropertyBuilder = require('./properties/propertyBuilder'),
	CompositePropertyBuilder = require('./properties/compositePropertyBuilder'),
	JsonSerializer = require('./serialization/jsonSerializer'),
	Effect = require('./effect');

/**
 *  Creates a new FiniteEffect.
 *  @class Represents an FiniteEffect .
 */
function FiniteEffect (options, builder) {

	options = options || {};

	var _self = this,
		propBuilder,
		defaultOptions = {
			startTick : 0,
			endTick : 100
		},
		currentOptions = {};

	/**
	 *  Constructor
	 */
	(function preInit() {
		currentOptions = Common.extend(options, defaultOptions);
		if (currentOptions.endTick !== -1 && currentOptions.endTick <= currentOptions.startTick) {
			currentOptions.endTick = currentOptions.startTick + defaultOptions.endTick;
		}

		propBuilder = builder || new CompositePropertyBuilder();
		propBuilder.property('endTick', PropertyBuilder)
						.value(currentOptions.endTick)
						.type('float')
						.constraint(function (val) { return (val === -1) || !_self.getOption || (val > _self.getOption('startTick')); })
					.add()
					.property('startTick', PropertyBuilder)
						.value(currentOptions.startTick)
						.type('float')
						.constraint(function (val) { return (val >= 0) && (!_self.getOption || (val < _self.getOption('endTick'))); })
					.add();

		_self.Effect(currentOptions, propBuilder);
	}());

	this.isInfinite = function() {
		return false;
	};


	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(FiniteEffect, Effect, 'Effect');

JsonSerializer.registerType(FiniteEffect);

module.exports = FiniteEffect;
