#!/usr/bin/env node

'use strict';


const AsyncFunction = require('zanner-cms-asyncfunction').AsyncFunction;
const GeneratorFunction = require('zanner-cms-generatorfunction').GeneratorFunction;


class Action {

	static init (...args) {
		return Object.freeze(new Action(...args));
	}


	get action () {
		return this._action;
	}

	get name () {
		return this._name;
	}

	get service () {
		return this._service;
	}


	set action (action) {
		if (action instanceof AsyncFunction) {
			this._action = action;
			return this;
		}
		if (action instanceof GeneratorFunction) {
			this._action = action;
			return this;
		}
		if (action instanceof Function) {
			this._action = action;
			return this;
		}
		throw new Error('Action.action set with wrong type');
	}

	set name (name) {
		if (String(name)!==name) throw new Error('Action.name set with wrong type');
		if (name.trim().length<1) throw new Error('Action.name set with wrong length');
		this._name = name;
		return this;
	}

	set service (service) {
		if (String(service)!==service) throw new Error('Action.service set with wrong type');
		if (service.trim().length<1) throw new Error('Action.service set with wrong length');
		this._service = service;
		return this;
	}
	

	apply (args) {
		let A = [].concat(args);
		return this._action(...A);
	}

	call (...args) {
		return this._action(...args);
	}

	clone (cloneOverwrite) {
		let p = cloneOverwrite || {};
		let name = p.name || this.name;
		let service = p.service || this.service;
		let action = p.action || this.action;
		return Action.init(name, service, action);
	}

	constructor (name, service, action) {
		if (arguments.length!=3) {
			throw new Error('Action creating with wrong arguments count');
		}

		this.name = name;
		this.service = service;
		this.action = action;
	}

}

exports.Action = Action;
