/**
 * e57_metadata/index.js
 *
 * @description :: Javascript-binding for the 'e57_metadata@UBO' C++ tool
 */


var Promise = require("bluebird"),
  spawn = require('child_process').spawn,
  uuid = require('node-uuid'),
  path = require('path'),
  fs = require('fs'),
  js2xmlparser = require("js2xmlparser");

var _bypassExecutable = false;

var e57_metadata = module.exports = function() {}

e57_metadata.prototype.extractE57m = function(e57) {
  var extractor = this;

  return new Promise(function(resolve, reject) {
    // console.log('[e57_metadata::extractE57m] file: ' + e57.path); // TODO: use buyan's logger library!

    try {
      stats = fs.lstatSync(e57.path);
      if (!stats.isFile()) {
        console.log('[e57_metadata::extractE57m] ERROR: file "' + e57.path + '" does not exist');
        return reject('[e57_metadata::extractE57m] ERROR: file "' + e57.path + '" does not exist');
      }
    } catch (err) {
      console.log('[e57_metadata::extractE57m] ERROR checking file: "' + e57.path + '" does not exist');
      return reject('[e57_metadata::extractE57m] ERROR checking file: "' + e57.path + '" does not exist');
    }

    var outputFile = path.join('/tmp', uuid.v4() + '.json');
    // console.log('outputFile: ' + outputFile);

    if (_bypassExecutable) {
      var jsonString = null,
        testdataPath = process.cwd() + '/../testdata';
        fixtureJSONData = path.join(testdataPath, 'nygade-e57-metadata.json');

      // console.log('fixtureJSONData: ' + fixtureJSONData);

      try {
        jsonString = JSON.parse(fs.readFileSync(fixtureJSONData));
      } catch (err) {
        console.log('[e57_metadata::extractE57m] ERROR during file loading: ' + err);
        return reject('[e57_metadata::extractE57m] FILE EXCEPTION: ' + err);
      }

      var xmlString = extractor.json2xml(jsonString);
      return resolve(xmlString);
    } else {
      try {
        console.log('[e57_metadata::extractE57m] about to run: "e57metadata ' + e57.path + ' ' + outputFile + '"');

        var executable = spawn('e57_metadata', [e57.path, outputFile]);

        executable.stdout.on('data', function(data) {
          console.log('stdout: ' + data);
        });

        executable.stderr.on('data', function(err) {
          console.log('[e57_metadata::extractE57m] ERROR during program execution:\n\n' + err + '\n');
          return reject('[e57_metadata::extractE57m] ERROR during program execution:\n\n' + err);
        });

        executable.on('close', function(code) {
          if (code !== 1) { // 'e57metadata' return '1' on success
            console.log('[e57_metadata::extractE57m] ERROR: exited with code:' + code);
            return reject('[e57_metadata::extractE57m] ERROR: exited with code: \n\n' + code + '\n');
          }

          console.log('[e57_metadata::extractE57m] RDF extraction finished, converting to JSON-LD ...');

          var jsonString = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

          if (!jsonString) {
            console.log('[e57_metadata::extractE57m] Cannot read JSON output file: ' + outputFile);
            reject('[e57_metadata::extractE57m] Cannot read JSON output file: ' + outputFile);
          }

          var xmlString = extractor.json2xml(jsonString);

          if (!xmlString) {
            console.log('[e57_metadata::extractE57m] Cannot convert to XML output file: ' + outputFile);
            reject('[e57_metadata::extractE57m] Cannot convert to XML output file: ' + outputFile);
          }

          console.log('[e57_metadata::extractE57m]     ... finished');
          resolve(xmlString);
        });
      } catch (err) {
        console.log('[e57_metadata::extractE57m] ERROR on program start:\n\n' + err + '\n');
        return reject('[e57_metadata::extractE57m] ERROR on program start:\n\n' + err);
      }
    }
  });
};

e57_metadata.prototype.json2xml = function(json) {
  var input = json;

  //parse date in root
  var creation = json.e57_metadata.creation_datetime;
  input.e57_metadata.creation_datetime = new Date(creation.year, creation.month, creation.day, creation.hour, creation.minute, creation.seconds, (creation.seconds % 1) * 1000).toISOString();

  input.e57_metadata.version = json.e57_metadata.version_major + "." + json.e57_metadata.version_minor;

  for (i = 0; i < input.e57_metadata.scans.length; i++) {
    //parse dates for each scan
    var scan = input.e57_metadata.scans[i]

    var acquisition_start = scan.acquisition_start;
    scan.acquisition_start = new Date(acquisition_start.year, acquisition_start.month, acquisition_start.day, acquisition_start.hour, acquisition_start.minute, acquisition_start.seconds, (acquisition_start.seconds % 1) * 1000).toISOString();

    var acquisition_end = scan.acquisition_end;
    scan.acquisition_end = new Date(acquisition_end.year, acquisition_end.month, acquisition_end.day, acquisition_end.hour, acquisition_end.minute, acquisition_end.seconds, (acquisition_end.seconds % 1) * 1000).toISOString();

    //reorder guid and name are on the wrong position
    //further fixing the point_fields as they have no subobject in the json and some other minor naming stuff
    input.e57_metadata.scans[i] = {
      guid : scan.guid,
      name : scan.name,
      original_guids : scan.original_guids,
      description :scan.description,
      sensor_vendor: scan.sensor_vendor,
      sensor_model: scan.sensor_model,
      sensor_serial_number:scan.sensor_serial_number,
      sensor_hardware_version:scan.sensor_hardware_version,
      sensor_software_version:scan.sensor_software_version,
      sensor_firmware_version:scan.sensor_firmware_version,
      temperature:scan.temperature,
      relative_humidity:scan.relative_humidity,
      atmospheric_pressure:scan.atmospheric_pressure,
      acquisition_start:scan.acquisition_start,
      acquisition_end:scan.acquisition_end,
      pose : scan.pose,
      index_bounds:scan.index_bounds,
      cartesian_bounds:scan.cartesian_bounds,
      sphericalbounds: scan.spherical_bounds, //nice
      intensity_limits:scan.intensity_limits,
      color_limits:scan.color_limits,
      pointSize : scan.points_size, //yeah
      point_fields : {
        cartesian_fields : {
          cartesian_x_field : scan.point_fields.cartesian_x_field,
          cartesian_y_field : scan.point_fields.cartesian_y_field,
          cartesian_z_field : scan.point_fields.cartesian_z_field,
          cartesian_invalid_state_field : scan.point_fields.cartesian_invalid_state_field
        },
        spherical_fields: {
          spherical_range_field: scan.point_fields.spherical_range_field,
          spherical_elevation_field:scan.point_fields.spherical_elevation_field,
          spherical_azimuth_field:scan.point_fields.spherical_azimuth_field,
          spherical_invalid_state_field:scan.point_fields.spherical_invalid_state_field
        },
        point_range:{
          point_range_minimum : scan.point_fields.point_range_minimum,
          point_range_maximum : scan.point_fields.point_range_maximum,
          point_range_scaled_integer : scan.point_fields.point_range_scaled_integer
        },
        angles:{
          angle_minimum: scan.point_fields.angle_minimum,
          angle_maximum: scan.point_fields.angle_maximum,
          angle_scaled_integer: scan.point_fields.angle_scaled_integer
        },
        index_fields:{
          row_index_field: scan.point_fields.row_index_field,
          row_index_maximum: scan.point_fields.row_index_maximum,
          column_index_field: scan.point_fields.column_index_field,
          column_index_maximum: scan.point_fields.column_index_maximum,
          return_index_field: scan.point_fields.return_index_field,
          return_count_field: scan.point_fields.return_count_field,
          return_maximum: scan.point_fields.return_maximum
        },
        time_fields:{
          time_stamp_field: scan.point_fields.time_stamp_field,
          is_Time_Stamp_invalid: scan.point_fields.is_Time_Stamp_Invalid_field, //awesome
          time_Maximum: scan.point_fields.time_Maximum

        },
        intensity_color_fields:{
          intensity_field: scan.point_fields.intensity_field,
          is_intensity_invalid_field: scan.point_fields.is_intensity_invalid_field,
          intensity_scaled_integer: scan.point_fields.intensity_scaled_integer,
          color_red_field :scan.point_fields.color_red_field,
          color_green_field :scan.point_fields.color_green_field,
          color_blue_field: scan.point_fields.color_blue_field,
          is_color_invalid_field: scan.point_fields.is_color_invalid_field
        }
      }
    }

  }

  //parse dates for each image
  for (i = 0; i < input.e57_metadata.images.length; i++) {
      var acquisition_datetime = input.e57_metadata.images[i].acquisition_datetime;
      input.e57_metadata.scans[i].acquisition_datetime = new Date(acquisition_datetime.year, acquisition_datetime.month, acquisition_datetime.day, acquisition_datetime.hour, acquisition_datetime.minute, acquisition_datetime.seconds, (acquisition_datetime.seconds % 1) * 1000).toISOString();
  }

  //redirect nodes
  input.E57root = json.e57_metadata;
  input.e57scan = json.e57_metadata.scans;
  input.e57image = json.e57_metadata.images;

  //Reorder root because the xsd wants it ... ... ...
  input.E57root = {
    guid : input.E57root.guid,
    version : input.E57root.version,
    creation_datetime : input.E57root.creation_datetime,
    coordinate_metadata : input.E57root.coordinate_metadata,
    scan_count : input.E57root.scan_count,
    image_count : input.E57root.image_count,
    scan_size : input.E57root.scan_size,
    image_size : input.E57root.image_size
  }

  delete input.e57_metadata;
  delete input.E57root.scans;
  delete input.E57root.images;
  delete input.E57root.version_major;
  delete input.E57root.version_minor;

  var output = js2xmlparser("e57m", input);

  //console.log(js2xmlparser("E57root", input));

  return output;
};
