'use strict';

var JsonSerializer = require('./serialization/jsonSerializer');

/**
 *  Creates a new Canvas.
 *  @class Represents a Canvas.
 */

function Canvas (options) {
	options = options || {};

	var _self = this; // Save the this reference for later use

	this.height = options.height || 400;
	this.width = options.width || 600;
	this.backgroundColor = options.backgroundColor || '#FFFFFF';
	this.backgroundImage = options.backgroundImage || '';

	/**
	*  Constructor
	*/
	(function preInit() {
	}());

	this.filterDrawables = function filterDrawables(mediaFrames) {
		return mediaFrames; //TODO filter media frames
	};

	this.toJSON = function () {
		var ser =	{
						'height' : _self.height,
						'width' : _self.width,
						'backgroundColor' : _self.backgroundColor,
						'backgroundImage' : _self.backgroundImage
					};

		return ser;
	};

	this.fromJSON = function (json) {
		_self.height = json.height;
		_self.width = json.width;
		_self.backgroundImage = json.backgroundImage;
		_self.backgroundColor = json.backgroundColor;
	};

	/**
	 *  Constructor
	 */
	(function postInit() {
	}());
}

JsonSerializer.registerType(Canvas);

module.exports = Canvas;
