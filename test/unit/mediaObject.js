/*global describe, it */

'use strict';

var MediaObject = require('../../src/mediaObject'),
	should = require("should");

describe('MediaObject', function(){
	describe('constructor', function(){
		it('Should generate a random guid.', function(){
			var mediaObject = new MediaObject(),
				mediaObject2 = new MediaObject();

			mediaObject.getGuid().should.have.type('string');
			mediaObject.getGuid().should.not.be.equal(mediaObject2.getGuid());
		});
	});

	describe('getProperties()', function(){
		it('Should return an empty object is no option is passed as parameter.', function(){
			var instance = new MediaObject(),
				properties = instance.getProperties();

			properties.should.be.empty;
		});

		it('Should return the same property that is passed by parameter.', function(){
			var specifiedPropertyValue = 'value1',
				instance = new MediaObject({propertyName: specifiedPropertyValue}),
				properties = instance.getProperties();

			properties.should.have.property('propertyName', specifiedPropertyValue);
		});
	});

	describe('getProperty()', function(){
		it('Should return undefined if property does not exits.', function(){
			var instance = new MediaObject(),
				propertyValue = instance.getProperty('invalidProperty');

			should.equal(propertyValue, undefined);
		});

		it('Should return undefined if property is empty.', function(){
			var instance = new MediaObject(),
				propertyValue = instance.getProperty('');

			should.equal(propertyValue, undefined);
		});

		it('Should return undefined if parent property is empty.', function(){
			var instance = new MediaObject(),
				propertyValue = instance.getProperty('parentPropertyName.innerPropertyName');

			should.equal(propertyValue, undefined);
		});

		it('Should return undefined if inner property is empty.', function(){
			var instance = new MediaObject({
					parentPropertyName: { }
				}),
				propertyValue = instance.getProperty('parentPropertyName.innerPropertyName');

			should.equal(propertyValue, undefined);
		});

		it('Should return undefined if property is not passed by argument.', function(){
			var instance = new MediaObject(),
				propertyValue = instance.getProperty();

			should.equal(propertyValue, undefined);
		});

		it('Should return the property if it exits.', function(){
			var specifiedPropertyValue = 'value1',
				instance = new MediaObject({propertyName: specifiedPropertyValue}),
				propertyValue = instance.getProperty('propertyName');

			propertyValue.should.eql(specifiedPropertyValue);
		});

		it('Should return the inner property if it exits.', function(){
			var specifiedPropertyValue = 'value',
				instance = new MediaObject({
					parentPropertyName: {
						innerPropertyName : specifiedPropertyValue
					}
				}),
				propertyValue = instance.getProperty('parentPropertyName.innerPropertyName');

			propertyValue.should.eql(specifiedPropertyValue);
		});
	});

	describe('setProperty()', function(){
		it('Should create a new property if the property does not exits.', function(){
			var specifiedPropertyValue = 'value1',
				instance = new MediaObject(),
				properties = instance.getProperties();

			properties.should.not.have.property('propertyName');

			instance.setProperty('propertyName', specifiedPropertyValue);

			properties = instance.getProperties();

			properties.should.have.property('propertyName', specifiedPropertyValue);
		});

		it('Should update a property if it already exits.', function(){
			var originalPropertyValue = 'oldValue',
				newPropertyValue = 'newValue',
				instance = new MediaObject({propertyName: originalPropertyValue}),
				properties = instance.getProperties();

			properties.should.have.property('propertyName', originalPropertyValue);

			instance.setProperty('propertyName', newPropertyValue);

			properties = instance.getProperties();

			properties.should.have.property('propertyName', newPropertyValue);
		});

		it('Should create a new full property path if the property does not exits at all.', function(){
			var specifiedPropertyValue = 'value1',
				instance = new MediaObject(),
				properties = instance.getProperties();

			properties.should.not.have.property('parentPropertyName');

			instance.setProperty('parentPropertyName.innerPropertyName', specifiedPropertyValue);

			properties = instance.getProperties();

			properties.should.have.property('parentPropertyName');

			properties.parentPropertyName.should.have.property('innerPropertyName', specifiedPropertyValue);
		});

		it('Should create a new full property path if the inner property does not exits.', function(){
			var specifiedPropertyValue = 'value1',
				instance = new MediaObject({
					parentPropertyName: {}
				}),
				properties = instance.getProperties();


			properties.should.have.property('parentPropertyName');
			properties.parentPropertyName.should.not.have.property('innerPropertyName');

			instance.setProperty('parentPropertyName.innerPropertyName', specifiedPropertyValue);

			properties = instance.getProperties();

			properties.parentPropertyName.should.have.property('innerPropertyName', specifiedPropertyValue);
		});

		it('Should update a inner property if it already exits.', function(){
			var originalPropertyValue = 'oldValue',
				newPropertyValue = 'newValue',
				instance = new MediaObject({
					parentPropertyName: {
						innerPropertyName : originalPropertyValue
					}
				}),
				properties = instance.getProperties();


			properties.should.have.property('parentPropertyName');
			properties.parentPropertyName.should.have.property('innerPropertyName');

			instance.setProperty('parentPropertyName.innerPropertyName', newPropertyValue);

			properties = instance.getProperties();

			properties.parentPropertyName.should.have.property('innerPropertyName', newPropertyValue);
		});
	});

	describe('Serialization', function() {
		it('toJSON should return json', function() { 
			var mediaObject = new MediaObject(),
				json = mediaObject.toJSON();

			json.should.have.property('properties');
		});

		it('fromJSON should load the object', function() { 
			var mediaObject = new MediaObject({'prop' : 'value'}),
				json = mediaObject.toJSON(),
				mediaObject2 = new MediaObject();

			mediaObject2.fromJSON(json);
			mediaObject2.getGuid().should.equal(mediaObject.getGuid());
			mediaObject2.getProperties().should.have.property('prop', 'value');
		});
	});	
});