/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var VisualMediaObject = require('./visualMediaObject'),
	PropertyBuilder = require('./properties/propertyBuilder'),
	CompositePropertyBuilder = require('./properties/compositePropertyBuilder'),
	Common = require('animates-common');

/**
 *  Creates a new Photo
 *  @class Represents a Photo.
 */
function Photo (options, builder) {
	var _self = this,propBuilder,
		properties,
		defaultOptions = {
			height : 100,
			width : 100,
			source : '',
			name: 'Photo'
		};

	this.getScalableProperties = function getScalableProperties() {
		return ['height', 'width'];
	};

	this.base_toJSON = this.toJSON;
	this.toJSON = function () {
		var ser = _self.base_toJSON();
		return ser;
	};
	/**
	 *  Constructor
	 */
	(function init() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);


		propBuilder.property('height', PropertyBuilder)
						.value(options.height)
						.type('float')
						.constraint(function (val) { return (val >= 0); })
					.add()
					.property('width', PropertyBuilder)
						.value(options.width)
						.type('float')
						.constraint(function (val) { return (val >= 0); })
					.add()
					.property('source', PropertyBuilder)
						.value(options.source)
						.type('imageFile')
					.add();
		_self.VisualMediaObject(options, propBuilder); // Call base constructor
	}());
}

Common.inherits(Photo, VisualMediaObject, 'VisualMediaObject');

module.exports = Photo;
