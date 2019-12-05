var map;
function init(){
	map = L.map("map").setView([22.7900,113.4949],9);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}',{foo:'bar'}).addTo(map);
	//服务地址
	var url ='http://localhost:8081/geoserver/LightWebGIS/wms'
	//构建图层属性
	const bounderLayer = L.tileLayer.wms(url,{
		//图层名称
		Layers:'LightWebGIS:GDP_Polygon',
		//图层格式
		format:"image/png",
		//投影坐标系类型
		crs:L.CRS.EPSG4326,
		//透明度
		opacity:0.5,
		transparent:true,
	});
	//地名解析与查询定位控件
	map.addControl( new L.Control.Search({
		url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
		jsonpParam: 'json_callback',
		propertyName: 'display_name',
		//搜索提示Tips
		textPlaceholder: '地名查询搜索…',
		propertyLoc: ['lat','lon'],
		marker: L.circleMarker([0,0],{radius:30}),
		autoCollapse: true,
		autoType: false,
		minLength: 2
	}) );
	
	//Search_Polygons边界GeoJSON服务完整路径
	var url = "http://localhost:8081/geoserver/LightWebGIS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=LightWebGIS%3AGDP_Polygon&maxFeatures=50&outputFormat=application%2Fjson";
	
	function onEachFeature(feature,marker){
		var gdp = [feature.properties.GDP1,feature.properties.GDP2,feature.properties.GDP3,feature.properties.GDP4,feature.properties.GDP5,feature.properties.GDP6,feature.properties.GDP7,feature.properties.GDP8,feature.properties.GDP9,feature.properties.GDP10];
		var pop = [feature.properties.population1,feature.properties.population2,feature.properties.population3,feature.properties.population4,feature.properties.population5,feature.properties.population6,feature.properties.population7,feature.properties.population8,feature.properties.population9,feature.properties.population10];
		var tem = feature.properties.temperature;
		var ele = feature.properties.elevation;
		var content =
		'<div style = "width:600px;height:450px;"><div style = "width: 600px;height: 200px;" id = "popupwindow1"></div> <div style = "width: 260px;height: 250px;float:left;margin-right: 10px;" id = "popupwindow2"></div>  <div style = "width: 330px;height: 250px;float: left;;" id = "popupwindow3"></div></div>';
		marker.bindPopup(content,{maxWidth: 560});
		marker.on('popupopen',function(e){
			var myChart1 = echarts.init(document.getElementById('popupwindow1'));
			var myChart2 = echarts.init(document.getElementById('popupwindow2'));
			var myChart3 = echarts.init(document.getElementById('popupwindow3'));
			showLineChart(gdp,myChart1);
			showPieChart(pop,myChart2);
			showRadarChart(gdp,pop,tem,ele,myChart3);
		});
	};
	
	function showLineChart(gdp,myChart){
		option = {
			title: {
				text: "近十年GDP变化",
				left: 'center'
			},
    		xAxis: {
        		type: 'category',
        		data: ['2009', '2010', '2011','2012','2013','2014','2015','2016','2017','2018']
    		},
    		yAxis: {
        		type: 'value'
    		},
    		series: [{
        		data: [gdp[0], gdp[1], gdp[2],gdp[3],gdp[4],gdp[5],gdp[6],gdp[7],gdp[8],gdp[9],gdp[10]],
        		type: 'line'
    		}]
		};
		myChart.clear();
		myChart.setOption(option);
	};
	
	function showPieChart(pop,myChart){
		option = {
		    backgroundColor: '#2c343c',
		
		    title: {
		        text: '近十年人口变化图',
		        left: 'center',
		        top: 10,
		        textStyle: {
		            color: '#ccc'
		        }
		    },
		
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		
		    visualMap: {
		        show: false,
		        min: 80,
		        max: 600,
		        inRange: {
		            colorLightness: [0, 1]
		        }
		    },
		    series : [
		        {
		            name:'人口基数',
		            type:'pie',
		            radius : '55%',
		            center: ['50%', '50%'],
		            data:[
		                {value:pop[0], name:'2009'},
		                {value:pop[1], name:'2010'},
		                {value:pop[2], name:'2011'},
		                {value:pop[3], name:'2012'},
		                {value:pop[4], name:'2013'},
		                {value:pop[5], name:'2014'},
		                {value:pop[6], name:'2015'},
		                {value:pop[7], name:'2016'},
		                {value:pop[8], name:'2017'},
		                {value:pop[9], name:'2018'},
		                {value:pop[10], name:'2019'}
		            ].sort(function (a, b) { return a.value - b.value; }),
		            roseType: 'radius',
		            label: {
		                normal: {
		                    textStyle: {
		                        color: 'rgba(255, 255, 255, 0.3)'
		                    }
		                }
		            },
		            labelLine: {
		                normal: {
		                    lineStyle: {
		                        color: 'rgba(255, 255, 255, 0.3)'
		                    },
		                    smooth: 0.2,
		                    length: 10,
		                    length2: 20
		                }
		            },
		            itemStyle: {
		                normal: {
		                    color: '#fff143',
		                    shadowBlur: 200,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            },
		
		            animationType: 'scale',
		            animationEasing: 'elasticOut',
		            animationDelay: function (idx) {
		                return Math.random() * 200;
		            }
		        }
		    ]
		};
		myChart.clear();
		myChart.setOption(option);
	}
	
	function showRadarChart(gdp,pop,tem,ele,myChart){
		option = {
		    title: {
		        text: '该地区各属性'
		    },
		    tooltip: {},
		    /*grid: {
		    	left: '10%',
		    	right: '10%',
		    	bottom: 50,
		    	top: 10,
		    },*/
		    radar: {
		        // shape: 'circle',
		        name: {
		            textStyle: {
		                color: '#fff',
		                backgroundColor: '#999',
		                borderRadius: 3,
		                padding: [3,5]
		           }
		        },
		        indicator: [
		           { name: 'GDP', max: 100000},
		           { name: '人口数量', max: 250000},
		           { name: '气温', max: 30},
		           { name: '高程', max: 1000}
		        ]
		    },
		    series: [{
		        name: '属性值',
		        type: 'radar',
		        // areaStyle: {normal: {}},
		        data : [
		            {
		                value : [gdp[0], pop[0], tem, ele],
		                name : '各属性值'
		            }
		        ]
		    }]
		};
		myChart.clear();
		myChart.setOption(option);
	}
	
	var GDP_PolygonGeoJSON = L.geoJson(null,{
		//响应和回调函数
		onEachFeature: onEachFeature,
	}).addTo(map);
	//ajax调用
	$.ajax({
		url: url,
		dataType: 'json',
		outputFormat: 'text/javascript',
		success:function(data){
			GDP_PolygonGeoJSON.addData(data);
		},
	});
	
	//openstreetmap底图
	var openstreetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{Z}/{x}/{y}.png?{foo}',{foo:'bar'});//.addTo(map);
	//mapbox-street底图
	var mapboxstreet = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',{
		attribution:'Map data &copy;<a href="https://www.openstreetmap.org/">OpenStreetMap</a>contributors,<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,Imagery©<a href="https://www.mapbox.com/">MapBox</a>',
		maxZoom:18,
		id:'mapbox.streets',
		accessToken:'pk.eyJ1IjoiaG9qb2VtZSIsImEiOiJjazI2MGJrZG4wYThlM2hzMHhiNHJxY2NhIn0.gQL14Cx1lg4FlD7-oD2sQw'
	});
	//谷歌
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
//	var Gaodeimgem = L.tileLayer.chinaProvider('GaoDe.Satellite.Map',{//高德影像
//		maxZoom:18,minZoom:4
//	});
//	var Gaodeimga = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion',{
//		maxZoom:18,minZoom:4
//	});
//	var Gaodeimage = L.LayerGroup([Gaodeimgem,Gaodeimga]);
	//定义底图
	var baseMaps = {
		"OpenstreetMap":openstreetmap,
		"MapboxStreets":mapboxstreet,
		"谷歌地图":GoogleMap,
		"谷歌影像":Googlesatellite,
		"高德地图":Gaode
//		"高德影像":Gaodeimage
	};
	//定义专题图
	var overlayMaps = {
		"GDP_Polygon":GDP_PolygonGeoJSON,
	};
	
	//加载底图与专题图
	L.control.layers(baseMaps,overlayMaps).addTo(map);

	//定义搜索控件
	var searchControl = new L.Control.Search({
		//定义搜索查询的图层
		layer: GDP_PolygonGeoJSON,
		//定义搜索关键字
		propertyName: 'name',
		//搜索提示Tips
		textPlaceholder: '地名查询搜索…',
		//是否标记
		marker: false,
		//缩放到图层函数定义
		moveToLocation: function(latlng,title,map){
			//定义放大并弹出属性窗口
			var zoom = map.getBoundsZoom(latlng.layer.getBounds());
			//放大缩放到定义图层
			map.setView(latlng,zoom);
		}
	});
	
	//搜索控件响应函数
	searchControl.on('search:locationfound',function(e){
		//定义高亮样式
		e.layer.setStyle({fillColor:'#3f0',color:'#0f0'});
		if(e.layer._popup)
			e.layer.openPopup();
	}).on('search:collapsed',function(e){
		//每个要素图层的样式响应函数
		featuresLayer.eachLayer(function(layer){
			featuresLayer.resetStyle(layer);
		});
	});
	map.addControl(searchControl);
	
	
}