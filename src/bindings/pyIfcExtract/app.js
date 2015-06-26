/**
 * PyIfcExtract/app.js
 *
 * @description :: Javascript-binding for the 'pyIfcExtract@TUE' python tool
 */

var rdf = require('rdf-ext')(),
  jsonld = require('jsonld'),
  Promise = require("bluebird"),
  spawn = require('child_process').spawn,
  fs = require('fs');

var PyIfcExtract = module.exports = function(schema) {
  this.schema = schema;
}

PyIfcExtract.prototype.asJSONLD = function(ifc, res) {
  var extractor = this;

  return new Promise(function(resolve, reject) {
    console.log('[PyIfcExtract::asJSONLD] file: ' + ifc.path);
    console.log('                         schema: ' + extractor.schema);

    ifc.status = 'pending';

    try {
      stats = fs.lstatSync(ifc.path);
      if (!stats.isFile()) {
        return reject('[PyIfcExtract::asJSONLD] ERROR: file "' + ifc.path + '" does not exist');
      }
    } catch (err) {
      return reject('[PyIfcExtract::asJSONLD] FILE EXCEPTION: ' + err);
    }

    ifc.save(function(err, ifc) {
      // FIXXME: error handling if python version is not available!
      var executable = spawn('python3.4', ['/duraark-storage/tools/pyIfcExtract/buildm_extractor.py', ifc.path, extractor.schema]),
        rdfString = '';

      executable.stdout.on('data', function(data) {
        // console.log('stdout: ' + data);
        rdfString += data;
      });

      executable.stderr.on('data', function(data) {
        console.log('\nstderr:\n' + data);
        reject();
      });

      executable.on('close', function(code) {
        // console.log('child process exited with code ' + code);
        console.log('[PyIfcExtract::asJSONLD] RDF extraction finished, converting to JSON-LD ...');

        rdf.parseTurtle(rdfString, function(graph, err) {
          if (err) return console.log(err);

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
    });
  });
};
