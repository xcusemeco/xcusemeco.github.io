var geocoder = new google.maps.Geocoder();

var minutesDelayed;
var minutesExcused;
var waypoints;

function clearRouting() {
  minutesDelayed = parseInt(document.getElementById('time').value);
  minutesExcused = 0;
  waypoints = [];
  excusesUsed = [];
  availableExcuses = $.extend(true, {}, allExcuses);
}

function embiggenRoute(route) {
  _.each(route.legs, function(leg, index) {
    if (index < excusesUsed.length) {
      leg.duration.value = excusesUsed[index]["delayInMinutes"] * 60;
      leg.duration.text = formatExcuseDuration(excusesUsed[index]["delayInMinutes"]);
      leg.steps[leg.steps.length - 1].instructions += formatExcuse(excusesUsed[index]);
    }
    _.each(leg.steps, function(step) {
      if (minutesExcused < minutesDelayed)
        addExcuse(step);
    });
  });
}

function addExcuse(step) {
  var closestExcuse = excuseNear(step.start_location);
  minutesExcused += closestExcuse["delayInMinutes"];
  excusesUsed.push(closestExcuse);
  waypoints.push({ location: closestExcuse.location, stopover: true });
}

function excuseNear(location) {
  // A really naive search for the nearest excuse. We're defining close as smallest delta in lat + long
  var nearestExcuse = _.min(availableExcuses, function(excuse) {
    return google.maps.geometry.spherical.computeDistanceBetween(locationToLatLng(location), locationToLatLng(excuse["location"]), 1);
  });
  // Get rid of duplicates
  availableExcuses = _.reject(availableExcuses, function(excuse) { return excuse.id == nearestExcuse.id });
  return nearestExcuse;
}

function locationToLatLng(location) {
  return new google.maps.LatLng(location.k, location.A, true)
}

function formatExcuse(excuse) {
  return "<div style=padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;box-sizing:border-box;-moz-box-sizing:border-box;background:rgba(16,67,134,.2);color:#111;font-size:24px;line-height:30px;margin-top:10px;>" + excuse["description"] + " at " + excuse["name"] + "<br />" + excuse["text"] + "<br />" + flavor() + formatExcuseDuration(excuse["delayInMinutes"]) + " wasted!</div>";
}

function formatExcuseDuration(minutes) {
  // So gross but no time left!
  var formattedDuration = "";
  var days = Math.floor(minutes / 86400);
  if (days > 0) {
    minutes -= days * 86400;
    formattedDuration += days + " day";
    if (formattedDuration != 1) { formattedDuration += "s"; }
    formattedDuration += " ";
  };
  var hours = Math.floor(minutes / 60);
  if (hours > 0) {
    minutes -= hours * 60;
    formattedDuration += hours + " hour";
    if (formattedDuration != 1) { formattedDuration += "s"; }
    formattedDuration += " ";
  }
  if (minutes > 0) {
    formattedDuration += minutes + " minute";
    if (formattedDuration != 1) { formattedDuration += "s"; }
  }
  return formattedDuration;
}

function flavor() {
  return _.sample(["Nice! ", "Awwww yeeeaaah! ", "Shhhhh...", "Rad! ", "Cold blooded. ", "Sick. ", "Boom. ", "Procrastinacious! ", "Whatever. "]);
}
