let _width1 = 400,
	_width2 = 115,
	_divisiones1 = 10,
	_divisiones2 = 5;

var pieza1;
var pieza2;
var pieza3;
let piezasAcolocar;

var piezaSelect = new Object();

var tablero = new Array(10);

for(let i=0; i<tablero.length; i++){
	tablero[i] = new Array(10);
}

var pts = 0;

var ranking = '';

function modales(tipo)
{

	let titulo, texto, boton1='', puntuacion='', nombre='', rank='', div, html;

	switch(tipo){
		case 0: titulo = '¡Bienvenido!';
				  texto = 'Este es el ránking de las 10 mejores puntuaciones:';
				  rank = '<ul id="#rankList"></ul>';
				  boton1 = '<button onclick="cerrarModal()">Jugar</button>';
			break;
		case 1: titulo = '¡Game Over!';
				  texto = 'Ninguna de las piezas a colocar cabe en el tablero';
				  boton1 = '<button onclick="reiniciarJuego()">Volver a jugar</button>';
				  puntuacion = '<p><b>Puntuación: '+pts+' pts.</b></p>';
				  nombre = '<p>Nombre de usuario: <input type="text" id="nomUsuario" name="nomUsuario"></p>'
			break;
		default : titulo = 'Error';
				  texto = 'Se ha producido un error en la web, se redireccionará a Índice';				  
				  boton1 = '<button onclick="reiniciarJuego()">Volver a jugar</button>';
			break;
	}

	div = document.createElement('div');

	div.classList.add('capa-fondo');

	html = '<article>';
	html += '<h2>'+titulo+'</h2>';
	html += '<p id="textoModal">'+texto+'</p>';
	if(puntuacion!=''){
		html+=puntuacion;
	}
	if(nombre!=''){
		html+=nombre;
	}
	if(rank!=''){
		html+=rank;
	}
	if(boton1!=''){
		html+=boton1;
	}
	html += '</article>';

	div.innerHTML = html;

	document.body.appendChild(div);
}

function cerrarModal(){

	document.querySelector('.capa-fondo').remove();
	empezarJuego();

}

function pedirRanking()
{
	let xhr = new XMLHttpRequest(),
		url = 'api/puntuaciones';

	//fd.append('adsfasd', 'asdasaf'); -> para añadir mas campos

	xhr.open('GET', url, true);
	xhr.onload = function(){
		console.log(xhr.responseText);
		let r = JSON.parse(xhr.responseText);

		if(r.RESULTADO=='OK')
		{
			for(let i=0; i<r.FILAS.length;i++){
				if(i<10){
					ranking += `<li> ${r.FILAS[i].nombre}: ${r.FILAS[i].puntos}</li>`;
				}else{
					break;
				}
			}
		}else{
			console.log("Error al cargar el ranking");
		}
		document.getElementById('#rankList').innerHTML = ranking;
	}

	xhr.send();
}

function prepararCanvas()
{

	let canv = document.getElementById('cv01'),
		ctx = canv.getContext('2d');
		canv.width = _width1; 
		canv.height=canv.width;

	let cvs = document.querySelectorAll('#pColocar>div>canvas');

	cvs.forEach(function(cv){
		ctx = cv.getContext('2d');
		cv.width = _width2; 
		cv.height=cv.width;
	});

}

function empezarJuego(){
		prepararCanvasJuego();
		colocarPiezasAleat();
		pintarDivisiones();
}

function reiniciarJuego(){

	if(document.getElementById('nomUsuario')!==undefined && document.getElementById('nomUsuario').value!=""){
		console.log(document.getElementById('nomUsuario').value +" -> "+pts);
		let url = 'api/puntuaciones',
		fd = new FormData();
		fd.append("nombre", document.getElementById('nomUsuario').value);
		fd.append("puntos", pts);
		fetch(url, {'method': 'POST', 'body':fd}).then(function(response){
			if(!response.ok){
				return;
			}
				response.json().then(function(datos){
				console.log(datos);
			});
		});

	}

	cerrarModal();

	pts=0;
	piezaSelect = new Object();
	tablero = new Array(10);

	for(let i=0; i<tablero.length; i++){
		tablero[i] = new Array(10);
	}
	prepararCanvas();
	prepararCanvasJuego();
	colocarPiezasAleat();
	pintarDivisiones();
	actualizarPuntuacion();
}

//Loop del juego

function prepararCanvasJuego(){
	let cv = document.getElementById('cv01'),
		incrX = Math.round(cv.width/_divisiones1),
		incrY = Math.round(cv.height/_divisiones1);

	cv.onmousemove = function(evt){

		//por si el cursor viene desde fuera del canvas
		if(piezaSelect.forma === undefined || piezaSelect.huecos === undefined || piezaSelect.col===undefined || evt.offsetX<0 || evt.offsetX>_width1 || evt.offsetY<0 || evt.offsetY>_width1) return false;

		let fila = Math.floor(evt.offsetY/incrY),
			columna = Math.floor(evt.offsetX/incrX);

		cv.width = cv.width;

		let ctx = cv.getContext('2d');

		ctx.beginPath();
		ctx.fillStyle = piezaSelect.col;

		let pinto = piezaSelect.huecos.split('-');
		
		for(let i=0; i<pinto.length; i++){
			nFila = fila+calcularFilaPieza(pinto[i]);
			nColumna = columna+calcularColumnaPieza(pinto[i]);
			ctx.fillRect(nColumna*incrX, nFila*incrY, incrX, incrY);
		}

		ctx.stroke();

		comprobarFilas();
		comprobarColumnas();
		pintarTablero();
		pintarDivisiones();
	}

	cv.onclick = function(evt){

		if(evt.offsetX<0 || evt.offsetX>_width1 || evt.offsetY<0 || evt.offsetY>_width1) return false;

		let fila = Math.floor(evt.offsetY/incrY),
			columna = Math.floor(evt.offsetX/incrX);

		let pinto = piezaSelect.huecos.split('-');
		let vacios = false;
		
		for(let i=0; i<pinto.length; i++){
			nFila = fila+calcularFilaPieza(pinto[i]);
			nColumna = columna+calcularColumnaPieza(pinto[i]);
			if(nFila>=0 && nColumna>=0 && nFila<tablero.length && nColumna<tablero[nFila].length && (tablero[nFila][nColumna] === undefined || tablero[nFila][nColumna] === null)){
				vacios = true;
			}else{
				vacios = false;
				break;
			}
		}

		if(vacios){
			for(let i=0; i<pinto.length; i++){
				nFila = fila+calcularFilaPieza(pinto[i]);
				nColumna = columna+calcularColumnaPieza(pinto[i]);
				tablero[nFila][nColumna] = piezaSelect.col;
				pts++;
			}
			switch(piezaSelect.pieza){
				case 1: pieza1=undefined;
					break;
				case 2: pieza2=undefined;
					break;
				case 3: pieza3=undefined;
					break;
				default:
					break;
			}
			borrarPiezaColocar(piezaSelect.pieza);
			piezaSelect.forma = undefined;
			piezaSelect.col = undefined;
			piezaSelect.huecos = undefined;
			piezaSelect.pieza = undefined;
			quitarDestacada();
		}

		if(piezasAcolocar == 0){
			colocarPiezasAleat();
		}

		comprobarFilas();
		comprobarColumnas();

		actualizarPuntuacion();

		pintarTablero();
		pintarDivisiones();


		let caben;

		caben = false;
		for (var i = 0; i < 3; i++) {
			if(i==0){
				if(pieza1!==undefined){
				 	if(comprobarPiezaAtablero(i+1)){
						caben = true;
						break;
					}
				}
			}else if(i==1){
				if(pieza2!==undefined){
				 	if(comprobarPiezaAtablero(i+1)){
						caben = true;
						break;
					}
				}
			}else if(i==2){
				if(pieza3!==undefined){
				 	if(comprobarPiezaAtablero(i+1)){
						caben = true;
						break;
					}
				}
			}
		}

		if(!caben){
			modales(1);
		}

	}

}

function actualizarPuntuacion(){
	document.getElementById('pts').innerHTML = pts;
}

function comprobarPiezaAtablero(pieza){
	let vacios, pinto, cabe=false;

	switch(pieza){
		case 1: pinto = pieza1.huecos.split('-');
			break;
		case 2: pinto = pieza2.huecos.split('-');
			break;
		case 3: pinto = pieza3.huecos.split('-');
			break;
		default:
			break;
	}

	for (var i = 0; i < tablero.length; i++) {
		for (var j = 0; j < tablero[i].length; j++) {
			vacios = false;
			for(let k=0; k<pinto.length; k++){
				nFila = i+calcularFilaPieza(pinto[k]);
				nColumna = j+calcularColumnaPieza(pinto[k]);
				if(nFila>=0 && nColumna>=0 && nFila<tablero.length && nColumna<tablero[nFila].length && (tablero[nFila][nColumna] === undefined || tablero[nFila][nColumna] === null)){
					vacios = true;
				}else{
					vacios = false;
					break;
				}
			}
			if(vacios){
				cabe=true;
				break;
			}
		}
		if(cabe){
			break;
		}
	}

	return cabe;
}

function comprobarFilas(){

	let cv = document.getElementById('cv01'),
		incrX = Math.round(cv.width/_divisiones1),
		incrY = Math.round(cv.height/_divisiones1);
		ctx = cv.getContext('2d');
	let borro, aBorrar=0;

	for (var i = 0; i < tablero.length; i++) {
		borro = false;
		for (var j = 0; j < tablero[i].length; j++) {
			if(tablero[i][j]!==undefined){
				borro = true;
			}else{
				borro = false;
				break;
			}
		}
		if(borro){
			aBorrar++;
			for (var j = 0; j < tablero[i].length; j++) {
				tablero[i][j]=undefined;
			}
			ctx.clearRect(0, i*incrX, cv.width, incrY);
			
		}
	}
	if(aBorrar>0){
		if(aBorrar>1){
			pts+=aBorrar*10*2;
		}else if(aBorrar==1){
			pts+=10;
		}
	}
}

function comprobarColumnas(){
	let cv = document.getElementById('cv01'),
		incrX = Math.round(cv.width/_divisiones1),
		incrY = Math.round(cv.height/_divisiones1);
		ctx = cv.getContext('2d');
	let borro, aBorrar=0;

	for (var i = 0; i < tablero.length; i++) {
		borro = false;
		for (var j = 0; j < tablero[i].length; j++) {
			if(tablero[j][i]!==undefined){
				borro = true;
			}else{
				borro = false;
				break;
			}
		}
		if(borro){
			aBorrar++;
			for (var j = 0; j < tablero[i].length; j++) {
				tablero[j][i]=undefined;
			}
			ctx.clearRect(i*incrY, 0, incrX, cv.height);
		}
	}
	if(aBorrar>0){
		if(aBorrar>1){
			pts+=aBorrar*10*2;
		}else if(aBorrar==1){
			pts+=10;
		}
	}
}

function borrarPiezaColocar(cv){

	let canv;

	switch(piezaSelect.pieza){
		case 1: canv = document.getElementById('cv02'),
				ctx = canv.getContext('2d');
				canv.width = canv.width;
				piezasAcolocar--;
				pintarDivisiones();
			break;
		case 2: canv = document.getElementById('cv03'),
				ctx = canv.getContext('2d');
				canv.width = canv.width;
				piezasAcolocar--;
				pintarDivisiones();
			break;
		case 3: canv = document.getElementById('cv04'),
				ctx = canv.getContext('2d');
				canv.width = canv.width;
				piezasAcolocar--;
				pintarDivisiones();
			break;
		default:
			break;
	}
}

function colocarPiezasAleat(){

	piezasAcolocar = 3;

	pieza1 = new Object();
	pieza1.forma = Math.floor(Math.random() * 9) + 1;
	pieza1.col = asignarColores(pieza1.forma);
	pieza1.huecos = asignarForma(pieza1.forma);

	pieza2 = new Object();
	pieza2.forma = Math.floor(Math.random() * 9) + 1;
	pieza2.col = asignarColores(pieza2.forma);
	pieza2.huecos = asignarForma(pieza2.forma);

	pieza3 = new Object();
	pieza3.forma = Math.floor(Math.random() * 9) + 1;
	pieza3.col = asignarColores(pieza3.forma);
	pieza3.huecos = asignarForma(pieza3.forma);

	let ctx, pinto;

	let cvs = document.querySelectorAll('#pColocar>div>canvas');

	cvs.forEach(function(cv, e){

		incrX = Math.round(cv.width/_divisiones2),
		incrY = Math.round(cv.height/_divisiones2);

		//ctx = cv.getContext('2d');
		
		let fila = 2,
			columna = 2;

		cv.width = cv.width;

		ctx = cv.getContext('2d');

		ctx.beginPath();

		switch(e){
			case 0: ctx.fillStyle = pieza1.col;
					pinto = pieza1.huecos.split('-');
				break;
			case 1: ctx.fillStyle = pieza2.col;
					pinto = pieza2.huecos.split('-');
				break;
			case 2: ctx.fillStyle = pieza3.col;
					pinto = pieza3.huecos.split('-');
				break;
			default:
				break;
		}

		for(let i=0; i<pinto.length; i++){
			nFila = fila+calcularFilaPieza(pinto[i]);
			nColumna = columna+calcularColumnaPieza(pinto[i]);
			ctx.fillRect(nColumna*incrX, nFila*incrY, incrX, incrY);
		}
			
		ctx.stroke();
		
	});

}

function destacar(cv){

	quitarDestacada();

	switch(cv){
		case 0: 
				if(pieza1!=undefined && pieza1.forma !== undefined && pieza1.huecos !== undefined && pieza1.col !== undefined){
					cv = document.querySelector('#cv02');
					cv.classList.add('destacada');
					piezaSelect.forma = pieza1.forma;
					piezaSelect.huecos = pieza1.huecos;
					piezaSelect.col = pieza1.col;
					piezaSelect.pieza = 1;
				}
			break;
		case 1: if(pieza2!=undefined && pieza2.forma !== undefined && pieza2.huecos !== undefined && pieza2.col !== undefined){
					cv = document.querySelector('#cv03');
					cv.classList.add('destacada');
					piezaSelect.forma = pieza2.forma;
					piezaSelect.huecos = pieza2.huecos;
					piezaSelect.col = pieza2.col;
					piezaSelect.pieza = 2;
				}
			break;
		case 2: if(pieza3!=undefined && pieza3.forma !== undefined && pieza3.huecos !== undefined && pieza3.col !== undefined){
					cv = document.querySelector('#cv04');
					cv.classList.add('destacada');
					piezaSelect.forma = pieza3.forma;
					piezaSelect.huecos = pieza3.huecos;
					piezaSelect.col = pieza3.col;
					piezaSelect.pieza = 3;
				}
			break;
		default :
			break;
	}
}

function quitarDestacada(){
	let cvs = document.querySelectorAll('#pColocar>div>canvas');
	cvs.forEach(function(cv){
		cv.classList.remove('destacada');
	});
}

function pintarTablero(){

	let cv = document.getElementById('cv01'),
		incrX = Math.round(cv.width/_divisiones1),
		incrY = Math.round(cv.height/_divisiones1);
		ctx = cv.getContext('2d');

	for (var i = 0; i < tablero.length; i++) {
		for (var j = 0; j < tablero[i].length; j++) {
			
			if(tablero[i][j] !== undefined){
				let fila = i,
					columna = j;

				ctx.beginPath();
				ctx.fillStyle = tablero[i][j];
				ctx.fillRect(columna*incrX, fila*incrY, incrX, incrY);
			}
		}
	}

	ctx.stroke();
}

function pintarDivisiones()
{

	let cv = document.getElementById('cv01'),
		ctx = cv.getContext('2d');

	incrX = Math.round(cv.width/_divisiones1),
	incrY = Math.round(cv.height/_divisiones1);

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#ccc';

	for(let i=1; i<_divisiones1; i++)
	{
		ctx.moveTo(i * incrX, 0);
		ctx.lineTo(i * incrX, cv.height);
		ctx.moveTo(0, i * incrY);
		ctx.lineTo(cv.width, i * incrY);
	}

	ctx.stroke();

	let cvs = document.querySelectorAll('#pColocar>div>canvas');
			
	cvs.forEach(function(cv){

		incrX = Math.round(cv.width/_divisiones2),
		incrY = Math.round(cv.height/_divisiones2);
		ctx = cv.getContext('2d');
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#ccc';

		for(let i=1; i<_divisiones2; i++)
		{
			ctx.moveTo(i * incrX, 0);
			ctx.lineTo(i * incrX, cv.height);
			ctx.moveTo(0, i * incrY);
			ctx.lineTo(cv.width, i * incrY);
		}
			
		ctx.stroke();
		
	});

}

function calcularFilaPieza(pieza){

	let nuevaFila;

	if(pieza<=5){
		nuevaFila = -2;
	}else if(pieza>5 && pieza<=10){
		nuevaFila = -1;
	}else if(pieza>10 && pieza<=15){
		nuevaFila = 0;
	}else if(pieza>15 && pieza<=20){
		nuevaFila = +1;
	}else if(pieza>20 && pieza<=25){
		nuevaFila = +2;
	}

	return nuevaFila;
}

function calcularColumnaPieza(pieza){

	let nuevaColumna;

	if(pieza%5 == 0){
		nuevaColumna = 2;
	}else if(pieza%5 == 1){
		nuevaColumna = -2;
	}else if(pieza%5 == 2){
		nuevaColumna = -1;
	}else if(pieza%5 == 3){
		nuevaColumna = 0;
	}else if(pieza%5 == 4){
		nuevaColumna = 1;
	}

	return nuevaColumna;
}

function asignarColores(num){

	let col;

	switch(num){
		case 1: col = "#4d0099";
			break;
		case 2: col = "#b3003b";
			break;
		case 3: col = "#0066ff";
			break;
		case 4: col = "#66ff66";
			break;
		case 5: col = "#ff9900";
			break;
		case 6: col = "#009933";
			break;
		case 7: col = "#9900cc";
			break;
		case 8: col = "#33cccc";
			break;
		case 9: col = "#ff6699";
			break;
		default: col = "#0066ff";
			break;
	}

	return col;
}

function asignarForma(num){

	let huecos, rand;

	switch(num){
		case 1: rand = Math.floor(Math.random() * 4) + 1;
				if(rand==1){
					huecos = "7-12-17-18-19";
				}else if(rand==2){
					huecos = "7-8-9-12-17";
				}else if(rand==3){
					huecos = "7-8-9-14-19";
				}else if(rand==4){
					huecos = "9-14-17-18-19";
				}
			break;
		case 2: rand = Math.floor(Math.random() * 2) + 1;
				if(rand==1){
					huecos = "8-13";
				}else if(rand==2){
					huecos = "13-14";
				}
			break;
		case 3: huecos = "13";
			break;
		case 4: rand = Math.floor(Math.random() * 2) + 1;
				if(rand==1){
					huecos = "11-12-13-14-15";
				}else if(rand==2){
					huecos = "3-8-13-18-23";
				}
			break;
		case 5: rand = Math.floor(Math.random() * 2) + 1;
				if(rand==1){
					huecos = "12-13-14";
				}else if(rand==2){
					huecos = "8-13-18";
				}
			break;
		case 6: huecos = "7-8-12-13";
			break;
		case 7: rand = Math.floor(Math.random() * 2) + 1;
				if(rand==1){
					huecos = "8-13-18-23";
				}else if(rand==2){
					huecos = "12-13-14-15";
				}
			break;
		case 8: huecos = "7-8-9-12-13-14-17-18-19";
			break;
		case 9: rand = Math.floor(Math.random() * 4) + 1;
				if(rand==1){
					huecos = "7-8-12";
				}else if(rand==2){
					huecos = "8-9-14";
				}else if(rand==3){
					huecos = "14-18-19";
				}else if(rand==4){
					huecos = "12-17-18";
				}
			break;
		default: huecos = "13";
			break;
	}

	return huecos;
}

