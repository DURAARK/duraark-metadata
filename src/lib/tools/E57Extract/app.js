/**
 * E57Extract/app.js
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

E57Extract.prototype.asJSONLD = function(e57) {
  var extractor = this;

  return new Promise(function(resolve, reject) {
    // console.log('[E57Extract::asJSONLD] file: ' + e57.path); // TODO: use buyan's debug level!

    try {
      stats = fs.lstatSync(e57.path);
      if (!stats.isFile()) {
        console.log('[E57Extract::asJSONLD] ERROR: file "' + e57.path + '" does not exist');
        return reject('[E57Extract::asJSONLD] ERROR: file "' + e57.path + '" does not exist');
      }
    } catch (err) {
      console.log('[E57Extract::asJSONLD] ERROR checking file: "' + e57.path + '" does not exist');
      return reject('[E57Extract::asJSONLD] ERROR checking file: "' + e57.path + '" does not exist');
    }

    var outputFile = path.join('/tmp', uuid.v4() + '.json');
    // console.log('outputFile: ' + outputFile);

    if (_failsave) {
      var metadata = [],
        fixtureData = path.join(process.cwd(), '..', 'testdata', 'nygade-e57-metadata.json');

      // console.log('fixtureData: ' + fixtureData);

      try {
        var md = JSON.parse(fs.readFileSync(fixtureData));
        metadata.push(md.e57_metadata);
      } catch (err) {
        console.log('[E57Extract::asJSONLD] ERROR during file loading: ' + err);
        return reject('[E57Extract::asJSONLD] FILE EXCEPTION: ' + err);
      }

      var xml = extractor.json2xml(jsonld);
      
      return resolve(metadata);
    } else {
      try {
        var executable = spawn('e57metadata', [e57.file, outputFile]);

        executable.stdout.on('data', function(data) {
          console.log('stdout: ' + data);
        });

        executable.stderr.on('data', function(err) {
          console.log('[E57Extract::asJSONLD] ERROR during program execution:\n\n' + err + '\n');
          return reject('[E57Extract::asJSONLD] ERROR during program execution:\n\n' + err);
        });

        executable.on('close', function(code) {
          if (code !== 0) {
            console.log('[E57Extract::asJSONLD] ERROR: exited with code:' + code);
            return reject('[E57Extract::asJSONLD] ERROR: exited with code: \n\n' + code + '\n');
          }

          console.log('[E57Extract::asJSONLD] RDF extraction finished, converting to JSON-LD ...');

          var jsonld = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

          if (!jsonld) {
            console.log('[E57Extract::asJSONLD] Cannot read metadata output file: ' + outputFile);
            reject('[E57Extract::asJSONLD] Cannot read metadata output file: ' + outputFile);
          }

          console.log('[E57Extract::asJSONLD]     ... finished');
          resolve([jsonld]);
        });
      } catch (err) {
        console.log('[E57Extract::asJSONLD] ERROR on program start:\n\n' + err + '\n');
        return reject('[E57Extract::asJSONLD] ERROR on program start:\n\n' + err);
      }
    }
  });
};

E57Extract.prototype.json2xml = function(json) {
  return json;
};
