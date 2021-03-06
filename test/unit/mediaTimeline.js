/*global describe, it */

'use strict';

var MediaTimeline = require('../../src/mediaTimeline'),
	should = require("should");

describe('MediaTimeline', function() {
	describe('*effectsCollections', function() {
		it('Should not contain any effect when created.', function() {
			var mediaTimeline = new MediaTimeline(),
				effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should add a new effect.', function() {
			var mediaTimeline = new MediaTimeline(),
				effects,
				effectId = 'myId',
				effect = { property: "value" , 'getGuid' : function () { return effectId; } };

			mediaTimeline.addEffect(effect);
			effects = mediaTimeline.getEffects();

			effects.should.not.be.empty;
			effects.should.have.property(effectId);
		});

		it('Should not add a new invalid effect.', function() {
			var mediaTimeline = new MediaTimeline(),
				effects,
				effect;

			mediaTimeline.addEffect(effect);
			effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should remove an effect.', function() {
			var mediaTimeline = new MediaTimeline(),
				effects,
				effectId = 'myId',
				effect = { 'property': "value" , 'getGuid' : function () { return effectId; } };

			mediaTimeline.addEffect(effect);
			mediaTimeline.removeEffect(effectId);
			effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should not fail to remove a not existing effect.', function() {
			var mediaTimeline = new MediaTimeline(),
				effects,
				effectId = 'myId';

			mediaTimeline.removeEffect(effectId);
			effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});

		it('Should not fail a call to remove with no parameter.', function() {
			var mediaTimeline = new MediaTimeline(),
				effects;

			mediaTimeline.removeEffect();
			effects = mediaTimeline.getEffects();

			effects.should.be.empty;
		});
	});

	describe('getMediaObjectId()', function() {
		it('Should return the media object id', function() {
			var specifiedMediaObjectId = '42',
				specifiedMediaObject = { 'getGuid' : function () { return specifiedMediaObjectId; } },
				mediaTimeline = new MediaTimeline( { 'mediaObject' : specifiedMediaObject } ),
				mediaObjectId = mediaTimeline.getMediaObjectId();

			mediaObjectId.should.be.exactly(specifiedMediaObjectId);
		});
	});

	describe('getMediaObjectName()', function() {
		it('Should return the media object id', function() {
			var specifiedMediaObjectName = '42',
				specifiedMediaObject = {
					'getProperty' : function (propertyName) {
							propertyName.should.be.exactly('name');
							return specifiedMediaObjectName;
						}
					},
				mediaTimeline = new MediaTimeline( { 'mediaObject' : specifiedMediaObject } ),
				mediaObjectId = mediaTimeline.getMediaObjectName();

			mediaObjectId.should.be.exactly(specifiedMediaObjectName);
		});
	});

	describe('getEffectsForTick', function () {
		it('Should not return any effect', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				startTick = null;

			startTick = mediaTimeline.getEffectsForTick(50);
			startTick.should.be.empty;
		});

		it('Should return only one effect', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				effect = {
							'getOption' : function (name) {
								var op = { 'startTick': 20,'endTick' : 100 };
								return op[name];
							},
							'getGuid' : function () { return 'id'; },
							isInfinite : function() {
								return false;
							}
						},
				foundEffect = null;

			foundEffect = mediaTimeline.getEffectsForTick(10);
			foundEffect.should.have.lengthOf(0);

			mediaTimeline.addEffect(effect);

			foundEffect = mediaTimeline.getEffectsForTick(50);
			foundEffect.should.have.lengthOf(1);

			foundEffect = mediaTimeline.getEffectsForTick(110);
			foundEffect.should.have.lengthOf(0);
		});

		it('Should return only one effect with end tick equals to tick.', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				effect = {
							'getOption' : function (name) {
								var op = { 'startTick': 20,'endTick' : currentTick };
								return op[name];
							},
							'getGuid' : function () { return 'id'; },
							isInfinite : function() {
								return false;
							}
						},
				foundEffect = null;

			foundEffect = mediaTimeline.getEffectsForTick(10);
			foundEffect.should.have.lengthOf(0);

			mediaTimeline.addEffect(effect);

			foundEffect = mediaTimeline.getEffectsForTick(currentTick);
			foundEffect.should.have.lengthOf(1);

			foundEffect = mediaTimeline.getEffectsForTick(110);
			foundEffect.should.have.lengthOf(0);
		});

		it('Should return only one effect with start tick equals to tick.', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				effect = {
							'getOption' : function (name) {
								var op = { 'startTick': currentTick,'endTick' : 100 };
								return op[name];
							},
							'getGuid' : function () { return 'id'; },
							isInfinite : function() {
								return false;
							}
						},
				foundEffect = null;

			foundEffect = mediaTimeline.getEffectsForTick(10);
			foundEffect.should.have.lengthOf(0);

			mediaTimeline.addEffect(effect);

			foundEffect = mediaTimeline.getEffectsForTick(currentTick);
			foundEffect.should.have.lengthOf(1);

			foundEffect = mediaTimeline.getEffectsForTick(110);
			foundEffect.should.have.lengthOf(0);
		});

		it('Should return only return multiple effects', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				effect = {
							'getOption' : function (name) {
								var op = { 'startTick': 20,'endTick' : 100 };
								return op[name];
							},
							'getGuid' : function () { return 'id'; },
							isInfinite : function() {
								return false;
							}
						},
				effect2 = {
							'getOption' : function (name) {
								var op = { 'startTick': 10,'endTick' : 70 };
								return op[name];
							},
							'getGuid' : function () { return 'id2'; },
							isInfinite : function() {
								return false;
							}
						},
				foundEffect = null;


			mediaTimeline.addEffect(effect);
			mediaTimeline.addEffect(effect2);

			foundEffect = mediaTimeline.getEffectsForTick(5);
			foundEffect.should.have.lengthOf(0);

			foundEffect = mediaTimeline.getEffectsForTick(15);
			foundEffect.should.have.lengthOf(1);
			should(foundEffect[0].getGuid()).be.equal('id2');

			foundEffect = mediaTimeline.getEffectsForTick(25);
			foundEffect.should.have.lengthOf(2);

			foundEffect = mediaTimeline.getEffectsForTick(75);
			foundEffect.should.have.lengthOf(1);
			should(foundEffect[0].getGuid()).be.equal('id');
		});
	});

	describe('getEffectsForTickThatMatch', function () {
		it('Should not return any effect', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				effectAffectedProperties = ['position','angle'],
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				startTick = null;

			startTick = mediaTimeline.getEffectsForTickThatMatch(50, effectAffectedProperties);
			startTick.should.be.empty;
		});

		it('Should not return any effect (because non match)', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				effect = {
							'getOption' : function (name) {
								var op = { 'startTick': 20,'endTick' : 100 };
								return op[name];
							},
							'HasConflictWithListOfProperties' : function (effectAffectedProperties, strict) {
								return false;
							},
							'getGuid' : function () { return 'id'; },
							isInfinite : function() {
								return false;
							}
						},
				effectAffectedProperties = ['position','angle'],
				foundEffect = null;

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(10, effectAffectedProperties);
			foundEffect.should.have.lengthOf(0);

			mediaTimeline.addEffect(effect);

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(50, effectAffectedProperties);
			foundEffect.should.have.lengthOf(0);

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(110, effectAffectedProperties);
			foundEffect.should.have.lengthOf(0);
		});

		it('Should return only one effect', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				effect = {
							'getOption' : function (name) {
								var op = { 'startTick': 20,'endTick' : 100 };
								return op[name];
							},
							'HasConflictWithListOfProperties' : function (effectAffectedProperties, strict) {
								return true;
							},
							'getGuid' : function () { return 'id'; },
							isInfinite : function() {
								return false;
							}
						},
				effectAffectedProperties = ['position','angle'],
				foundEffect = null;

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(10, effectAffectedProperties);
			foundEffect.should.have.lengthOf(0);

			mediaTimeline.addEffect(effect);

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(50, effectAffectedProperties);
			foundEffect.should.have.lengthOf(1);

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(110, effectAffectedProperties);
			foundEffect.should.have.lengthOf(0);
		});

		it('Should return only one effect with end tick equals to tick.', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				effect = {
							'getOption' : function (name) {
								var op = { 'startTick': 20,'endTick' : currentTick };
								return op[name];
							},
							'HasConflictWithListOfProperties' : function (effectAffectedProperties, strict) {
								return true;
							},
							'getGuid' : function () { return 'id'; },
							isInfinite : function() {
								return false;
							}
						},
				effectAffectedProperties = ['position','angle'],
				foundEffect = null;

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(10, effectAffectedProperties);
			foundEffect.should.have.lengthOf(0);

			mediaTimeline.addEffect(effect);

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(currentTick, effectAffectedProperties);
			foundEffect.should.have.lengthOf(1);

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(110, effectAffectedProperties);
			foundEffect.should.have.lengthOf(0);
		});

		it('Should return only one effect with start tick equals to tick.', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				effect = {
							'getOption' : function (name) {
								var op = { 'startTick': currentTick,'endTick' : 100 };
								return op[name];
							},
							'HasConflictWithListOfProperties' : function (effectAffectedProperties, strict) {
								return true;
							},
							'getGuid' : function () { return 'id'; },
							isInfinite : function() {
								return false;
							}
						},
				effectAffectedProperties = ['position','angle'],
				foundEffect = null;

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(10, effectAffectedProperties);
			foundEffect.should.have.lengthOf(0);

			mediaTimeline.addEffect(effect);

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(currentTick, effectAffectedProperties);
			foundEffect.should.have.lengthOf(1);

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(110, effectAffectedProperties);
			foundEffect.should.have.lengthOf(0);
		});

		it('Should return multiple effects', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				effect = {
							'getOption' : function (name) {
								var op = { 'startTick': 20,'endTick' : 100 };
								return op[name];
							},
							'HasConflictWithListOfProperties' : function (effectAffectedProperties, strict) {
								return true;
							},
							'getGuid' : function () { return 'id'; },
							isInfinite : function() {
								return false;
							}
						},
				effect2 = {
							'getOption' : function (name) {
								var op = { 'startTick': 10,'endTick' : 70 };
								return op[name];
							},
							'HasConflictWithListOfProperties' : function (effectAffectedProperties, strict) {
								return true;
							},
							'getGuid' : function () { return 'id2'; },
							isInfinite : function() {
								return false;
							}
						},
				effectAffectedProperties = ['position','angle'],
				foundEffect = null;


			mediaTimeline.addEffect(effect);
			mediaTimeline.addEffect(effect2);
			foundEffect = mediaTimeline.getEffectsForTickThatMatch(5, effectAffectedProperties);
			foundEffect.should.have.lengthOf(0);

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(15, effectAffectedProperties);
			foundEffect.should.have.lengthOf(1);
			should(foundEffect[0].getGuid()).be.equal('id2');

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(25, effectAffectedProperties);
			foundEffect.should.have.lengthOf(2);

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(75, effectAffectedProperties);
			foundEffect.should.have.lengthOf(1);
			should(foundEffect[0].getGuid()).be.equal('id');
		});

		it('Should return only one effects (when there are more than one in the same tick)', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				effect = {
							'getOption' : function (name) {
								var op = { 'startTick': 20,'endTick' : 100 };
								return op[name];
							},
							'HasConflictWithListOfProperties' : function (effectAffectedProperties, strict) {
								return false;
							},
							'getGuid' : function () { return 'id'; },
							isInfinite : function() {
								return false;
							}
						},
				effect2 = {
							'getOption' : function (name) {
								var op = { 'startTick': 10,'endTick' : 70 };
								return op[name];
							},
							'HasConflictWithListOfProperties' : function (effectAffectedProperties, strict) {
								return true;
							},
							'getGuid' : function () { return 'id2'; },
							isInfinite : function() {
								return false;
							}
						},
				effectAffectedProperties = ['position','angle'],
				foundEffect = null;


			mediaTimeline.addEffect(effect);
			mediaTimeline.addEffect(effect2);
			foundEffect = mediaTimeline.getEffectsForTickThatMatch(5, effectAffectedProperties);
			foundEffect.should.have.lengthOf(0);

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(15, effectAffectedProperties);
			foundEffect.should.have.lengthOf(1);
			should(foundEffect[0].getGuid()).be.equal('id2');

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(25, effectAffectedProperties);
			foundEffect.should.have.lengthOf(1);
			should(foundEffect[0].getGuid()).be.equal('id2');

			foundEffect = mediaTimeline.getEffectsForTickThatMatch(75, effectAffectedProperties);
			foundEffect.should.have.lengthOf(0);
		});
	});

	describe('getStartTickFor', function() {
		it('Should return start tick 0 when there are no other effects in the timeline', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				newEffect = {
					'HasConflictWithProperties' : function (effect) { return false; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				startTick = null;

			startTick = mediaTimeline.getStartTickFor(newEffect, 100);
			startTick.should.equal(0);
		});

		it('Should return the endTick of the only one existant effect (which has conflict)', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				alreadyExistantEffect = {
					'getOption' : function (name) {
								var op = { 'startTick' : 0, 'endTick' : 50 };
								return op[name];
							},
					'HasConflictWithProperties' : function (effect) { return true; },
					'getGuid' : function () { return 1; },
					isInfinite : function() {
						return false;
					}
				},
				newEffect = { },
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				startTick = null;

			mediaTimeline.addEffect(alreadyExistantEffect);

			startTick = mediaTimeline.getStartTickFor(newEffect, 100);
			startTick.should.equal(50);
		});

		it('Should return the endTick of the only one conflicted effect', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				alreadyExistantEffect = {
					'getOption' : function (name) {
								var op = { 'startTick' : 0, 'endTick' : 50 };
								return op[name];
							},
					'HasConflictWithProperties' : function (effect) { return true; },
					'getGuid' : function () { return 1; },
					isInfinite : function() {
						return false;
					}
				},
				alreadyExistantEffect2 = {
					'getOption' : function (name) {
								var op = { 'startTick' : 0, 'endTick' : 70 };
								return op[name];
							},
					'HasConflictWithProperties' : function (effect) { return false; },
					'getGuid' : function () { return 2; },
					isInfinite : function() {
						return false;
					}
				},
				newEffect = {},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				startTick = null;

			mediaTimeline.addEffect(alreadyExistantEffect);
			mediaTimeline.addEffect(alreadyExistantEffect2);

			startTick = mediaTimeline.getStartTickFor(newEffect, 100);
			startTick.should.equal(50);
		});

		it('Should return the higher endTickof the two conflicted effects', function () {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				alreadyExistantEffect = {
					'getOption' : function (name) {
								var op = { 'startTick' : 0, 'endTick' : 50 };
								return op[name];
							},
					'HasConflictWithProperties' : function (effect) { return true; },
					'getGuid' : function () { return 1; },
					isInfinite : function() {
						return false;
					}
				},
				alreadyExistantEffect2 = {
					'getOption' : function (name) {
								var op = { 'startTick' : 0, 'endTick' : 70 };
								return op[name];
							},
					'HasConflictWithProperties' : function (effect) { return true; },
					'getGuid' : function () { return 2; },
					isInfinite : function() {
						return false;
					}
				},
				newEffect = {},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				startTick = null;

			mediaTimeline.addEffect(alreadyExistantEffect);
			mediaTimeline.addEffect(alreadyExistantEffect2);

			startTick = mediaTimeline.getStartTickFor(newEffect, 100);
			startTick.should.equal(70);
		});
	});

	describe('getMediaFrameFor()', function() {
		it('Should return a new mediaFrame when no effects are present.', function() {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 0);
		});

		it('Should return a new mediaFrame when effects are present but start before the current frame.', function() {
			var currentTick = 1,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartTick = 2,
				effectEndTick = 5,
				effectId = 'myId',
				getPropertiesFunction = function (tick, mediaFrameProperties) {
					mediaFrameProperties.x += (tick - 1);
					return mediaFrameProperties;
				},
				effect = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick, 'endTick' : effectEndTick };
								return op[name];
							},
					'getGuid' : function () { return effectId; },
					'getProperties' : getPropertiesFunction,
					'isInfinite' : function() {
								return false;
							}
				};


			mediaTimeline.addEffect(effect);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 0);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as an effects specified.', function() {
			var currentTick = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartTick = 2,
				effectEndTick = 5,
				effectId = 'myId',
				getPropertiesFunction = function (tick, mediaFrameProperties) {
					mediaFrameProperties.x += (tick - 1);
					return mediaFrameProperties;
				},
				effect = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick, 'endTick' : effectEndTick };
								return op[name];
							},
					'getGuid' : function () { return effectId; },
					'getProperties' : getPropertiesFunction,
					isInfinite : function() {
						return false;
					}
				};


			mediaTimeline.addEffect(effect);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 2);
		});

		it('Should retrive the end MediaFrame with no extra changes if the frame is after the endTick.', function() {
			var currentTick = 42,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartTick = 2,
				effectEndTick = 5,
				effectId = 'myId',
				getPropertiesFunction = function (tick, mediaFrameProperties) {
					mediaFrameProperties.x += (tick - 1);
					return mediaFrameProperties;
				},
				effect = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick, 'endTick' : effectEndTick };
								return op[name];
							},
					'getGuid' : function () { return effectId; },
					'getProperties' : getPropertiesFunction,
					isInfinite : function() {
						return false;
					}
				};


			mediaTimeline.addEffect(effect);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 4);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends first, only one effect).', function() {
			var currentTick = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				getPropertiesFunction = function (tick, mediaFrameProperties) {
					mediaFrameProperties.x += (tick - 1);
					return mediaFrameProperties;
				},
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick1, 'endTick' : effectEndTick1 };
								return op[name];
							},
					'getGuid' : function () { return effectId1; },
					'getProperties' : getPropertiesFunction,
					isInfinite : function() {
						return false;
					}
				},
				effectStartTick2 = 6,
				effectEndTick2 = 10,
				effectId2 = 'myId2',
				effect2 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick2, 'endTick' : effectEndTick2 };
								return op[name];
							},
					'getGuid' : function () { return effectId2; },
					'getProperties' : getPropertiesFunction,
					isInfinite : function() {
						return false;
					}
				};


			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 2);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends last, only one effect).', function() {
			var currentTick = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				getPropertiesFunction = function (tick, mediaFrameProperties) {
					mediaFrameProperties.x += (tick - 1);
					return mediaFrameProperties;
				},
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId2',
				effect1 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick1, 'endTick' : effectEndTick1 };
								return op[name];
							},
					'getGuid' : function () { return effectId1; },
					'getProperties' : getPropertiesFunction,
					isInfinite : function() {
						return false;
					}
				},
				effectStartTick2 = 6,
				effectEndTick2 = 10,
				effectId2 = 'myId1',
				effect2 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick2, 'endTick' : effectEndTick2 };
								return op[name];
							},
					'getGuid' : function () { return effectId2; },
					'getProperties' : getPropertiesFunction,
					isInfinite : function() {
						return false;
					}
				};


			mediaTimeline.addEffect(effect2);
			mediaTimeline.addEffect(effect1);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 2);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends first).', function() {
			var currentTick = 8,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				getPropertiesFunction = function (tick, mediaFrameProperties) {
					mediaFrameProperties.x += (tick - 1);
					return mediaFrameProperties;
				},
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick1, 'endTick' : effectEndTick1 };
								return op[name];
							},
					'getGuid' : function () { return effectId1; },
					'getProperties' : getPropertiesFunction,
					isInfinite : function() {
						return false;
					}
				},
				effectStartTick2 = 6,
				effectEndTick2 = 10,
				effectId2 = 'myId2',
				effect2 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick2, 'endTick' : effectEndTick2 };
								return op[name];
							},
					'getGuid' : function () { return effectId2; },
					'getProperties' : getPropertiesFunction,
					isInfinite : function() {
						return false;
					}
				};


			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 11);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two continuos effects specified. (first the one that ends last).', function() {
			var currentTick = 8,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				getPropertiesFunction = function (tick, mediaFrameProperties) {
					mediaFrameProperties.x += (tick - 1);
					return mediaFrameProperties;
				},
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId2',
				effect1 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick1, 'endTick' : effectEndTick1 };
								return op[name];
							},
					'getGuid' : function () { return effectId1; },
					'getProperties' : getPropertiesFunction,
					isInfinite : function() {
						return false;
					}
				},
				effectStartTick2 = 6,
				effectEndTick2 = 10,
				effectId2 = 'myId1',
				effect2 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick2, 'endTick' : effectEndTick2 };
								return op[name];
							},
					'getGuid' : function () { return effectId2; },
					'getProperties' : getPropertiesFunction,
					isInfinite : function() {
						return false;
					}
				};


			mediaTimeline.addEffect(effect2);
			mediaTimeline.addEffect(effect1);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			mediaFrame.properties().should.have.property('x', 11);
		});

		it('Should update the properties of a MediaFrame, based on the frame number as two simultaneous effects specified.', function() {
			var currentTick = 3,
				specifiedMediaObjectId = '42',
				defaultProperties = { x : 0, y : 0 },
				specifiedMediaObject = {
					'getGuid' : function () { return specifiedMediaObjectId; },
					'getProperties' : function () { return defaultProperties; }
				},
				mediaTimeline = new MediaTimeline( { mediaObject: specifiedMediaObject } ),
				mediaFrame,
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick1, 'endTick' : effectEndTick1 };
								return op[name];
							},
					'getGuid' : function () { return effectId1; },
					'getProperties' : function (tick, mediaFrameProperties) {
						mediaFrameProperties.x += (tick - 1);
						return mediaFrameProperties;
					},
					isInfinite : function() {
						return false;
					}
				},
				effectStartTick2 = 2,
				effectEndTick2 = 5,
				effectId2 = 'myId2',
				effect2 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick2, 'endTick' : effectEndTick2 };
								return op[name];
							},
					'getGuid' : function () { return effectId2; },
					'getProperties' : function (tick, mediaFrameProperties) {
						mediaFrameProperties.y += (tick - 1);
						return mediaFrameProperties;
					},
					isInfinite : function() {
						return false;
					}
				},
				properties;

			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			mediaFrame = mediaTimeline.getMediaFrameFor(currentTick);

			mediaFrame.should.exists;
			properties = mediaFrame.properties();
			properties.should.have.property('x', 2);
			properties.should.have.property('y', 2);
		});

		it('Should update the properties of a MediaFrame when endFrame is -1.');
	});

	describe('updateEffectsThatMatch', function() {
		it('Should return an empty list if updatedProperties is an empty object (without effects).', function() {
			var currentTick = 3,
				mediaTimeline = new MediaTimeline(),
				propertyList = { },
				result = mediaTimeline.updateEffectsThatMatch(currentTick, propertyList),
				pendingProperties = result.pendingProperties;

			pendingProperties.should.be.an.Array.and.have.length(0);
		});

		it('Should return an empty list if updatedProperties is an empty object (with effects).', function() {
			var currentTick = 3,
				mediaTimeline = new MediaTimeline(),
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick1, 'endTick' : effectEndTick1 };
								return op[name];
							},
					'getGuid' : function () { return effectId1; },
					'HasConflictWithListOfProperties' : function (propertyList) {
						propertyList.should.be.an.Array.and.have.length(0);
						return true;
					},
					'isInfinite' : function() {
								return false;
							},
					'updateProperties' : function (tick, propertyList) {
						propertyList.should.be.an.Object.and.be.empty;
						tick.should.be.equal(currentTick);
						return { updatedProperties : ['propOther', 'propOther2'] };
					}
				},
				propertyList = { },
				result, pendingProperties;

			mediaTimeline.addEffect(effect1);


			result = mediaTimeline.updateEffectsThatMatch(currentTick, propertyList);
			pendingProperties = result.pendingProperties;
			pendingProperties.should.be.an.Array.and.have.length(0);
		});

		it('Should return the list of keys of the updatedProperties if mediaTimeline does not have effects and updatedProperties is not an empty object.', function() {
			var currentTick = 3,
				mediaTimeline = new MediaTimeline(),
				propertyList = {
					prop1 : 1,
					prop2 : 2,
					prop3 : 3,
					prop4 : 4
				},
				result, pendingProperties;


			result = mediaTimeline.updateEffectsThatMatch(currentTick, propertyList);
			pendingProperties = result.pendingProperties;
			pendingProperties.should.be.an.Array.and.have.length(4);
			pendingProperties.should.containEql('prop1');
			pendingProperties.should.containEql('prop2');
			pendingProperties.should.containEql('prop3');
			pendingProperties.should.containEql('prop4');
		});

		it('Should return the list of keys of the updatedProperties if mediaTimeline does have effects that doenst match the updatedProperties.', function() {
			var currentTick = 3,
				mediaTimeline = new MediaTimeline(),
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick1, 'endTick' : effectEndTick1 };
								return op[name];
							},
					'getGuid' : function () { return effectId1; },
					'HasConflictWithListOfProperties' : function (propertyList) {
						propertyList.should.be.an.Array.and.have.length(4);
						return true;
					},
					'updateProperties' : function (tick, propertyList) {
						propertyList.should.be.an.Object.and.have.properties('prop1', 'prop2', 'prop3', 'prop4');
						tick.should.be.equal(currentTick);
						return { updatedProperties : ['propOther', 'propOther2'] };
					},
					'isInfinite' : function() {
						return false;
					}
				},
				propertyList = {
					prop1 : 1,
					prop2 : 2,
					prop3 : 3,
					prop4 : 4
				},
				result, pendingProperties;

			mediaTimeline.addEffect(effect1);

			result = mediaTimeline.updateEffectsThatMatch(currentTick, propertyList);
			pendingProperties = result.pendingProperties;
			pendingProperties.should.be.an.Array.and.have.length(4);
			pendingProperties.should.containEql('prop1');
			pendingProperties.should.containEql('prop2');
			pendingProperties.should.containEql('prop3');
			pendingProperties.should.containEql('prop4');
		});

		it('Should return the list of keys of the updatedProperties if mediaTimeline does have effects but the tick is not contained.', function() {
			var currentTick = 42,
				mediaTimeline = new MediaTimeline(),
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick1, 'endTick' : effectEndTick1 };
								return op[name];
							},
					'getGuid' : function () { return effectId1; },
					'HasConflictWithListOfProperties' : function (propertyList) {
						propertyList.should.be.an.Array.and.have.length(4);
						return true;
					},
					'updateProperties' : function (tick, propertyList) {
						propertyList.should.be.an.Object.and.have.properties('prop1', 'prop2', 'prop3', 'prop4');
						tick.should.be.equal(currentTick);
						return { updatedProperties : ['prop1', 'prop4'] };
					},
					isInfinite : function() {
						return false;
					}
				},
				propertyList = {
					prop1 : 1,
					prop2 : 2,
					prop3 : 3,
					prop4 : 4
				},
				result, pendingProperties;

			mediaTimeline.addEffect(effect1);

			result = mediaTimeline.updateEffectsThatMatch(currentTick, propertyList);
			pendingProperties = result.pendingProperties;
			pendingProperties.should.be.an.Array.and.have.length(4);
			pendingProperties.should.containEql('prop1');
			pendingProperties.should.containEql('prop2');
			pendingProperties.should.containEql('prop3');
			pendingProperties.should.containEql('prop4');
		});

		it('Should not execute updateProperties if HasConflictWithListOfProperties return false', function() {
			var currentTick = 3,
				mediaTimeline = new MediaTimeline(),
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick1, 'endTick' : effectEndTick1 };
								return op[name];
							},
					'getGuid' : function () { return effectId1; },
					'HasConflictWithListOfProperties' : function (propertyList) {
						propertyList.should.be.an.Array.and.have.length(4);
						return false;
					},
					'updateProperties' : function (tick, propertyList) {
						should.fail('UpdateProperties should not be called');
						return { updatedProperties : ['prop1', 'prop4'] };
					},
					'isInfinite' : function() {
						return false;
					}
				},
				propertyList = {
					prop1 : 1,
					prop2 : 2,
					prop3 : 3,
					prop4 : 4
				},
				result, pendingProperties;

			mediaTimeline.addEffect(effect1);

			result = mediaTimeline.updateEffectsThatMatch(currentTick, propertyList);
			pendingProperties = result.pendingProperties;
			pendingProperties.should.be.an.Array.and.have.length(4);
			pendingProperties.should.containEql('prop1');
			pendingProperties.should.containEql('prop2');
			pendingProperties.should.containEql('prop3');
			pendingProperties.should.containEql('prop4');
		});

		it('Should return only some of the properties as an effect is updated.', function() {
			var currentTick = 3,
				mediaTimeline = new MediaTimeline(),
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick1, 'endTick' : effectEndTick1 };
								return op[name];
							},
					'getGuid' : function () { return effectId1; },
					'HasConflictWithListOfProperties' : function (propertyList) {
						propertyList.should.be.an.Array.and.have.length(4);
						return true;
					},
					'updateProperties' : function (tick, propertyList) {
						propertyList.should.be.an.Object.and.have.properties('prop1', 'prop2', 'prop3', 'prop4');
						tick.should.be.equal(currentTick);
						return { updatedProperties : ['prop1', 'prop4'] };
					},
					'isInfinite' : function() {
						return false;
					}
				},
				propertyList = {
					prop1 : 1,
					prop2 : 2,
					prop3 : 3,
					prop4 : 4
				},
				result, pendingProperties;

			mediaTimeline.addEffect(effect1);

			result = mediaTimeline.updateEffectsThatMatch(currentTick, propertyList);
			pendingProperties = result.pendingProperties;
			pendingProperties.should.be.an.Array.and.have.length(2);
			pendingProperties.should.containEql('prop2');
			pendingProperties.should.containEql('prop3');
		});

		it('Should return only some of the properties as the two effect updates different properties.', function() {
			var currentTick = 3,
				mediaTimeline = new MediaTimeline(),
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick1, 'endTick' : effectEndTick1 };
								return op[name];
							},
					'getGuid' : function () { return effectId1; },
					'HasConflictWithListOfProperties' : function (propertyList) {
						propertyList.should.be.an.Array.and.have.length(4);
						return true;
					},
					'updateProperties' : function (tick, propertyList) {
						propertyList.should.be.an.Object.and.have.properties('prop1', 'prop2', 'prop3', 'prop4');
						tick.should.be.equal(currentTick);
						return { updatedProperties : ['prop3'] };
					},
					'isInfinite' : function() {
						return false;
					}
				},
				effectStartTick2 = 2,
				effectEndTick2 = 5,
				effectId2 = 'myId2',
				effect2 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick2, 'endTick' : effectEndTick2};
								return op[name];
							},
					'getGuid' : function () { return effectId2; },
					'HasConflictWithListOfProperties' : function (propertyList) {
						propertyList.should.be.an.Array.and.have.length(4);
						return true;
					},
					'updateProperties' : function (tick, propertyList) {
						propertyList.should.be.an.Object.and.have.properties('prop1', 'prop2', 'prop3', 'prop4');
						tick.should.be.equal(currentTick);
						return { updatedProperties : ['prop2'] };
					},
					'isInfinite' : function() {
						return false;
					}
				},
				propertyList = {
					prop1 : 1,
					prop2 : 2,
					prop3 : 3,
					prop4 : 4
				},
				result, pendingProperties;

			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			result = mediaTimeline.updateEffectsThatMatch(currentTick, propertyList);
			pendingProperties = result.pendingProperties;
			pendingProperties.should.be.an.Array.and.have.length(2);
			pendingProperties.should.containEql('prop1');
			pendingProperties.should.containEql('prop4');
		});

		it('Should return only some of the properties as the two effect updates same properties.', function() {
			var currentTick = 3,
				mediaTimeline = new MediaTimeline(),
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick1, 'endTick' : effectEndTick1 };
								return op[name];
							},
					'getGuid' : function () { return effectId1; },
					'HasConflictWithListOfProperties' : function (propertyList) {
						propertyList.should.be.an.Array.and.have.length(4);
						return true;
					},
					'updateProperties' : function (tick, propertyList) {
						propertyList.should.be.an.Object.and.have.properties('prop1', 'prop2', 'prop3', 'prop4');
						tick.should.be.equal(currentTick);
						return { updatedProperties : ['prop1'] };
					},
					'isInfinite' : function() {
						return false;
					}
				},
				effectStartTick2 = 2,
				effectEndTick2 = 5,
				effectId2 = 'myId2',
				effect2 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick2, 'endTick' : effectEndTick2};
								return op[name];
							},
					'getGuid' : function () { return effectId2; },
					'HasConflictWithListOfProperties' : function (propertyList) {
						propertyList.should.be.an.Array.and.have.length(4);
						return true;
					},
					'updateProperties' : function (tick, propertyList) {
						propertyList.should.be.an.Object.and.have.properties('prop1', 'prop2', 'prop3', 'prop4');
						tick.should.be.equal(currentTick);
						return { updatedProperties : ['prop1'] };
					},
					'isInfinite' : function() {
						return false;
					}
				},
				propertyList = {
					prop1 : 1,
					prop2 : 2,
					prop3 : 3,
					prop4 : 4
				},
				result, pendingProperties;

			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			result = mediaTimeline.updateEffectsThatMatch(currentTick, propertyList);
			pendingProperties = result.pendingProperties;
			pendingProperties.should.be.an.Array.and.have.length(3);
			pendingProperties.should.containEql('prop2');
			pendingProperties.should.containEql('prop3');
			pendingProperties.should.containEql('prop4');
		});

		it('Should return only some of the properties as the two effect updates mixed properties.', function() {
			var currentTick = 3,
				mediaTimeline = new MediaTimeline(),
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick1, 'endTick' : effectEndTick1 };
								return op[name];
							},
					'getGuid' : function () { return effectId1; },
					'HasConflictWithListOfProperties' : function (propertyList) {
						propertyList.should.be.an.Array.and.have.length(4);
						return true;
					},
					'updateProperties' : function (tick, propertyList) {
						propertyList.should.be.an.Object.and.have.properties('prop1', 'prop2', 'prop3', 'prop4');
						tick.should.be.equal(currentTick);
						return { updatedProperties : ['prop1', 'prop4'] };
					},
					'isInfinite' : function() {
						return false;
					}
				},
				effectStartTick2 = 2,
				effectEndTick2 = 5,
				effectId2 = 'myId2',
				effect2 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick2, 'endTick' : effectEndTick2};
								return op[name];
							},
					'getGuid' : function () { return effectId2; },
					'HasConflictWithListOfProperties' : function (propertyList) {
						propertyList.should.be.an.Array.and.have.length(4);
						return true;
					},
					'updateProperties' : function (tick, propertyList) {
						propertyList.should.be.an.Object.and.have.properties('prop1', 'prop2', 'prop3', 'prop4');
						tick.should.be.equal(currentTick);
						return { updatedProperties : ['prop1', 'prop3'] };
					},
					'isInfinite' : function() {
						return false;
					}
				},
				propertyList = {
					prop1 : 1,
					prop2 : 2,
					prop3 : 3,
					prop4 : 4
				},
				result, pendingProperties;

			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			result = mediaTimeline.updateEffectsThatMatch(currentTick, propertyList);
			pendingProperties = result.pendingProperties;
			pendingProperties.should.be.an.Array.and.have.length(1);
			pendingProperties.should.containEql('prop2');
		});

		it('Should return an empty array of properties as the two effect updates all the properties.', function() {
			var currentTick = 3,
				mediaTimeline = new MediaTimeline(),
				effectStartTick1 = 2,
				effectEndTick1 = 5,
				effectId1 = 'myId1',
				effect1 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick1, 'endTick' : effectEndTick1 };
								return op[name];
							},
					'getGuid' : function () { return effectId1; },
					'HasConflictWithListOfProperties' : function (propertyList) {
						propertyList.should.be.an.Array.and.have.length(4);
						return true;
					},
					'updateProperties' : function (tick, propertyList) {
						propertyList.should.be.an.Object.and.have.properties('prop1', 'prop2', 'prop3', 'prop4');
						tick.should.be.equal(currentTick);
						return { updatedProperties : ['prop1', 'prop2', 'prop4'] };
					},
					'isInfinite' : function() {
						return false;
					}
				},
				effectStartTick2 = 2,
				effectEndTick2 = 5,
				effectId2 = 'myId2',
				effect2 = {
					'getOption' : function (name) {
								var op = { 'startTick' : effectStartTick2, 'endTick' : effectEndTick2};
								return op[name];
							},
					'getGuid' : function () { return effectId2; },
					'HasConflictWithListOfProperties' : function (propertyList) {
						propertyList.should.be.an.Array.and.have.length(4);
						return true;
					},
					'updateProperties' : function (tick, propertyList) {
						propertyList.should.be.an.Object.and.have.properties('prop1', 'prop2', 'prop3', 'prop4');
						tick.should.be.equal(currentTick);
						return { updatedProperties : ['prop1', 'prop3'] };
					},
					'isInfinite' : function() {
						return false;
					}
				},
				propertyList = {
					prop1 : 1,
					prop2 : 2,
					prop3 : 3,
					prop4 : 4
				},
				result, pendingProperties;

			mediaTimeline.addEffect(effect1);
			mediaTimeline.addEffect(effect2);

			result = mediaTimeline.updateEffectsThatMatch(currentTick, propertyList);
			pendingProperties = result.pendingProperties;
			pendingProperties.should.be.an.Array.and.have.length(0);
		});
	});

});
