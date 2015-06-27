/**
 * PyIfcExtract/app.js
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

PyIfcExtract.prototype.asJSONLD = function(ifc, res) {
  var extractor = this;

  return new Promise(function(resolve, reject) {
    console.log('[PyIfcExtract::asJSONLD] file: ' + ifc.path);
    console.log('                         schema: ' + extractor.schema);

    try {
      stats = fs.lstatSync(ifc.path);
      if (!stats.isFile()) {
        return reject('[PyIfcExtract::asJSONLD] ERROR: file "' + ifc.path + '" does not exist');
      }
    } catch (err) {
      return reject('[PyIfcExtract::asJSONLD] FILE EXCEPTION: ' + err);
    }

    try {
      var executable = spawn('python3.4', ['/duraark-storage/tools/pyIfcExtract/buildm_extractor.py', ifc.path, extractor.schema]),
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
