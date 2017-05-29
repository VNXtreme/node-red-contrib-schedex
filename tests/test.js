/**
 The MIT License (MIT)

 Copyright (c) 2016 @biddster

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

"use strict";
var assert = require('chai').assert;
var _ = require('lodash');
var moment = require('moment');
var mock = require('node-red-contrib-mock-node');
var nodeRedModule = require('../index.js');


describe('schedex', function () {
    it('should schedule initially', function () {
        var node = newNode();
        assert.strictEqual(node.schedexEvents().on.time, '11:45');
        assert.strictEqual(node.schedexEvents().off.time, 'dawn');

        node.emit('input', { payload: 'on' });
        assert.strictEqual(node.sent(0).payload, 'on payload');
        assert.strictEqual(node.sent(0).topic, 'on topic');

        node.emit('input', { payload: 'off' });
        assert.strictEqual(node.sent(1).payload, 'off payload');
        assert.strictEqual(node.sent(1).topic, 'off topic');
    });
    it('should handle programmatic scheduling', function () {
        var node = newNode();
        node.emit('input', { payload: 'ontime 11:12' });
        assert.strictEqual(node.schedexEvents().on.time, '11:12');
        node.emit('input', { payload: { ontime: '23:12' } });
        assert.strictEqual(node.schedexEvents().on.time, '23:12');

        node.emit('input', { payload: 'offtime 10:12' });
        assert.strictEqual(node.schedexEvents().off.time, '10:12');
        node.emit('input', { payload: { offtime: '22:12' } });
        assert.strictEqual(node.schedexEvents().off.time, '22:12');
    });
    it('should indicate bad programmatic input', function () {
        var node = newNode();
        node.emit('input', { payload: 'wibble' });
        assert.strictEqual(node.status().text, 'Unsupported input');

        node.status().text = '';
        node.emit('input', { payload: '4412' });
        assert.strictEqual(node.status().text, 'Unsupported input');
    });
    it('should indicate bad configuration', function () {
        var node = newNode();
        // TODO 
    });
    it('should suspend initially', function () {
        var node = mock(nodeRedModule, {
            suspended: true,
            ontime: '11:45',
            ontopic: 'on topic',
            onpayload: 'on payload',
            onoffset: '',
            onrandomoffset: 0,
            offtime: 'dawn',
            offtopic: 'off topic',
            offpayload: 'off payload',
            offoffset: '5',
            offrandomoffset: 1,
            lat: 51.33411,
            lon: -0.83716,
            unittest: true
        });
        assert(node.status().text.indexOf('Scheduling suspended') === 0);
    });
});


function newNode() {
    return mock(nodeRedModule, {
        suspended: false,
        ontime: '11:45',
        ontopic: 'on topic',
        onpayload: 'on payload',
        onoffset: '',
        onrandomoffset: 0,
        offtime: 'dawn',
        offtopic: 'off topic',
        offpayload: 'off payload',
        offoffset: '5',
        offrandomoffset: 1,
        lat: 51.33411,
        lon: -0.83716,
        unittest: true
    });
}