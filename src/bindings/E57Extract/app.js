/**
 * #57Extract/app.js
 *
 * @description :: Javascript-binding for the 'E57Extract@UBO' python tool
 */


var Promise = require("bluebird"),
  spawn = require('child_process').spawn,
  uuid = require('node-uuid'),
  path = require('path'),
  fs = require('fs');

var _failsave = true;

var E57Extract = module.exports = function() {}

E57Extract.prototype.asJSON = function(e57) {
  var extractor = this;

  return new Promise(function(resolve, reject) {
    console.log('[E57Extract::asJSONLD] file: ' + e57.path);

    try {
      stats = fs.lstatSync(e57.path);
      if (!stats.isFile()) {
        return reject('[E57Extract::asJSONLD] ERROR: file "' + e57.path + '" does not exist');
      }
    } catch (err) {
      return reject('[E57Extract::asJSONLD] FILE EXCEPTION: ' + err);
    }

    var outputFile = path.join('/tmp', uuid.v4() + '.json');
    // console.log('outputFile: ' + outputFile);

    if (_failsave) {
      var fixtureData = path.join(process.cwd(), 'fixtures', 'nygade-e57-metadata.json');
      console.log('fixtureData: ' + fixtureData);

      try {
        var metadata = JSON.parse(fs.readFileSync(fixtureData));
      } catch (err) {
        console.log('[E57Extract::asJSONLD] Error during file loading: ' + err);
        return reject('[E57Extract::asJSONLD] FILE EXCEPTION: ' + err);
      }

      return resolve(metadata);
    } else {
      // FIXXME: error handling if executable is not available!
      var executable = spawn('e57metadata', [e57.file, outputFile]);

      executable.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
      });

      executable.stderr.on('data', function(err) {
        console.log('[E57Extract::asJSONLD] Error during program execution: ' + err);
        reject('[E57Extract::asJSONLD] Error during program execution: ' + err);
      });

      executable.on('close', function(code) {
        // console.log('child process exited with code ' + code);
        console.log('[PyIfcExtract::asJSONLD] RDF extraction finished, converting to JSON-LD ...');

        var jsonld = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

        if (!jsonld) {
          console.log('[E57Extract::asJSONLD] Cannot read metadata output file: ' + outputFile);
          reject('[E57Extract::asJSONLD] Cannot read metadata output file: ' + outputFile);
        }

        console.log('[PyIfcExtract::asJSONLD]     ... finished');
        resolve(jsonld);
      });
    }
  });
};
