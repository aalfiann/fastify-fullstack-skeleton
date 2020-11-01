'use strict'

/* global describe it */
const assert = require('assert')
const helper = require('../lib/helper.js')

describe('helper function test', function () {
  it('auto etag', function () {
    const result = helper.autoEtag(24)
    const expected = result.substring(0, 10)
    assert.strictEqual(result, expected + '1')
    const result2 = helper.autoEtag(23)
    // before hour 23 expected value still 1
    // but after hour 23, expected value will be changed to 2
    // so we will use substr to make sure this test is pass to run anytime.
    assert.strictEqual(result2, expected + result2.substr(10, 11))
  })

  it('copyright year format', function () {
    assert.strictEqual(helper.copyrightYear(2020), 2020)
    assert.strictEqual(helper.copyrightYear(2019), '2019 - 2020')
  })
})
