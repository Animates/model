'use strict';

var Common = require('animates-common'),
	JsonSerializer = require('../serialization/jsonSerializer'),
	PropertyBuilder = require('../properties/propertyBuilder'),
	DictionaryPropertyBuilder = require('../properties/dictionaryPropertyBuilder'),
	CompositePropertyBuilder = require('../properties/compositePropertyBuilder'),
	straightPathStrategy = require('./pathStrategies/straightPathStrategy'),
	segmentHelper = require('./pathStrategies/utils/segmentHelper'),
	MultiPointEffect = require('../multiPointEffect.js');


/**
 *  Creates a new MultiPointRotateEffect.
 *  @class Represents an MultiPointRotateEffect .
 */
function MultiPointRotateEffect(options, builder) {
	var _self = this,
		propBuilder,
		defaultOptions = {
			'points' : {}
		},
		currentOptions;

	/**
	 *  Constructor
	 */
	(function init() {
		var pointsSchemaBuilder;

		propBuilder = builder || new CompositePropertyBuilder();

		currentOptions = Common.extend(options || {}, defaultOptions);

		// Build points schema
		pointsSchemaBuilder = new CompositePropertyBuilder();

		pointsSchemaBuilder
			.property('angle', PropertyBuilder)
				.type('float')
			.add()
			.property('motion', PropertyBuilder)
				.type('string')
				.value('clockwise')
				.constraint(function (val) { return ['clockwise', 'counter-clockwise'].indexOf(val) >= 0;	})
			.add();

		_self.MultiPointEffect(currentOptions, propBuilder, pointsSchemaBuilder);
	}());

	function getAngleFor(currentTick, startPoint, endPoint, clockwise) {
		var m = (endPoint.angle - startPoint.angle) / (endPoint.tick - startPoint.tick);
		return startPoint.angle + (m * currentTick);
	}

	/**
	 * Calculates the new shape properties based on the original ones and the current frame.
	 * @param {integer} tick The current tick number.
	 * @param {object} mediaFrameProperties The original media frame properties.
	 */
	this.getProperties = function (tick, mediaFrameProperties) {
		var points = _self.getPointsArray(),		
			segment = segmentHelper.getSegment(tick, points);

		if (segment && segment.startPoint) {
			if (!segment.endPoint) {
				mediaFrameProperties.angle = segment.startPoint.angle;
			} else {
				mediaFrameProperties.angle = getAngleFor(tick, segment.startPoint, segment.endPoint, true);
			}
		} else if (points.length === 1 && tick >= points[0].tick) {
			mediaFrameProperties.angle = points[0].angle;
		}

		return mediaFrameProperties;
	};

	this.getAffectedProperties = function () {
		return ['angle', 'motion'];
	};

	function addPoint(guid, tick, angle, motion) {
		var data = { 'angle' : angle || 0, 'motion' : motion || 'clockwise'};
		_self.addPoint(guid, tick, data);
	}

	this.updateProperties = function (tick, updatedProperties) {
		var angle = updatedProperties.angle,
			motion = updatedProperties.motion,
			changedProperties = [],
			points;

		if (angle === undefined  && motion === undefined) {
			return { 'updatedProperties' : changedProperties };
		}

		// If a point was added from outside
		var newPoint = updatedProperties['MultiPointRotateEffect.newPoint'];
		if(newPoint && newPoint.target === _self.getGuid()) {
			addPoint(newPoint.guid, tick, angle, motion);
			return	{
						'updatedProperties' : ['angle', 'motion']
					};
		}

		points = _self.getOption('points');

		// There is a point at the updated tick
		for (var guid in points) {
			if (points[guid].tick == tick) {
				if (angle) {
					_self.setOption('points.' + guid + '.angle', angle);
					changedProperties.push('angle');	
				}

				if (motion) {
					_self.setOption('points.' + guid + '.motion', motion);
					changedProperties.push('motion');	
				}

				return { 'updatedProperties' : changedProperties };
			}
		}

		// A new point must be added
		var newPointGuid = Common.createGuid();
		addPoint(newPointGuid, tick, angle, motion);
			return	{
						'updatedProperties' : ['angle', 'motion'],
						'newProperties' : {
							'MultiPointRotateEffect.newPoint' : { 'guid' : newPointGuid, 'target' : _self.getGuid()}
						}
					};
	};
}

Common.inherits(MultiPointRotateEffect, MultiPointEffect, 'MultiPointEffect');

JsonSerializer.registerType(MultiPointRotateEffect);

module.exports = MultiPointRotateEffect;
