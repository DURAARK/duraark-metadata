/**
 * PyIfcExtract/index.js
 *
 * @description :: Javascript-binding for the 'pyIfcExtract@TUE' python tool
 */


var Promise = require('bluebird'),
  spawn = require('child_process').spawn,
  rdf = require('rdf-ext')(),
  jsonld = require('jsonld'),
  fs = require('fs');

var PyIfcExtract = module.exports = function(schema) {
  this.schema = schema;
}

PyIfcExtract.prototype.extractIfcm = function(ifc) {
  var extractor = this;

  return new Promise(function(resolve, reject) {
    console.log('[PyIfcExtract::extractIfcm] file: ' + ifc.path);

    try {
      stats = fs.lstatSync(ifc.path);
      if (!stats.isFile()) {
        return reject('[PyIfcExtract::extractIfcm] ERROR: file "' + ifc.path + '" does not exist');
      }
    } catch (err) {
      return reject('[PyIfcExtract::extractIfcm] FILE EXCEPTION: ' + err);
    }

    try {
      console.log('[PyIfcExtract::extractIfcm] about to start "python2.7 /duraark-storage/tools/pyIfcExtract/ifcm_extractor.py" ...');

      var executable = spawn('python2.7', ['/duraark-storage/tools/pyIfcExtract/ifcm_extractor.py', ifc.path]),
        xmlString = '';

      executable.stdout.on('data', function(data) {
        // console.log('stdout: ' + data);
        xmlString += data;
      });

      executable.stderr.on('data', function(err) {
        console.log('[PyIfcExtract::extractIfcm] ERROR during program execution:\n\n' + err + '\n');
        return reject('[PyIfcExtract::extractIfcm] ERROR during program execution:\n\n' + err);
      });

      executable.on('close', function(code) {
        if (code !== 0) {
          console.log('[PyIfcExtract::extractIfcm] ERROR: exited with code:' + code);
          return reject('[PyIfcExtract::extractIfcm] ERROR: exited with code: \n\n' + code + '\n');
        }
        console.log('[PyIfcExtract::extractIfcm] RDF extraction finished, converting to JSON-LD ...');

        return resolve(xmlString);
      });
    } catch (err) {
      console.log('[PyIfcExtract::extractIfcm] ERROR on program start:\n\n' + err + '\n');
      return reject('[PyIfcExtract::extractIfcm] ERROR on program start:\n\n' + err);
    }
  });
};

PyIfcExtract.prototype.extractBuildm = function(ifc, schema) {
  var extractor = this;

  return new Promise(function(resolve, reject) {
    console.log('[PyIfcExtract::asJSONLD] file: ' + ifc.path);
    console.log('                         schema: ' + schema);

    try {
      stats = fs.lstatSync(ifc.path);
      if (!stats.isFile()) {
        return reject('[PyIfcExtract::asJSONLD] ERROR: file "' + ifc.path + '" does not exist');
      }
    } catch (err) {
      return reject('[PyIfcExtract::asJSONLD] FILE EXCEPTION: ' + err);
    }

    try {
      console.log('[PyIfcExtract::extractIfcm] about to start "python2.7 /duraark-storage/tools/pyIfcExtract/ifcm_extractor.py" ...');

      var executable = spawn('python3.3', ['/duraark-storage/tools/pyIfcExtract/buildm_extractor.py', ifc.path, schema]),
        rdfString = '';

      executable.stdout.on('data', function(data) {
        // console.log('stdout: ' + data);
        rdfString += data;
      });

      executable.stderr.on('data', function(err) {
        console.log('[PyIfcExtract::asJSONLD] ERROR during program execution:\n\n' + err + '\n');
        return reject('[PyIfcExtract::asJSONLD] ERROR during program execution:\n\n' + err);
      });

      executable.on('close', function(code) {
        if (code !== 0) {
          console.log('[PyIfcExtract::asJSONLD] ERROR: exited with code:' + code);
          return reject('[PyIfcExtract::asJSONLD] ERROR: exited with code: \n\n' + code + '\n');
        }
        console.log('[PyIfcExtract::asJSONLD] RDF extraction finished, converting to JSON-LD ...');

        rdf.parseTurtle(rdfString, function(graph, err) {
          if (err) {
            console.log('[PyIfcExtract::asJSONLD] ERROR: rdf.parseTurtle:\n\n' + err + '\n');
            return reject('[PyIfcExtract::asJSONLD] ERROR: rdf.parseTurtle:\n\n' + err + '\n');
          }

          var graph_n3 = graph.toString();

          jsonld.fromRDF(graph_n3, {
            format: 'application/nquads'
          }, function(err, jsonld) {
            if (err) return res.send(err);
            // console.log('[PyIfcExtract::asJSONLD]     ... finished:\n\n' + JSON.stringify(jsonld, null, 4));
            console.log('[PyIfcExtract::asJSONLD]     ... finished');
            resolve(jsonld);
          });
        });
      });
    } catch (err) {
      console.log('[PyIfcExtract::asJSONLD] ERROR on program start:\n\n' + err + '\n');
      return reject('[PyIfcExtract::asJSONLD] ERROR on program start:\n\n' + err);
    }
  });
};
