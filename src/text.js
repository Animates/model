/*global Animates */
/*jslint node: true, todo: true, white: true, plusplus:true */

'use strict';

var VisualMediaObject = require('./visualMediaObject'),
	JsonSerializer = require('./serialization/jsonSerializer'),
	PropertyBuilder = require('./properties/propertyBuilder'),
	CompositePropertyBuilder = require('./properties/compositePropertyBuilder'),
	Common = require('animates-common');

/**
 *  Creates a new Text
 *  @class Represents a Text.
 */
function Text (options, builder) {
	var _self = this,
		propBuilder,
		properties,
		defaultOptions = {
			fontSize : 30,
			fontWeight : 'normal',
			fontFamily : 'Times New Roman',
			fontStyle : 'normal',
			textDecoration : '',
			text : 'text',
			name : 'Text'
		};

	/**
	*  Constructor
	*/
	(function preInit() {
		propBuilder = builder || new CompositePropertyBuilder();
		options = Common.extend(options || {}, defaultOptions);

		propBuilder.property('fontSize', PropertyBuilder)
						.value(options.fontSize)
						.type('integer')
					.add()
					.property('fontWeight', PropertyBuilder)
						.value(options.fontWeight)
						.type('string')
						.strictValues(['normal', 'bold'])
					.add()
					.property('fontFamily', PropertyBuilder)
						.value(options.fontFamily)
						.type('string')
						.strictValues(['Times New Roman', 'Verdana', 'Georgia', 'Arial', 'Courier New'])
					.add()
					.property('fontStyle', PropertyBuilder)
						.value(options.fontStyle)
						.type('string')
						.strictValues(['normal', 'italic', 'oblique'])
					.add()
					.property('textDecoration', PropertyBuilder)
						.value(options.textDecoration)
						.type('string')
						.strictValues(['', 'underline', 'overline', 'line-through'])
					.add()
						.property('text', PropertyBuilder)
						.value(options.text)
						.type('text')
					.add();

		_self.VisualMediaObject(options, propBuilder); // Call base constructor
	}());

	this.getScalableProperties = function getScalableProperties() {
		return ['fontSize'];
	};

	this.visualMediaObject_toJSON = this.toJSON;
	this.toJSON = function () {
		return _self.visualMediaObject_toJSON();
	};

	this.visualMediaObject_fromJSON = this.fromJSON;
	this.fromJSON = function (json) {
		_self.visualMediaObject_fromJSON(json);
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(Text, VisualMediaObject, 'VisualMediaObject');

JsonSerializer.registerType(Text);

module.exports = Text;
