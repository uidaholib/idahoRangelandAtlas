/* For ESRI Javascript API 4.0
	
	Query and draw results based on data from ArcGIS Server, both on
	a map and in the various visualizations.
	
	Written by Bruce Godfrey and Jeremy Kenyon, Univ. of Idaho, 2016
	
	Cached SMA/NLCD Join Layer: https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_2011_tiled/MapServer
*/
	require([
		"esri/Map",
		"esri/config",
		"esri/views/MapView",
		"esri/layers/FeatureLayer",
		"esri/layers/GraphicsLayer",
		"esri/layers/TileLayer",
		"esri/tasks/QueryTask",
		"esri/tasks/support/Query",
		"esri/symbols/SimpleFillSymbol",
		"esri/renderers/SimpleRenderer",
		"esri/renderers/UniqueValueRenderer",
        "esri/layers/ImageryLayer",
        "esri/layers/support/RasterFunction",
		"esri/Graphic",
		"dojo/_base/array",
		"dojo/dom",
		"dojo/on",
		"dojo/domReady!"
	], function (Map, esriConfig, MapView, FeatureLayer, GraphicsLayer, TileLayer, QueryTask, Query, SimpleFillSymbol, SimpleRenderer, UniqueValueRenderer, ImageryLayer, RasterFunction, Graphic, arrayUtils, dom, on, ready) {
		
		// Fixes CORS problems
		esriConfig.request.corsDetection = false;
	
		var hid = new UniqueValueRenderer({
			field: "NAME",
			defaultSymbol: new SimpleFillSymbol({
				color: [255,255,255,0]
			})
		});
				
		//Creates county boundaries layer
		var countyLayer = new FeatureLayer({
			url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/ira_2014_county_boundaries/MapServer/0",
			id: "counties",
			outFields: ['*'],
			opacity: 0.7,
			renderer: hid
		});
		
		//Sets up graphics layer to be drawn in response to queries
		var resultsLyr = new GraphicsLayer({
			opacity: 0.7
		});
		
		var cacheLyr = new TileLayer({
			url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_2011_tiled/MapServer",
			opacity: 0.7
		});
		
		// Basic map with above layers
		var map = new Map({
			basemap: "topo",
			layers: [countyLayer, resultsLyr]
		});
		
		// Basic view parameters for the map
		var view = new MapView({
			container: "mapCanvas",
			map: map,
			center: [-115, 45.6],
			zoom: 7
		});
		
		var blm = new SimpleFillSymbol({
			color: [232, 16, 20, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var priv = new SimpleFillSymbol({
			color: [250, 141, 52, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var usfs = new SimpleFillSymbol({
			color: [252, 164, 63, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var bia = new SimpleFillSymbol({
			color: [231, 237, 111, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var bor = new SimpleFillSymbol({
			color: [71, 155, 191, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var coe = new SimpleFillSymbol({
			color: [177, 204, 145, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var doe = new SimpleFillSymbol({
			color: [215, 227, 125, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var doi = new SimpleFillSymbol({
			color: [247, 122, 45, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var faa = new SimpleFillSymbol({
			color: [140, 184, 164, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var gsa = new SimpleFillSymbol({
			color: [120, 173, 173, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var hstrcwtr = new SimpleFillSymbol({
			color: [40, 146, 199, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var ir = new SimpleFillSymbol({
			color: [252, 207, 81, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var lu_doi = new SimpleFillSymbol({
			color: [252, 186, 71, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var lu_usda = new SimpleFillSymbol({
			color: [198, 217, 134, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var mil = new SimpleFillSymbol({
			color: [245, 99, 37, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var nps = new SimpleFillSymbol({
			color: [242, 77, 31, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var nwr = new SimpleFillSymbol({
			color: [160, 194, 155, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});

		var state = new SimpleFillSymbol({
			color: [237, 54, 26, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});		
		
		var statefg = new SimpleFillSymbol({
			color: [250, 250, 100, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var stateoth = new SimpleFillSymbol({
			color: [96, 163, 181, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		var statepr = new SimpleFillSymbol({
			color: [252, 231, 91, .9],
			style: "solid",
			outline: {  // autocasts as esri/symbols/SimpleLineSymbol
				color: "gray",
				width: .1
			}			
		});
		
		// Land Management Web Service (also Land Cover)
		var qTask = new QueryTask({
				url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/idaho_rangeland_2011/MapServer/0"
			});
		
		// General parameters for any query
		var params = new Query({
			returnGeometry: true,
			outFields: ["*"]
		});
	
		// Executes each time the button is clicked    
      function doQuery(name, choice) {
        // Clear the results from a previous query
        resultsLyr.removeAll();
        /*********************************************
         *
         * Set the where clause for the query. If "Name", "is", and "LATAH COUNTY" 
         * are selected, then the following SQL where clause is built here:
         * 
         * params.where = "CNTY_NAME = 'LATAH COUNTY";  
         *
         **********************************************/
        params.where = "CNTY_NAME = " + "'" + name +"'";

        // executes the query and calls getResults() once the promise is resolved
        // promiseRejected() is called if the promise is rejected
        qTask.execute(params)
          .then(getResults)
          .otherwise(promiseRejected);

        }  //End do query

      // Called each time the promise is resolved    
      function getResults(response) {
        console.log("Got results.");
        // Loop through each of the results and assign a symbol and PopupTemplate
        // to each so they may be visualized on the map
        var featureResults = arrayUtils.map(response.features, function(
          feature) {
          foo = feature;
          return feature;
        });
        
         // animate to the results after they are added to the map  
        view.goTo(featureResults);
          
        var clipRF = new RasterFunction({
          functionName: "Clip",
          functionArguments: {
            ClippingGeometry : foo.geometry,    //a polygon or envelope
            ClippingType : 1,                           //int (1= clippingOutside, 2=clippingInside), use 1 to keep image inside of the geometry
            raster: "$$"
          }
        });
  
        var layer = new ImageryLayer({
          url: "https://gis-sandbox.northwestknowledge.net/arcgis/rest/services/idaho_rangeland_atlas/bruce_test6/ImageServer",
          renderingRule: clipRF,
        });
      
        map.layers.add(layer);
      
        var rasterAttributes;
        layer.then(function() {
          rasterAttributes = layer.rasterAttributeTable.features;
          
          var tbl = html.byId("raTable");
          arrayUtil.map(rasterAttributes, lang.hitch(this, function(item, i){
              
            
            //var countyName = item.attributes.cnty_name;
            //if (countyName === "LATAH COUNTY") {
            if (item.attributes.cnty_name === value.value) {
            
              var row = tbl.insertRow(tbl.rows.length);
              var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(1);
              var cell3 = row.insertCell(2);
              var cell4 = row.insertCell(3);
              cell1.innerHTML = item.attributes.sma_name;
              cell2.innerHTML = item.attributes.per_rng.toFixed(2);
              cell3.innerHTML = item.attributes.per_cnty.toFixed(2);
              cell4.innerHTML = item.attributes.area_ac.toFixed(2);
          
            }
          }));  
        });


      }   //End getResults
		
		function getCounty(evt, selection) {
			var qCnty = new Query();
			qCnty.returnGeometry = false;
			qCnty.outFields = ["NAME"];
			qCnty.geometry = evt;
			countyLayer.queryFeatures(qCnty).then(function(results){
				doQuery(results.features[0].attributes.NAME, selection);
				$('#valSelect').val('Choose a County...');
				console.log(results);
			}).otherwise(promiseRejected);
		}
		
		// County Names are in Caps.  This converts them to Title Case for display.
		function fixHeading(head) {
			var h = head.toLowerCase();
			var hE = h.toTitleCase();
			$(".resultHead").html("<h3>"+ hE +"</h3>");
		}

		
		//This returns and renders Land Management Results
		function getLMResults(response) {
			
			var peakResults = arrayUtils.map(response.features, function(feature) {
				if (feature.attributes.AGNCY_NAME === "BLM") {
					feature.symbol = blm;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "PRIVATE") {
					feature.symbol = priv;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "USFS") {
					feature.symbol = usfs;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "BIA") {
					feature.symbol = bia;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "BOR") {
					feature.symbol = bor;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "COE") {
					feature.symbol = coe;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "DOE") {
					feature.symbol = doe;
					return feature;					
				} else if (feature.attributes.AGNCY_NAME === "DOI") {
					feature.symbol = doi;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "FAA") {
					feature.symbol = faa;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "HSTRCWTR") {
					feature.symbol = hstrcwtr;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "IR") {
					feature.symbol = ir;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "LU_DOI") {
					feature.symbol = lu_doi;
					return feature;
				} else if (feature.attributes.AGNCY_NAME === "LU_USDA") {
					feature.symbol = lu_usda;
					return feature;	
				} else if (feature.attributes.AGNCY_NAME === "MIL") {
					feature.symbol = mil;
					return feature;	
				} else if (feature.attributes.AGNCY_NAME === "NPS") {
					feature.symbol = nps;
					return feature;	
				} else if (feature.attributes.AGNCY_NAME === "NWR") {
					feature.symbol = nwr;
					return feature;	
				} else if (feature.attributes.AGNCY_NAME === "STATE") {
					feature.symbol = state;
					return feature;	
				} else if (feature.attributes.AGNCY_NAME === "STATEFG") {
					feature.symbol = statefg;
					return feature;		
				} else if (feature.attributes.AGNCY_NAME === "STATEOTH") {
					feature.symbol = stateoth;
					return feature;	
				} else if (feature.attributes.AGNCY_NAME === "STATEPR") {
					feature.symbol = statepr;
					return feature;					
				} else {
					feature.symbol = new SimpleFillSymbol({
						color: [232, 16, 20, .9],
						style: "solid",
						outline: { 
							color: "gray",
							width: .1
						}			
					});
					return feature;
				}
			});
			resultsLyr.addMany(peakResults); 
			view.goTo(peakResults);
			
			// Data Table
			
			var tbHead = "<thead><tr><th class='header legend'></th><th class='header'>Manager</th><th class='header' >% of Rangeland</th><th class='header' >% of County</th><th class='header' >Acreage (in acres)</th></tr></thead>";
			var results = "";
			console.log(peakResults);
			
			
			for (i=0;i<peakResults.length;i++) {
				var g = peakResults[i].attributes;
				var perRng = g.PEROFRNG.toFixed(2);
				var perCty = g.PEROFCNTY.toFixed(2);
				if (perRng > 0) {
					var clr = '';
					if (g.AGNCY_NAME == 'BIA') {
						clr = '#ed6f60';
					} else if (g.AGNCY_NAME == 'BLM') {
						clr = '#e81014';
					} else if (g.AGNCY_NAME == 'BOR') {
						clr = '#b59bbf';
					} else if (g.AGNCY_NAME == 'COE') {
						clr = '#B1CC91';
					} else if (g.AGNCY_NAME == 'DOE') {
						clr = '#7DD7E3';
					} else if (g.AGNCY_NAME == 'DOI') {
						clr = '#f77a2d';
					} else if (g.AGNCY_NAME == 'FAA') {
						clr = '#8ca4b8';
					} else if (g.AGNCY_NAME == 'GSA') {
						clr = '#78adad';
					} else if (g.AGNCY_NAME == 'HSTRCWTR') {
						clr = '#2892c7';
					} else if (g.AGNCY_NAME == 'IR') {
						clr = '#fccf51';
					} else if (g.AGNCY_NAME == 'LU_DOI') {
						clr = '#fcba47';
					} else if (g.AGNCY_NAME == 'LU_USDA') {
						clr = '#c6d986';
					} else if (g.AGNCY_NAME == 'MIL') {
						clr = '#f56325';
					} else if (g.AGNCY_NAME == 'NPS') {
						clr = '#f24d1f';
					} else if (g.AGNCY_NAME == 'NWR') {
						clr = '#a0c29b';
					} else if (g.AGNCY_NAME == 'PRIVATE') {
						clr = '#fa8d34';
					} else if (g.AGNCY_NAME == 'STATE') {
						clr = '#ed361a';
					} else if (g.AGNCY_NAME == 'STATEFG') {
						clr = '#fafa64';
					} else if (g.AGNCY_NAME == 'STATEOTH') {
						clr = '#60a3b5';
					} else if (g.AGNCY_NAME == 'STATEPR') {
						clr = '#fce75b';
					} else if (g.AGNCY_NAME == 'USFS') {
						clr = '#fca43f';
					} else {
						clr = '#E81014';
					}
					results += "<tr><td class='dlegend' style='background-color:"+ clr +";'>&nbsp;</td><td>" + g.AGNCY_NAME + "</td><td>" + perRng + "</td><td>" + perCty + "</td><td>" + g.GIS_ACRES + "</td></tr>";
				} else {
					continue;
				}
			}
			var county = g.CNTY_NAME; // We're using 'g' out of scope?
			fixHeading(county);
			$(".tableDiv").html("<table id='table' class='table' cellspacing='0'>" + tbHead + "<tbody>" + results + "</tbody></table>");
			
			$(function(){
				$('#table').tablesorter({
					sortList: [[2,1]]
				}); 
			});
			
		} //close getLMResults
		
		// General response to query failures
		function promiseRejected(err) {
			console.error("Promise rejected: ", err.message);
		}
		
		// Turns on querying by drop-down and by map click
		function activateOptions(choice) {
				$('#valSelect').change(function() {
					doQuery(this.value, choice);
				});
				view.on("click", function(evt){getCounty(evt.mapPoint, choice);});
		}
		
		// Based on nav menu, load a corresponding results page
		function loadResultsPage(selection) {	
			fetch('./resultsPages.json').then(function(response) {
				return response.json();
			}).then(function(sheep) {
				for (var i = 0; i < sheep.pages.length; i++) {
					if (selection == sheep.pages[i].heading){
						$('.left-region').children('.heading').text(sheep.pages[i].heading);
						$('.left-region').children('.description').text(sheep.pages[i].intro);
						$('.left-region').children('#descMore').text(sheep.pages[i].appendix).addClass('collapse');
					} else {
						continue;
					}
				}
			}).catch(function(error) {
				console.log(error.message);
			});
			activateOptions(selection);
		}
		
		// Selects a menu option and loads results pages
		$('.butn').click(function() {
			var choice = $(this).children('span').text();
			loadResultsPage(choice);
		});
		
		function reset() {
			$('.left-region').children('#descMore').addClass('collapse');
			resultsLyr.removeAll();
			view.goTo({
				center: [-115, 45.6],
				zoom: 7
			});
			$('#valSelect').val('Choose a County...');
			$('.resultHead').text("");
			$(".tableDiv").html('<div class="instruct"><p>Select a county on the right</p></div>');
			if ($('.left-region').hasClass('show')) {
				$('.nav-main').removeClass('hide').addClass('show');
				$('.left-region').removeClass('show').addClass('hide');
			}
		}
		
		// Reset the results page and map and return to the menu page
		$(".back-btn").click(reset);
		
		// Create the dropdown menu for the map		
		var cts = ['ADA', 'ADAMS', 'BANNOCK', 'BEAR LAKE', 'BENEWAH', 'BINGHAM', 'BLAINE', 'BONNER', 'BONNEVILLE', 'BOUNDARY', 'BUTTE', 'CAMAS', 'CANYON', 'CARIBOU', 'CASSIA', 'CLARK', 'CLEARWATER', 'CUSTER', 'ELMORE', 'FRANKLIN', 'FREMONT', 'GEM', 'GOODING', 'IDAHO', 'JEFFERSON', 'JEROME', 'KOOTENAI', 'LATAH', 'LEMHI', 'LEWIS', 'LINCOLN', 'MADISON', 'MINIDOKA', 'NEZ PERCE', 'ONEIDA', 'OWYHEE', 'PAYETTE', 'POWER', 'SHOSHONE', 'TETON', 'TWIN FALLS', 'VALLEY', 'WASHINGTON'];

		var sct = "<option>Choose a County...</option>";
		for (i=0;i<cts.length;i++) {
			sct += "<option value='" + cts[i] + " COUNTY'>" + cts[i] + "</option>";
		}
		$('#valSelect').html(sct);

		function init() {
			var loading = dom.byId("loadingImg");
			if (view.ready === false){
				on(view, "update-start", showLoading);
			} else {
				on(view, "update-end", hideLoading);
			}
		}
		
		function showLoading() {
			esri.show(loading);
			map.disableMapNavigation();
			map.hideZoomSlider();
		}

		function hideLoading(error) {
			esri.hide(loading);
			map.enableMapNavigation();
			map.showZoomSlider();
		}

		$().ready(init);
		
	}); //all map function in ESRI require