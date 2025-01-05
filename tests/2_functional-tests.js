const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
const mocha = require('mocha');
const { suite, test } = mocha;

suite('Functional Tests', function() {
    // 测试1: 查看单个股票
    test('Viewing one stock: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({stock: 'GOOG'})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'stockData');
                assert.property(res.body.stockData, 'stock');
                assert.property(res.body.stockData, 'price');
                assert.property(res.body.stockData, 'likes');
                assert.equal(res.body.stockData.stock, 'GOOG');
                done();
            });
    });

    // 测试2: 查看并点赞一个股票
    test('Viewing one stock and liking it: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({stock: 'GOOG', like: true})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'stockData');
                assert.property(res.body.stockData, 'stock');
                assert.property(res.body.stockData, 'price');
                assert.property(res.body.stockData, 'likes');
                assert.equal(res.body.stockData.stock, 'GOOG');
                done();
            });
    });

    // 测试3: 再次查看并点赞同一个股票
    test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({stock: 'GOOG', like: true})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'stockData');
                assert.property(res.body.stockData, 'stock');
                assert.property(res.body.stockData, 'price');
                assert.property(res.body.stockData, 'likes');
                assert.equal(res.body.stockData.stock, 'GOOG');
                done();
            });
    });

    // 测试4: 查看两个股票
    test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({stock: ['GOOG', 'MSFT']})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'stockData');
                assert.isArray(res.body.stockData);
                assert.property(res.body.stockData[0], 'stock');
                assert.property(res.body.stockData[0], 'price');
                assert.property(res.body.stockData[0], 'rel_likes');
                assert.property(res.body.stockData[1], 'stock');
                assert.property(res.body.stockData[1], 'price');
                assert.property(res.body.stockData[1], 'rel_likes');
                done();
            });
    });

    // 测试5: 查看并点赞两个股票
    test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function(done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({stock: ['GOOG', 'MSFT'], like: true})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'stockData');
                assert.isArray(res.body.stockData);
                assert.property(res.body.stockData[0], 'stock');
                assert.property(res.body.stockData[0], 'price');
                assert.property(res.body.stockData[0], 'rel_likes');
                assert.property(res.body.stockData[1], 'stock');
                assert.property(res.body.stockData[1], 'price');
                assert.property(res.body.stockData[1], 'rel_likes');
                done();
            });
    });
});