// Esto es una SPA (Single Page Application), cargamos la lógica de la 
// APP con document.ready:

$(document).ready(
    function(){
		// los canales los almacenamos en un array, cada objeto será un 
		// canal con nombre, tipo y url.
		let canales=[];
		
		let predeterminados= [

		{"nombre":"ideal","tipo":"RSS","url":"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url=%22http://www.ideal.es/rss/2.0/?section=ultima-hora%22&format=json"}
		,
		{"nombre":"El mundo","tipo":"RSS","url":"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url=%22http://estaticos.elmundo.es/elmundo/rss/espana.xml%22&format=json"}
		,
		{"nombre":"AS","tipo":"RSS","url":"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url=%22http://as.com/rss/tags/ultimas_noticias.xml%22&format=json"}
		,
		{"nombre":"El Pais","tipo":"RSS","url":"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url=%22http://ep00.epimg.net/rss/elpais/portada.xml%22&format=json"}
		,
		{"nombre":"La Vanguardia","tipo":"RSS","url":"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url=%22http://www.lavanguardia.com/mvc/feed/rss/internacional%22&format=json"}
		,
		{"nombre":"El Confidencial","tipo":"ATOM","url":"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20atom%20where%20url=%22https://rss.elconfidencial.com/mundo/%22&format=json"}
		,
		{"nombre":"Diario.es","tipo":"RSS","url":"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url=%22https://www.eldiario.es/rss/%22&format=json"}
		,
		{"nombre":"ABC","tipo":"RSS","url":"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url=%22http://www.abc.es/rss/feeds/abc_Internacional.xml%22&format=json"}
		,
		{"nombre":"Real Madrid","tipo":"RSS","url":"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url=%22http://estaticos.marca.com/rss/futbol/real-madrid.xml%22&format=json"}
		,
		{"nombre":"Diario Sur","tipo":"ATOM","url":"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20atom%20where%20url=%22http://www.diariosur.es/rss/atom/?section=ultima-hora%22&format=json"}
	]
		// definimos la función cargarCanales()
		// esta función carga de localStorage los canales disponibles y 
		// actualiza el SELECT con la lista de canales
		function cargarCanales(){
			$("#select_canal").empty();
			
			canales = JSON.parse(localStorage.getItem('marcadores'));
			
			if (canales==null) canales = [];
			
			for (let i=0; i<canales.length; i++) {
				let opcion = $('<option value="'+i+'">'+canales[i].nombre+'</option>');
				$("#select_canal").append(opcion);
			}
		}
		// llamamos a la función para forzar su ejecución al cargar la página
		cargarCanales();

		function cargarPredeterminados(){
			$("#select_predeterminados").empty();
						
			for (let i=0; i<predeterminados.length; i++) {
				let opcion = $('<option value="'+i+'">'+predeterminados[i].nombre+'</option>');
				$("#select_predeterminados").append(opcion);
			}
		}
		cargarPredeterminados();

		function urlRepe (url){
			let encontrado=false;
			for(let i=0; (i<canales.length && !encontrado) ; i++){
				if (canales[i].url.trim()==url.trim()){
					encontrado=true;
				}
			}
			return encontrado;
		}
		
		// mostrar un canal del array
		function mostrarCanal(posicion){
			$.ajax({
				url:canales[posicion].url,
				success:function(datos){
					let salida='';
					salida+='<h4>Hay '+datos.query.count+' noticias.</h4>';	
					salida+='<ol>';
					for (let i=0; i<datos.query.count; i++){ 
						if (canales[posicion].tipo=="RSS") {
							salida+='<li>'+'<a href="'+datos.query.results.item[i].link+'">'+datos.query.results.item[i].title+'</a>' +'</li>';
						} else {
							salida+='<li>'+datos.query.results.entry[i].title +'</li>';
						}
					}
					salida+='</ol>';
					$("#panel_mostrar_noticias").html(salida);						
				}, 
				timeout: 5000,
				error:function(xhr, ajaxOptions, thrownError){
					 let salida = "<h4>Error: No hay conexión a Internet</h4>";
					 salida += "<p>Compruebe su conexión e inténtelo de nuevo</p>";
					 $("#lector").html(salida);
					 salida += "<p>Error códido: "+xhr.status+"</p>";
					}
				});
		}
		
		/**
			Esta función guarda en localStorage los marcadores.
			Devuelve verdadero si lo consigue y falso si error.
		*/
		function salvarCanal(urlCanal, tipoCanal, nombreCanal) {
			let returnValue=true;
			/** Ejemplo de lo que vamos a almacenar
			let marcadores = [ 
				{
						nombre: "Ideal",
						tipo:"RSS",
						URL:"http://www.ideal.es/rss/2.0/portada"
				},
				{
						nombre: "Ideal",
						tipo:"RSS",
						URL:"http://www.ideal.es/rss/2.0/portada"
				}
			];
		*/
			if (localStorage!=undefined) {
				// en verdad no hace falta hacer el getItem, ya tenemos guardado en 
				// la variable "canales" el array...
				let marcadores = JSON.parse(localStorage.getItem('marcadores'));
				if (marcadores == null) {
					marcadores = [];
				}
				let marcador = {
					nombre: nombreCanal ,
					tipo: tipoCanal,
					url: urlCanal 
				};
				marcadores.push(marcador);
				localStorage.setItem('marcadores', JSON.stringify(marcadores) );
				cargarCanales();
			} else {
				returnValue=false;
			}
			return returnValue;
		}
		
		// ejemplo de consulta:
		// https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D'http%3A%2F%2Fwww.ideal.es%2Frss%2F2.0%2Fportada'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys
		
		
		// primera versión del lector, al pulsar sobre el botón RSS 
		// leemos la URL del formulario y cargamos el canal RSS
		$('#boton_rss').on('click', function(){
				let html='Cargando datos...';
				let consulta = '';
				consulta += 'https://query.yahooapis.com/v1/public/yql?q=';
				consulta += "select * from rss where url='"+$('#input_url').val()+"'&format=json";
				consulta = encodeURI(consulta);				
				$("#lector").html(html);
				
				$.ajax({
					url:consulta,
					success:function(datos){
						let salida='';
						salida+='<h4>Hay '+datos.query.count+' noticias.</h4>';	
						salida+='<ol>';
						for (let i=0; i<datos.query.count; i++){ 
							salida+='<li>'+datos.query.results.item[i].title +'</li>';
						}
						salida+='</ol>';
						$("#lector").html(salida);						
					}, 
					timeout: 5000,
					error:function(xhr, ajaxOptions, thrownError){
						 let salida = "<h4>Error: No hay conexión a Internet</h4>";
						 salida += "<p>Compruebe su conexión e inténtelo de nuevo</p>";
						 $("#lector").html(salida);
						 salida += "<p>Error códido: "+xhr.status+"</p>";
						}
				});
				
			});
		
		// primera versión del lector, al pulsar sobre el botón ATOM 
		// leemos la URL del formulario y cargamos el canal ATOM
		$('#boton_atom').on('click', function(){
			let html='Cargando datos...';
			let consulta = '';
			consulta += 'https://query.yahooapis.com/v1/public/yql?q=';
			consulta += "select * from atom where url='"+$('#input_url').val()+"'&format=json";
			consulta = encodeURI(consulta);				
			$("#lector").html(html);
			
			$.ajax({
				url:consulta,
				success:function(datos){
						let salida='';
						salida+='<h4>Hay '+datos.query.count+' noticias.</h4>';
						salida+='<ol>';
						for (let i=0; i<datos.query.count; i++){ 
							salida+='<li>'+datos.query.results.entry[i].title +'</li>';
						}
						salida+='</ol>';
						$("#lector").html(salida);
					}, 
				timeout: 5000,
				error:function(xhr, ajaxOptions, thrownError){
					 let salida = "<h4>Error: No hay conexión a Internet</h4>";
					 salida += "<p>Compruebe su conexión e inténtelo de nuevo</p>";
					 $("#lector").html(salida);
					 salida += "<p>Error códido: "+xhr.status+"</p>";
					}
				});
			
		});
		
		// 
		// 
		$('#boton_test').on('click', function(){
			let html='Cargando datos...';
			/* 
			$.ajax({
				url: parametro0,
				success: parametro1,
				timeout: parametro2,
				error: parametro3
			});
			*/
			let url =  'https://query.yahooapis.com/v1/public/yql?q=';
			url += 'select * from rss where url="'+ $("#input_url").val() +'"&format=json';
			url = encodeURI(url);
			$.ajax({
				url: url,
				success: function(datos){
						if (datos.query.count>0) { // es RSS
							salvarCanal(url, "RSS", $("#input_nombre").val());
							$("#lector").html("<h4> Canal RSS almacenado </h4>");
						} else {
							let url =  'https://query.yahooapis.com/v1/public/yql?q=';
							url += 'select * from atom where url="'+ $("#input_url").val() +'"&format=json';
							url = encodeURI(url);
							$.ajax({
								url: url,
								success: function(datosAtom){
										if (datosAtom.query.count>0) { // es ATOM
											salvarCanal(url, "ATOM", $("#input_nombre").val());
											$("#lector").html("<h4> Canal ATOM almacenado </h4>");
										} else {
											$("#lector").html("<h4>URL no válida </h4>");
										}
									},
								timeout: 4000,
								error: function(error){
									$("#lector").html("<h4>Sin conexión a Internet </h4>");
								}
							});
						}
					},
				timeout: 4000,
				error: function (error){
					$("#lector").html("<h4>Sin conexión a Internet </h4>");
				}
			});
			
			$("#lector").html(html);
		});
		
		// al hacer click en el botón consultar...
		$("#boton_consultar").on("click", function(){
			$(".panel").hide();
			$("#panel_mostrar_noticias").show("slow");
			let pos = +$("#select_canal").val();
			mostrarCanal(pos);
		});
		
		// al hacer click en el botón borrar...
		// este evento elimina del array de canales el seleccionado
		// y actualiza la lista tanto en el SELECT como en localStorage
		$("#boton_borrar").on("click", function(){
			let pos = +$("#select_canal").val();
			canales.splice(pos, 1);
			localStorage.setItem('marcadores', JSON.stringify(canales) );
			cargarCanales();
		});
		
		// al hacer click con el botón actualizar...
		// este evento actualiza con el texto del INPUT para el nombre 
		// del alimentador el canal seleccionado.
		$("#boton_actualizar").on("click", function(){
			let pos = +$("#select_canal").val();
			canales[pos].nombre=$("#input_actualizar").val();
			localStorage.setItem('marcadores', JSON.stringify(canales) );
			cargarCanales();
		});

		$("#boton_añadir").on("click", function(){
			$(".panel").hide();
			$("#panel_favoritos").show("slow");
			let posicion = +$("#select_predeterminados").val();
			let nombre = predeterminados[posicion].nombre;
			let tipo = predeterminados[posicion].tipo;
			let url = predeterminados[posicion].url;
			salvarCanal(url,tipo,nombre);
		});

		$(".panel").hide();
		$("#panel_inicio").show();

		$("#menu_inicio").on("click", function(){
			$(".panel").hide();
			$("#panel_inicio").show("slow");
		});

		$("#menu_favoritos").on("click", function(){
			$(".panel").hide();
			$("#panel_favoritos").show("slow");
		});

		$("#menu_personalizado").on("click", function(){
			$(".panel").hide();
			$("#panel_personalizado").show("slow");
		});

		$("#menu_predefinido").on("click", function(){
			$(".panel").hide();
			$("#panel_predefinido").show("slow");
		});

		$("#menu_ayuda").on("click", function(){
			$(".panel").hide();
			$("#panel_ayuda").show("slow");
		});

		$("#menu_acerca_de").on("click", function(){
			$(".panel").hide();
			$("#panel_acerca_de").show("slow");
		});
	
	
});



