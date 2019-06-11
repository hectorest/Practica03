function ejemplo01()
{
	let cv = document.getElementById('cv01'),
		ctx = cv.getContext('2d');

	ctx.moveTo(100, 100);
	ctx.lineTo(200, 150);

	ctx.stroke();
}

function ejemplo02()
{
	let cv = document.getElementById('cv01'),
		ctx = cv.getContext('2d');

	ctx.beginPath();
	ctx.moveTo(99.5, 0);
	ctx.lineTo(99.5, cv.height);
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#a00';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.strokeStyle = '#0a0';
	ctx.moveTo(200.5, 0);
	ctx.lineTo(200.5, cv.height);
	ctx.stroke();
}

function cuadrado01()
{
	let cv = document.getElementById('cv01'),
		ctx = cv.getContext('2d');

	ctx.beginPath();
	ctx.strokeStyle = '#00a';
	ctx.lineWidth = 4;
	ctx.strokeRect(300.5,200.5,100,75);
	/*ctx.rect(300.5,200.5,100,75);
	ctx.stroke();*/
}

function cuadrado02()
{
	let cv = document.getElementById('cv01'),
		ctx = cv.getContext('2d');

	ctx.beginPath();
	ctx.fillStyle = '#0a0';
	ctx.fillRect(300.5,200.5,100,75);
	/*ctx.rect(300.5,200.5,100,75);
	ctx.stroke();*/
}

function circulo01()
{
	let cv = document.getElementById('cv01'),
		ctx = cv.getContext('2d');

	ctx.beginPath();
	ctx.strokeStyle = '#a0a';
	ctx.lineWidth = 2;

	ctx.arc(300,250,100, 0, Math.PI/2, true);
	ctx.lineTo(300,250);
	ctx.lineTo(400,250);

	ctx.fillStyle = '#aa0';
	ctx.fill();

	ctx.stroke();
}

function rejilla()
{
	let cv = document.getElementById('cv01'),
		ctx = cv.getContext('2d'),
		divisiones = 3,
		incrX = Math.round(cv.width/divisiones),
		incrY = Math.round(cv.height/divisiones);

		//cv.width=cv.width;
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#234';

		for(let i=1; i<divisiones; i++)
		{
			ctx.moveTo(i * incrX, 0);
			ctx.lineTo(i * incrX, cv.height);

			ctx.moveTo(0, i * incrY);
			ctx.lineTo(cv.width, i * incrY);
		}

		ctx.stroke();

}

function prepararCanvas()
{
	/*let cv = document.getElementById('cv01'),
		ctx = cv.getContext('2d'),
		divisiones = 3,
		incrX = Math.round(cv.width/divisiones),
		incrY = Math.round(cv.height/divisiones);
		cv.width = 480; 
		cv.height=360;

	cv.onmousemove = function(evt){

		//console.log(evt.offsetX + ',' + evt.offsetY);
		let fila = Math.floor(evt.offsetY/incrY),
			columna = Math.floor(evt.offsetX/incrX);

		console.log(fila+','+columna);
	}*/

	let cvs = document.querySelectorAll('canvas');

	cvs.forEach(function(cv){
		ctx = cv.getContext('2d');
		cv.width = 480; 
		cv.height=cv.width;
	});

}

function copiarImagen(){
	let cv01 = document.getElementById('cv01'),
		cv02 = document.getElementById('cv02');

		ctx02 = cv02.getContext('2d');

	ctx.drawImage(cv01, 0, 0);

}

function copiarImagen2(){
	let cv01 = document.getElementById('cv01'),
		cv02 = document.getElementById('cv02');

		ctx01 = cv01.getContext('2d');
		ctx02 = cv02.getContext('2d');

		imgData = ctx01.getImageData(0,0,cv01.width, cv01.height);

	ctx.putImageData(imgData, 0, 0);

}

var DIVISIONES = 3;

function pintarDivisiones(){
	let cv = document.getElementById('cv02'),
		ctx = cv.getContext('2d');

		incrX = Math.round(cv.width/DIVISIONES),
		incrY = Math.round(cv.height/DIVISIONES);

		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#a00';

		for(let i=1; i<DIVISIONES; i++)
		{
			ctx.moveTo(i * incrX, 0);
			ctx.lineTo(i * incrX, cv.height);

			ctx.moveTo(0, i * incrY);
			ctx.lineTo(cv.width, i * incrY);
		}

		ctx.stroke();

}

function prepararCanvas2(){
	let cv = document.getElementById('cv02'),
		incrX = Math.round(cv.width/DIVISIONES),
		incrY = Math.round(cv.height/DIVISIONES);

	cv.onmousemove = function(evt){

		//por si el cursor viene desde fuera del canvas
		//if(evt.offsetX<0 || evt.offsetX>359 || evt.offsetY<0 || evt.offsetY>359) return false;

		let fila = Math.floor(evt.offsetY/incrY),
			columna = Math.floor(evt.offsetX/incrX);

		console.log(fila+','+columna);

		//pintar Imagen
		cv.width = cv.width;

		let ctx = cv.getContext('2d'),
			img = new Image();

			img.onload = function(){
				ctx.drawImage(img, columna*incrX, fila*incrY, incrX, incrY);
			};

			img.src="messi.jpg";

			pintarDivisiones();
	}
}

function pintarImagen(){
	let cv = document.getElementById('cv01'),
		ctx = cv.getContext('2d'),
		imagen = new Image();

		imagen.src="messi.jpg";
		imagen.onload = function(){
			ctx.drawImage(imagen, 0, 0, cv.width, cv.height);
		};
}

function pintarImagen2(){
	let cv = document.getElementById('cv01'),
		ctx = cv.getContext('2d'),
		imagen = new Image();

		imagen.src="messi.jpg";
		imagen.onload = function(){
			ctx.drawImage(imagen, 100, 100, 300, 200, 100, 100, 300, 200);
		};
}

function cargarImagen(inp){

	if(inp.files.length<1){
		return false;
	}

	let fr = new FileReader();

	fr.onload = function(){
		let cv = document.getElementById('cv01'),
			ctx = cv.getContext('2d'),
			imagen = new Image();

		imagen.onload = function(){
			cv.width = cv.width;
			let alto = imagen.height*cv.width/imagen.width;
			ctx.drawImage(imagen, 0, 0, cv.width, alto);
		};

		imagen.src=fr.result;

	};

	fr.readAsDataURL(inp.files[0]);

}

function prepararDnD(){
	let imgs = document.querySelectorAll('#imgs>img');

	imgs.forEach(function(e, idx){
		e.ondragstart = function(evt){
			evt.dataTransfer.setData('text/plain', idx);
		};
	});
}
