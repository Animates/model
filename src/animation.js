'use strict';

var Canvas = require('./canvas'),
	Timeline = require('./timeline'),
	JsonSerializer = require('./serialization/jsonSerializer'),
	Common = require('animates-common');

/**
 *  Creates a new Animation.
 *  @class Represents an Animation. 
 */
function Animation (options) {
	options = options || {};
	
	var _self = this, // Save the this reference for later use
		observers = {};

	_self.canvas = options.canvas || new Canvas();
	_self.timeline = options.timeline || new Timeline();

	function applyShapeCreateOperation(opParams, context){
		var mediaTimeline = _self.timeline.addMediaObject(opParams.mediaObject);
		if (mediaTimeline) {
			mediaTimeline.setStartTick(opParams.tick);
			return true;
		}

		return false;
	}

	function applyShapeUpdateOperation(opParams, context){
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId);
		if (mediaTimeline) {
			var mediaObject = mediaTimeline.getMediaObject();
			mediaObject.setProperties(opParams.properties);
			return true;
		}

		return false;
	}

	function applyShapeRemoveOperation(opParams, context){
		if (_self.timeline.getMediaTimeline(opParams.mediaObjectId)) {
			_self.timeline.removeMediaObject(opParams.mediaObjectId);
			return true;
		}

		return false;
	}

	function applyEffectCreateOperation(opParams, context){
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId);
		if (mediaTimeline) {
			mediaTimeline.addEffect(opParams.effect);
			return true;
		}

		return false;
	}

	function applyEffectUpdateOperation(opParams, context){
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId);
		if (mediaTimeline) {
			var effect = mediaTimeline.getEffect(opParams.effectId);

			if (effect){
				effect.setOptions(opParams.options);
				return true;
			}

			return false;
		}

		return false;
	}

	function applyEffectRemoveOperation(opParams, context){
		var mediaTimeline = _self.timeline.getMediaTimeline(opParams.mediaObjectId);
		if (mediaTimeline && mediaTimeline.getEffect(opParams.effectId)) {
			mediaTimeline.removeEffect(opParams.effectId);
			
			return true;
		}

		return false;
	}

	function applyShapeOperation(operation, opParams, context){
		switch (operation){
			case 'Create':
				return applyShapeCreateOperation(opParams, context);
			case 'Update':
				return applyShapeUpdateOperation(opParams, context);
			case 'Remove':
				return applyShapeRemoveOperation(opParams, context);
			default:
				return false;
		}
	}

	function applyEffectOperation(operation, opParams, context){
		switch (operation){
			case 'Create':
				return applyEffectCreateOperation(opParams, context);
			case 'Update':
				return applyEffectUpdateOperation(opParams, context);
			case 'Remove':
				return applyEffectRemoveOperation(opParams, context);
			default:
				return false;
		}
	}

	this.applyOperation = function applyOperation(target, operation, opParams, context){
		if (target && operation && opParams) {
			var result = false;
			switch (target){
				case 'Shape':
					result = applyShapeOperation(operation, opParams, context);
					break;
				case 'Effect':
					result = applyEffectOperation(operation, opParams, context);
					break;
				default:
					return;
			}

			if (result){
				for(var observerId in observers) { 
					if (observers.hasOwnProperty(observerId)) {
						observers[observerId](target, operation, opParams, context);
					}
				}
			}
		}
	};

	this.addObserver = function addObserver(observerId, observerFunction) {
		observers[observerId] = observerFunction;
	};

	this.removeObserver = function removeObserver(observerId) {
		if (observers.hasOwnProperty(observerId)){
			delete observers[observerId];
		}
	};

	this.toJSON = function () {
		var ser =	{
						'canvas' : JsonSerializer.serializeObject(_self.canvas),
						'timeline' : JsonSerializer.serializeObject(_self.timeline)
					};

		return ser;
	};

	this.fromJSON = function (json) {
		var canvas = new Canvas(),
			timeline = new Timeline();

		JsonSerializer.deserializeObject(json.canvas);
		JsonSerializer.deserializeObject(json.timeline);

		_self.timeline = timeline;
		_self.canvas = canvas;
	};

	/**
	 *  Constructor
	 */
	(function init() {
	}());
}

JsonSerializer.registerType(Animation);

module.exports = Animation;
