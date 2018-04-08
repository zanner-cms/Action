#!/usr/bin/env node

'use strict';


const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const mlog = require('mocha-logger');
const util = require('util');

const Action = require('../Action').Action;
const AsyncFunction = require('../AsyncFunction').AsyncFunction;


describe('AsyncFunction', () => {

	it('is async function class', () => {
		expect(async function () {}).to.be.instanceof(AsyncFunction);
	});

});

describe('Action', () => {

	describe('static', () => {

		it('Action is a function', (done) => {
			expect(Action).to.be.an.instanceof(Function);
			done();
		});

		it('Action.init is a function', (done) => {
			expect(Action.init).to.be.an.instanceof(Function);
			done();
		});

		it('Action.init creates instanceof Action', (done) => {
			let name = 'name';
			let service = 'service';
			let action = function () {};

			expect(Action.init(name, service, action)).to.be.an.instanceof(Action);
			done();
		});

		it('Action.init don`t creates instanceof Action with wrong name', (done) => {
			let name = 1;
			let service = 'service';
			let action = function () {};

			expect(() => Action.init(name, service, action)).to.throw();
			done();
		});

		it('Action.init don`t creates instanceof Action with wrong service', (done) => {
			let name = 'name';
			let service = [];
			let action = function () {};

			expect(() => Action.init(name, service, action)).to.throw();
			done();
		});

		it('Action.init don`t creates instanceof Action with wrong action', (done) => {
			let name = 'name';
			let service = 'service';
			let action = {};

			expect(() => Action.init(name, service, action)).to.throw();
			done();
		});

	});
	
	describe('instance', () => {

		it('Action creates instanceof Action', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function () {};

			expect(new Action(name, service, action)).to.be.an.instanceof(Action);
			done();
		});

		it('Action.name get', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function () {};

			expect(Action.init(name, service, action).name).to.be.equal(name);
			done();
		});

		it('Action.service get', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function () {};

			expect(Action.init(name, service, action).service).to.be.equal(service);
			done();
		});

		it('Action.action get', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function () {};

			expect(Action.init(name, service, action).action).to.be.equal(action);
			done();
		});

		it('Action.name don`t set', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function () {};
			let a = Action.init(name, service, action);
			let name_new = 'name_new';

			expect(() => a.name = name_new).to.throw();
			done();
		});

		it('Action.service don`t set', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function () {};
			let a = Action.init(name, service, action);
			let service_new = 'service_new';

			expect(() => a.service = service_new).to.throw();
			done();
		});

		it('Action.action don`t set', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function () {};
			let a = Action.init(name, service, action);
			let action_new = function () {};

			expect(() => a.action = action_new).to.throw();
			done();
		});

		it('Action.apply exec', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function (x, y) { return x + y; };
			let a = Action.init(name, service, action);

			expect(a.apply).to.be.an.instanceof(Function);
			expect(a.apply([13, 31])).to.eventually.equal(13 + 31).notify(done);
			//a.apply([13, 31]).should.eventually.equal(44).notify(done);
		});

		it('Action.apply exec with throw', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function (x, y) { throw new Error('Action.apply'); };
			let a = Action.init(name, service, action);

			expect(a.apply([13, 31])).to.be.rejectedWith('Action.apply').notify(done);
		});

		it('Action.call exec', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function (x, y) { return x + y; };
			let a = Action.init(name, service, action);

			expect(a.call).to.be.an.instanceof(Function);
			expect(a.call(13, 31)).to.eventually.equal(13 + 31).notify(done);
			//a.call(13, 31).should.eventually.equal(44).notify(done);
		});

		it('Action.call exec with throw', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function (x, y) { throw new Error('Action.call'); };
			let a = Action.init(name, service, action);

			expect(a.apply(13, 31)).to.be.rejectedWith('Action.call').notify(done);
		});

		it('Action.clone creates copy of instanceof Action', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function () {};
			let a = Action.init(name, service, action);

			expect(a.clone).to.be.an.instanceof(Function);
			let a_copy = a.clone();
			expect(a_copy._name).to.be.equal(a._name);
			expect(a_copy._service).to.be.equal(a._service);
			expect(a_copy._action).to.be.equal(a._action);
			done();
		});

		it('Action.clone creates copy of instanceof Action with overwriting name', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function () {};
			let a = Action.init(name, service, action);
			let name_copy = 'name_copy';
			let a_copy = a.clone({ name: name_copy });

			expect(a_copy._name).to.be.equal(name_copy);
			expect(a_copy._service).to.be.equal(a._service);
			expect(a_copy._action).to.be.equal(a._action);
			done();
		});

		it('Action.clone creates copy of instanceof Action with overwriting service', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function () {};
			let a = Action.init(name, service, action);
			let service_copy = 'service_copy';
			let a_copy = a.clone({ service: service_copy });

			expect(a_copy._name).to.be.equal(a._name);
			expect(a_copy._service).to.be.equal(service_copy);
			expect(a_copy._action).to.be.equal(a._action);
			done();
		});

		it('Action.clone creates copy of instanceof Action with overwriting action', (done) => {
			let name = 'name';
			let service = 'service';
			let action = async function () {};
			let a = Action.init(name, service, action);
			let action_copy = function () {};
			let a_copy = a.clone({ action: action_copy });

			expect(a_copy._name).to.be.equal(a._name);
			expect(a_copy._service).to.be.equal(a._service);
			expect(a_copy._action).to.be.equal(action_copy);
			done();
		});

	});

});
