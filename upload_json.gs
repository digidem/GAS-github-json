// This function is run every time the spreadsheet is updated.
// It will save a property on `ScriptProperties` with an array of every sheet
// which has been edited since the last sync with Github
function onUpdated(e) {
  
  // Get the id of the spreadsheet that has been updated
  var spreadsheetId = e.source.getId();
  
  // Store the spreadsheet id
  ScriptProperties.setProperty('spreadsheetId', spreadsheetId);
  
  // Get the stringified JSON object with the array of sheet names
  var sheets = ScriptProperties.getProperty('sheets');
  sheets = (sheets) ? JSON.parse(sheets) : { names: [] };
  
  // Get the name of the sheet that has been edited
  var sheetName = e.range.getSheet().getName();
  
  // If the edited sheet is not in the list of sheetnames, add it to that array
  if (!_.contains(sheets.names, sheetName)) sheets.names.push(sheetName);
  
  // now store the updated list of sheetnames.
  ScriptProperties.setProperty('sheets', JSON.stringify(sheets));
  
}

// This runs every 5 minutes and will save any updated (edited) sheets to Github
function updateGithub() {
  
  // Read the saved properties and then delete them
  var spreadsheetId = ScriptProperties.getProperty('spreadsheetId');
  var sheets = ScriptProperties.getProperty('sheets');
  ScriptProperties.deleteAllProperties();
  
  // If nothing has been edited (indicated by no properties being saved) just noop
  if (!spreadsheetId || !sheets) return;
  
  // Access the spreadsheet object that has been edited
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);

  // Loop through each edited sheet
  JSON.parse(sheets).names.forEach(function(name) {  
    
    // Create a Github object
    var github = new Github({token: 'GITHUB PERSONAL TOKEN FROM https://github.com/settings/applications'});
    
    // Access the clearwater map repo
    var repo = github.getRepo('GITHUB USERNAME', 'REPO NAME');
    
    // Get the sheet id and name
    var sheet = spreadsheet.getSheetByName(name);
    var sheetId = sheet.getSheetId();
    var sheetName = sheet.getSheetName();
    var offset = 0
    
    if (sheet.getRange(1,1).getValue() === "preview") offset = 1;
    
    var range = sheet.getRange(1, 1 + offset, sheet.getLastRow(), sheet.getLastColumn()-offset);
    
    var geojson = parse(range.getValues());
    
    Logger.log("updating " + sheetName);
    
    // Write the CSV to github as a new commit
    var filename = 'data/' + sheetName.toLowerCase() + '.geojson';
    repo.write('gh-pages', filename, JSON.stringify(geojson), 'Update to ' + filename + ' at: ' + new Date().toTimeString(), function(err) { Logger.log(err) } );
    
  });
}

function deleteProps() {
  ScriptProperties.deleteAllProperties();
}

function getProps() {
  Browser.msgBox(JSON.stringify(ScriptProperties.getProperties()));
}

function parse(arr) {
  var keys = arr[0];
  var value;
  var geojson = {
    type: "FeatureCollection",
    features: []
  };
  var feature, props;
    
  
  for (var i=1; i < arr.length; i++) {
    feature = {
      type: 'Feature',
      properties: {}
    };
    props = 0
    for (var j=0; j < arr[0].length; j++) {
      value = arr[i][j]
      if (value) {
        props++
        if (keys[j] === "_geom") {
          feature.geometry = JSON.parse(value);
        } else {
          if (typeof value === "object") value = value.toDateString();
          feature.properties[keys[j]] = value;
        }
      }
    }
    if (props) {
      geojson.features.push(feature);
    }
  }
  
  return geojson;
}
      
