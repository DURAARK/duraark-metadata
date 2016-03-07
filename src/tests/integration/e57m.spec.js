var request = require('supertest'),
  assert = require('chai').assert;

describe('The public E57M endpoint', function() {
  var testFile = '/duraark-storage/sessions/byg72-2nd-scan_fixed/masterbyg72-2nd-scan_fixed/master/CITA_Byg72_2nd_Scan.e57CITA_Byg72_2nd_Scan.e57';
  request = request.bind(request, 'http://mimas.cgv.tugraz.at/api/v0.7/metadata');


  describe('GET /e57m', function() {
    it('should return an array', function(done) {
      request(sails.hooks.http.app)
        .get('/e57m')
        .expect(200, done);
    });
  });

  describe('when requested for an e57m extraction', function() {
    it('should return an e57m record', function(done) {
      request(sails.hooks.http.app)
        .post('/e57m')
        .send({
          inputFile: testFile
        })
        .expect(function(res) {
          var result = res.body;

          console.log('rstuld: ' + JSON.stringify(result, null, 4));

          // assert.isDefined(result.inputFile, '"inputFile" not present');
        })
        .expect(200, done)
    });
  });
});
