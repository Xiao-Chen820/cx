var map;
function init(){
	map = L.map("mapDiv").setView([30.5485,114.3288],20);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}',{foo:'bar'}).addTo(map);
	var url = 'http://134.175.72.35:2333/geoserver/gym_test/wms'
	const bounderLayer = L.tileLayer.wms(url,{
		//图层名称
		Layers:'gym_test:volunteerArea',
		//图层格式
		format:"image/png",
		//投影坐标系类型
		crs:L.CRS.EPSG4326,
		//透明度
		opacity:0.5,
		transparent:true,
	});
	
	var url = "http://134.175.72.35:2333/geoserver/gym_test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=gym_test%3AvolunteerArea&maxFeatures=50&outputFormat=application%2Fjson";
	
	function onEachFeature(feature,marker){
		marker.bindPopup('test successfully');
	}
	
	var volunteerAreaGeoJSON = L.geoJson(null,{
		//响应和回调函数
		onEachFeature: onEachFeature,
	}).addTo(map);
	
	$.ajax({
		url: url,
		dataType: 'json',
		outputFormat: 'text/javascript',
		success:function(data){
			volunteerAreaGeoJSON.addData(data);
		},
	});
	
	//openstreetmap底图
	var openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{Z}/{x}/{y}.png?{foo}',{foo:'bar'});//.addTo(map);
	
	//Tonermap地图
	var tonermap = L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                subdomains: 'abcd',
                maxZoom: 20,
                minZoom: 0,
                label: 'Toner',
                iconURL: '//stamen-tiles-a.a.ssl.fastly.net/toner/4/2/5.png'
           		});
    
    var mapboxstreet = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',{
		attribution:'Map data &copy;<a href="https://www.openstreetmap.org/">OpenStreetMap</a>contributors,<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,Imagery©<a href="https://www.mapbox.com/">MapBox</a>',
		maxZoom:18,
		id:'mapbox.streets',
		accessToken:'pk.eyJ1IjoiaG9qb2VtZSIsImEiOiJjazI2MGJrZG4wYThlM2hzMHhiNHJxY2NhIn0.gQL14Cx1lg4FlD7-oD2sQw'
	});
	
	var GoogleMap = L.tileLayer.chinaProvider('Google.Normal.Map',{//谷歌地图
		maxZoom:18,minZoom:4
	}),
	
	Googlesatellite = L.tileLayer.chinaProvider('Google.Satellite.Map',{//谷歌影像
		maxZoom:18,minZoom:4
	});
	//高德地图
	var Gaode = L.tileLayer.chinaProvider('GaoDe.Normal.Map',{//高德地图
		maxZoom:18,minZoom:4
	});
	
	//Watercolormap地图
    var watercolormap = L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                subdomains: 'abcd',
                maxZoom: 16,
                minZoom: 1,
                label: 'Watercolor'
           });
           		
    /*var leftSidebar = new L.control.sidebar('sidebar-left', {
            position: 'left'
        });
        
        map.addControl(leftSidebar);

        var rightSidebar = L.control.sidebar('sidebar-right', {
            position: 'right'
        });
        map.addControl(rightSidebar);

        setTimeout(function () {
            leftSidebar.toggle();
        }, 500);

        setTimeout(function () {
            rightSidebar.toggle();
        }, 2500);

        setInterval(function () {
            leftSidebar.toggle();
        }, 5000);

        setInterval(function () {
            rightSidebar.toggle();
        }, 7000);*/
  
    /*var osm = L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    			minZoom: 0, 
    			maxZoom: 18, 
    			attributions: 'Map data &copy; OpenStreetMap contributors'
    			});*/
    
    
	
	var baseMaps = {
		"OpenstreetMap":openstreetmap,
		"Tonermap":tonermap,
		"MapboxStreets":mapboxstreet,
		"谷歌地图":GoogleMap,
		"谷歌影像":Googlesatellite,
		"高德地图":Gaode,
		"Watercolormap":watercolormap,
		/*"Osmmap":osm,*/
	};
	
	var overlayMaps = {
		"第二层":volunteerAreaGeoJSON,
	};
	
	L.control.layers(baseMaps,overlayMaps).addTo(map);
	
	var miniMap = new L.Control.MiniMap(watercolormap, {
			centerFixed: [30.5485,114.3288],
			zoomLevelFixed: 15
		}).addTo(map);
	
	L.control.mousePosition().addTo(map);
	//var miniMap = new L.Control.MiniMap(osm, { toggleDisplay: true }).addTo(map);
}
