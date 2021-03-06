/*global describe, it */

'use strict';

var JsonSerializer = require('../../src/serialization/jsonSerializer'),
	MediaObject = require('../../src/mediaObject'),
	Shape = require('../../src/shape'),
	Rectangle = require('../../src/shapes/rectangle'),
	FiniteEffect = require('../../src/finiteEffect'),
	MediaTimeline = require('../../src/mediaTimeline'),
	Canvas = require('../../src/canvas'),
	Timeline = require('../../src/timeline'),
	Animation = require('../../src/animation'),
	should = require("should");

describe('Serialization', function () {
	describe('MediaObject', function() {
		it('Should serialize the json object', function() {
			var mediaObject = new MediaObject(),
				json = JsonSerializer.serializeObject(mediaObject);

			json.should.have.property('type', 'MediaObject');
			json.should.have.property('data');
			json.data.should.have.property('properties');
		});

		it('Should deserialize from json object', function() {
			var mediaObject = new MediaObject(),
				json = JsonSerializer.serializeObject(mediaObject),
				mediaObject2 = JsonSerializer.deserializeObject(json),
				properties;


			mediaObject2.getGuid().should.equal(mediaObject.getGuid());
		});
	});

	describe('Shape', function() {
		it('Should serialize the json object', function() {
			var shape = new Shape(),
				json = JsonSerializer.serializeObject(shape);

			json.should.have.property('type', 'Shape');
			json.should.have.property('data');
			json.data.should.have.property('properties');
			json.data.properties.should.have.property('opacity');
			json.data.properties.should.have.property('position');
			json.data.properties.should.have.property('fill');
			json.data.properties.should.have.property('border');
			json.data.properties.should.have.property('angle');
		});

		it('Should deserialize from json object', function() {
			var shape = new Shape(),
				json,
				shape2;

			shape.setProperty('position.x', 777);
			json = JsonSerializer.serializeObject(shape);
			shape2 = JsonSerializer.deserializeObject(json);

			shape2.getGuid().should.equal(shape.getGuid());
			shape2.getProperty('position.x').should.equal(777);
		});
	});

	describe('Rectangle', function() {
		it('Should serialize the json object', function() {
			var rec = new Rectangle(),
				json = JsonSerializer.serializeObject(rec);

			json.should.have.property('type', 'Rectangle');
			json.should.have.property('data');
			json.data.should.have.property('properties');
			json.data.properties.should.have.property('opacity');
			json.data.properties.should.have.property('position');
			json.data.properties.should.have.property('fill');
			json.data.properties.should.have.property('border');
			json.data.properties.should.have.property('angle');
		});

		it('Should deserialize from json object', function() {
			var rectangle = new Rectangle(),
				json,
				rectangle2;

			rectangle.setProperty('position.x', 777);
			rectangle.setProperty('height', 333);
			json = JsonSerializer.serializeObject(rectangle);
			rectangle2 = JsonSerializer.deserializeObject(json);

			rectangle2.getGuid().should.equal(rectangle.getGuid());
			rectangle2.getProperty('position.x').should.equal(777);
			rectangle2.getProperty('height').should.equal(333);
		});
	});

	describe('FiniteEffect', function() {
		it('Should serialize the json object', function() {
			var effect = new FiniteEffect(),
				json = JsonSerializer.serializeObject(effect);

			json.should.have.property('type', 'FiniteEffect');
			json.should.have.property('data');
			json.data.should.have.keys('options', 'guid');
			json.data.options.should.have.keys('startTick', 'endTick');
		});

		it('Should deserialize from json object', function() {
			var effect = new FiniteEffect(),
				json = JsonSerializer.serializeObject(effect),
				effect2 = JsonSerializer.deserializeObject(json);

			effect2.getGuid().should.equal(effect.getGuid());
		});
	});

	describe('MediaTimeline', function() {
		it('Should serialize the json object', function() {
			var mediaObject = new MediaObject(),
				mediaTimeline = new MediaTimeline({'mediaObject' : mediaObject}),
				json = JsonSerializer.serializeObject(mediaTimeline);

			json.should.have.property('type', 'MediaTimeline');
			json.should.have.property('data');
			json.data.should.have.keys('effects', 'mediaObject');
		});

		it('Should deserialize from json object', function() {
			var mediaObject = new MediaObject(),
				effect = new FiniteEffect(),
				mediaTimeline = new MediaTimeline({'mediaObject' : mediaObject}),
				json,
				mediaTimeline2;

			mediaTimeline.addEffect(effect);
			json = JsonSerializer.serializeObject(mediaTimeline);
			mediaTimeline2 = JsonSerializer.deserializeObject(json);

			mediaTimeline2.getMediaObject().getGuid()
				.should.equal(mediaObject.getGuid());
			mediaTimeline2.getEffects().should.have.property(effect.getGuid());
		});
	});

	describe('Canvas', function() {
		it('Should serialize the json object', function() {
			var canvas = new Canvas(),
				json = JsonSerializer.serializeObject(canvas);

			json.should.have.property('type', 'Canvas');
			json.should.have.property('data');
			json.data.should.have.property('height', 400);
			json.data.should.have.property('width', 600);
			json.data.should.have.property('backgroundColor', '#FFFFFF');
			json.data.should.have.property('backgroundImage', '');
		});

		it('Should deserialize from json object', function() {
			var canvas = new Canvas({'height': 500, 'width': 500, 'backgroundColor':'red'}),
				json = JsonSerializer.serializeObject(canvas),
				canvas2 = JsonSerializer.deserializeObject(json);

			canvas2.height.should.equal(canvas.height);
			canvas2.width.should.equal(canvas.width);
			canvas2.backgroundColor.should.equal(canvas.backgroundColor);
			canvas2.backgroundImage.should.equal(canvas.backgroundImage);
		});
	});

	describe('Timeline', function() {
		it('Should serialize the json object', function() {
			var timeline = new Timeline(),
				json;

			timeline.addMediaObject(new Rectangle());
			json = JsonSerializer.serializeObject(timeline);

			json.should.have.property('type', 'Timeline');
			json.should.have.property('data');
			json.data.should.have.property('mediaTimelines');
			json.data.mediaTimelines.should.have.lengthOf(1);
			json.data.mediaTimelines[0].type.should.equal('MediaTimeline');
		});

		it('Should deserialize from json object', function() {
			var timeline = new Timeline(),
				json,
				timeline2;

			timeline.addMediaObject(new Rectangle());
			json = JsonSerializer.serializeObject(timeline);
			timeline2 = JsonSerializer.deserializeObject(json);

			timeline2.getMediaTimelines().should.have.lengthOf(1);
		});
	});

	describe('Animation', function() {
		it('Should serialize the json object', function() {
			var animation = new Animation(),
				rec = new Rectangle(),
				json;

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec , 'tick' : 100});

			json = JsonSerializer.serializeObject(animation);

			json.should.have.property('type', 'Animation');
			json.should.have.property('data');
			json.data.should.have.keys('timeline', 'canvas');
			json.data.timeline.data.mediaTimelines.should.have.lengthOf(1);

		});

		it('Should deserialize from json object', function() {
			var animation = new Animation(),
				rec = new Rectangle(),
				json,
				animation2;

			animation.applyOperation('Shape', 'Create', { 'mediaObject' : rec , 'tick' : 100});

			json = JsonSerializer.serializeObject(animation);
			animation2 = JsonSerializer.deserializeObject(json);
		});
	});

});
