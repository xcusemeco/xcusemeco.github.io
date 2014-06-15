var service;
var excuseId;
var pendingExcuses; // Fuzzy locations from sources
var allExcuses; // Excuses from pending once a maps latlng is added
var availableExcuses; // Starts as an allExcuses clone. Empties in excusesUsed as we calculate
var excusesUsed; // Excuses that we're using for the route

function loadExcuses() {
  service = new google.maps.places.PlacesService(map);
  excuseId = 0;
  pendingExcuses = [];
  allExcuses = [];
  availableExcuses = [];
  excusesUsed = [];
  imagineBullshitExcuses();
  findRealExcuses();
}

function imagineBullshitExcuses() {
  pendingExcuses = [
    {
      name: "The Meatball Shop",
      address: "The Meatball Shop",
      location: "",
      description: "Dropped balls",
      text: "Many dropped meatball related injuries on Greenwich Ave",
      delayInMinutes: 10
    },
    {
      name: "OTTO pizzeria",
      address: "OTTO pizzeria",
      location: "",
      description: "Free pizza",
      text: "Protest to free the pizza in Washington Square Park",
      delayInMinutes: 15
    },
    {
      name: "Santos Party House",
      address: "Santos Party House",
      location: "",
      description: "Knife Fight",
      text: "Two homeless guys came up and asked for money at the same time and got into a knife fight in front of me.",
      delayInMinutes: 35
    },
    {
      name: "Burger King, NYC",
      address: "Burger King, NYC",
      location: "",
      description: "Burger King",
      text: "I stopped into a Burger King to pick up food and the place got robbed.",
      delayInMinutes: 35
    },
    {
      name: "Indian Point Energy Center",
      address: "Indian Point Energy Center",
      location: "",
      description: "Indian Point Energy Center",
      text: "The nuclear power plant upstate melted down and my route was filled with mutant cannibals.",
      delayInMinutes: 90
    },
    {
      name: "Father Day Lunch",
      address: "Father Day Lunch",
      location: "",
      description: "Times Square",
      text: "I literally hurt myself fake laughing at all my dad’s terrible jokes.",
      delayInMinutes: 45
    },
    {
      name: "NYU Romance",
      address: "NYU Romance",
      location: "",
      description: "NYU",
      text: "I walked by a school when I saw a kid crying. So I stopped for ten minutes and it turned out he was having girl problems. I gave him some of my homespun wisdom that really changed his life forever. No big deal, it doesn’t make me a hero or nothing.",
      delayInMinutes: 10
    },
    {
      name: "Union Square Ice Cream",
      address: "Union Square Ice Cream",
      location: "",
      description: "Union Square",
      text: "An ice cream truck pulled up next to Union Square as I was walking past, and I got blocked by a mob of little kids.",
      delayInMinutes: 20
    },
    {
      name: "Candy Broadway",
      address: "Candy Broadway",
      location: "",
      description: "Candy Broadway",
      text: "I walked past a public school and a bunch of kids stopped me to try to sell me candy to raise money for their basketball team.",
      delayInMinutes: 10
    },
    {
      name: "nyc public schools",
      address: "nyc public schools",
      location: "",
      description: "NYU",
      text: "I walked past a school just as the cops busted a teacher for selling weed to kids.",
      delayInMinutes: 14
    },
    {
      name: "Driving Police Stop 6th Ave",
      address: "Driving Police Stop 6th Ave",
      location: "",
      description: "Driving Police Stop 6th Ave",
      text: "A school bus stopped with its lights flashing, and stayed there for twenty minutes. I was about to drive past when a cop car pulled up behind me.",
      delayInMinutes: 30
    },
    {
      name: "School Bus Crash",
      address: "School Bus Crash",
      location: "",
      description: "School Bus Crash",
      text: "I was driving past a school just as the school bus crashed into the car ahead of it. I had to help evacuate the kids and make sure they were okay. No big deal, I didn’t even stick around because I’m not looking for a medal or anything.",
      delayInMinutes: 58
    },
    {
      name: "Bus handicap brooklyn",
      address: "Bus handicap brooklyn",
      location: "",
      description: "Bus handicap brooklyn",
      text: "Three separate people in wheelchairs had to get on my bus, one stop after another, and they all got off two stops later.",
      delayInMinutes: 49
    },
    {
      name: "Queens Bus Fight",
      address: "Queens Bus Fight",
      location: "",
      description: "Queens Bus Fight",
      text: "A taxi was parked in a bus stop and the bus driver got out and got into a fight with the taxi driver.",
      delayInMinutes: 24
    },
    {
      name: "Old Lady NYC hospital",
      address: "Old Lady NYC hospital",
      location: "",
      description: "School Bus Crash",
      text: "An old lady sitting next to me had a heart attack on the bus. I had to sit there with her until she the paramedics came",
      delayInMinutes: 42
    },
    {
      name: "School Bus Crash",
      address: "School Bus Crash",
      location: "",
      description: "School Bus Crash",
      text: "The bus I was on broke down, and a tow truck had to come and get it. Then the tow truck broke down and stopped traffic. So then a tow truck came to get the tow truck and the bus, and that broke down. I think it’ll be on the news tonight.",
      delayInMinutes: 89
    },
    {
      name: "34th Street Subway Fight",
      address: "34th Street Subway Fight",
      location: "",
      description: "34th Street Subway Fight",
      text: "I got out of my seat to give it to  a pregnant lady, and this guy stole it. Even though he was twice my size, I felt like I couldn’t just stand by and let that happen. Long story short, he apologized.",
      delayInMinutes: 58
    }
  ];
  pinpointExcuses();
}

function findRealExcuses() {
  findNyCalendarExcuses();
  findMLAExcuses();
}

function findMLAExcuses(){
  function reqListener () {
    txt = this.responseText;
    if (window.DOMParser)
    {
    parser=new DOMParser();
    xmlDoc=parser.parseFromString(txt,"text/xml");
    }
  else // Internet Explorer
    {
    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async=false;
    xmlDoc.loadXML(txt);
    }
    console.log(xmlDoc.getElementsByTagName("name")[0].innerHTML);
    console.log(xmlDoc.getElementsByTagName("status")[0].innerHTML);
    console.log(xmlDoc.getElementsByTagName("text")[0].innerHTML);
  }
  var oReq = new XMLHttpRequest();
  oReq.onload = reqListener;
  oReq.open("get", "data/serviceStatus.txt", true);
  oReq.send();

}

function findNyCalendarExcuses() {
  $.ajax({
    url: "https://api.cityofnewyork.us/calendar/v1/search.htm?app_id=42f90643&app_key=84cb038ba9b973f9f117c6b8d60af69b&startDate=06%2F13%2F2014+01%3A00+AM&endDate=06%2F14%2F2014+11%3A00+PM",
    dataType: 'jsonp',
    success: function(data){
      _.each(data.items, function(potentialExcuse) {
        pendingExcuses.push({
          name: potentialExcuse.name,
          address: potentialExcuse.address,
          description: potentialExcuse.location,
          text: potentialExcuse.shortDesc,
          delayInMinutes: Math.floor((Math.random() * 90) + 1)
        });
      });
      pinpointExcuses();
   }
  });
}

function pinpointExcuses() {
  _.each(excuseBatches(), function(batch, index) {
    // We can only run 10 google maps queries per second. Add .250 seconds to fuzz for overlap.
    window.setTimeout(function(batch) {
      pinpointExcuseBatch(batch);
    }, index * 4000, batch);
  })
}

function pinpointExcuseBatch(batch) {
  // Search for excuses by name and record the exact latitude/longitude if we find a match
  _.each(batch, function(excuse) {
    if (excuse.location == "") {
      var request = { query: excuse["name"], location: manhattan, radius: 100 }
      service.textSearch(request, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          excuse["id"] = ++excuseId;
          excuse["location"] = locationToLatLng(results[0].geometry.location);
          allExcuses.push(excuse);
          availableExcuses.push(excuse);
        }
      });
    }
  });
}

function excuseBatches() {
  var batches = [];
  pendingExcuses = _.reject(pendingExcuses, function(excuse, index) {
    if (index % 10 == 0) { batches[batches.length] = []; }
    batches[batches.length - 1].push(excuse);
    return true;
  });
  return batches;
}
