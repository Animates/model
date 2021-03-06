'use strict';

var Common = require('animates-common'),
	CompositeProperty = require('./compositeProperty');


function DictionaryProperty () {
	var _self = this,
		schema,
		base_add;

	/**
	 *  Constructor
	 */
	(function preInit() {
		_self.base();
		base_add = _self.add;
	}());

	this.add = function() {
		throw new Error('Method add cannot be called from outside a builder');
	}; // hide add method

	this.values = function () {
		var values = {},
			names = _self.names(true);

		for (var i = 0; i < names.length; i++) {
			values[names[i]] = _self.get(names[i]);
		}

		return values;
	};

	this.schema = function (newSchema) {
		schema = newSchema;
	};

	this.setValue = function (name, value) {
		var property;

		if (schema) {
			try {
				if (value === undefined && name.indexOf('.') === -1) {
					_self.remove(name);
				} else {
					property = _self.get(name);
					property.value(value);
				}
			} catch (err) {
				// Just try to add it when its property name (not a path)
				if (name.indexOf('.') === -1) {
					var newProp = schema.create().clone();
					newProp.valuesFromJSON(value);
					base_add(name, newProp);
				} else {
					throw err;
				}
			}
		} else {
			throw new Error("Set an schema before trying to set a value for the property '" + name + "'");
		}
	};

	this.valuesFromJSON = function (json) {
		var newProp;
		for (var name in json) {
			newProp = schema.create().clone();
			newProp.valuesFromJSON(json[name]);
			base_add(name, newProp);
		}

		return json;
	};

	/**
	*  Constructor
	*/
	(function postInit() {
	}());
}

Common.inherits(DictionaryProperty, CompositeProperty);

module.exports = DictionaryProperty;
