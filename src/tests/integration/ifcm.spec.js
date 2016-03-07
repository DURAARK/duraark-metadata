var request = require('supertest'),
  assert = require('chai').assert;

describe('The public E57M endpoint', function() {
  var testFile = '/duraark-storage/sessions/sessions/fixed/Fojab/Isblocket/master/FOJAB_Isblocket.ifcFOJAB_Isblocket.ifc';
  request = request.bind(request, 'http://mimas.cgv.tugraz.at/api/v0.7/metadata');


  describe('GET /ifcm', function() {
    it('should return an array', function(done) {
      request(sails.hooks.http.app)
        .get('/ifcm')
        .expect(200, done);
    });
  });

  describe('when requested for an ifcm extraction', function() {
    it('should return an ifcm record', function(done) {
      request(sails.hooks.http.app)
        .post('/ifcm')
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
