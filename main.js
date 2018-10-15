//global variables
var renderer;
var scene;
var camera;
var controls;
var video, videoImage, videoImageContext, videoTexture;
var spotlight, lightHelper, shadowCameraHelper;;
var gui;
var stats;
var params;
var sky, sunSphere;
var uniforms1, uniforms2;
var clock;
var object1, object2, object3;

function createRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

//create camera
function createCamera() {
	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 250, 1000 );
    camera.lookAt(scene.position);

    //set camera controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = Math.PI * 0.5;
	controls.minDistance = 1000;
	controls.maxDistance = 5000;

}

//load 3D models 
function loadModels() {


	var loader = new THREE.ColladaLoader();
	loader.load('assets/Voldemort.dae', function(object){
	var Voldemort = object.scene;
	
	//set position
		Voldemort.position.x =-300;
		Voldemort.position.z= 0;
		Voldemort.rotateX(Math.PI/2);
		Voldemort.rotateY(Math.PI/4);
	//add shadow
		Voldemort.traverse(function(child) { 
			child.castShadow = true;  
        	child.receiveShadow = true;	
        });	 
		scene.add(object.scene);
	});
	
	loader.load('assets/Harry.dae', function(object){
	var Harry = object.scene;
		Harry.position.x = 600;
		Harry.rotateZ(Math.PI); 
		Harry.scale.set(2.5,2.5,2.5);
		Harry.traverse(function(child) { 
			child.castShadow = true;  
        	child.receiveShadow = true;
 
        });	 
		scene.add(object.scene);
	});
	
		loader.load('assets/board.dae', function(object){
		var board = object.scene;
		board.scale.set(2,2,2);
		board.rotateX(-Math.PI/2);
		board.rotateY(Math.PI/2);
		board.position.x = 700;
		board.position.z = -900;
		board.rotateX(Math.PI/2); 
		
		board.traverse(function(child) { 
			child.castShadow = true;  
        	child.receiveShadow = true;
 
        });	 
		scene.add(object.scene);
	});
	
}
//https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Video.html
function video (){

	video = document.createElement( 'video' );
	video.src = "assets/video.mp4";
	video.load(); 
	video.play();
	videoImage = document.createElement( 'canvas' );
	videoImage.width = 480;
	videoImage.height = 360;
	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	
	var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
	// the geometry on which the movie will be displayed;
	// movie image will be scaled to fit these dimensions.
	var movieGeometry = new THREE.PlaneGeometry( 400, 180, 4, 4 );
	var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
	movieScreen.position.set(700,150,-895);
	scene.add(movieScreen);
}

function loadCampusBuilding () {

	var loader = new THREE.ColladaLoader();
	loader.load('assets/ucc.dae', function(object){
		var campus = object.scene;
		campus.scale.set(1,1,1);
		campus.traverse(function(child){
		child.castShadow = true; 
		child.receiveShadow = true;
		});
		scene.add(campus);
	});
	
}

function createFloor() {

	var texture = new THREE.TextureLoader().load("assets/grass.jpg");
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(30,30);

	var geo = new THREE.PlaneBufferGeometry(10000, 10000);
	var mat = new THREE.MeshStandardMaterial( { map: texture } );
	var plane = new THREE.Mesh(geo,mat);
	plane.receiveShadow = true;
	plane.rotateX( -Math.PI/2); 
	scene.add(plane);
	
} 


function createLight() {

				scene.add( new THREE.AmbientLight( 0x444444 ) );
//create spotlight and set properties
				spotLight = new THREE.SpotLight( 0xffffff, 1 );
				spotLight.position.set( 1000, 1000, 1000 );
				spotLight.angle = Math.PI / 4;
				spotLight.penumbra = 0.05;
				spotLight.decay = 0;
				spotLight.distance = 3000;
				spotLight.castShadow = true;
				spotLight.shadow.mapSize.width = 1024;
				spotLight.shadow.mapSize.height = 1024;
				spotLight.shadow.camera.near = 10;
				spotLight.shadow.camera.far = 1000;
				scene.add( spotLight );
				
//				lightHelper = new THREE.SpotLightHelper( spotLight );
//				scene.add( lightHelper );
//				shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
//				scene.add( shadowCameraHelper );
				
}



https://github.com/mrdoob/three.js/blob/master/examples/webgl_lights_spotlight.html
function buildGui() {
				gui = new dat.GUI();
				 params = {
				 	CameraAnimation: true,
					LightAnimation: true,
					'light color': spotLight.color.getHex(),
					intensity: spotLight.intensity,
					distance: spotLight.distance,
					angle: spotLight.angle,
					penumbra: spotLight.penumbra,
					decay: spotLight.decay,
					positionX: spotLight.position.x,
					positionY: spotLight.position.y,
					positionZ: spotLight.position.z,
				}
				gui.add( params, 'LightAnimation' );
				gui.add( params, 'CameraAnimation' );
				gui.addColor( params, 'light color' ).onChange( function ( val ) {
					spotLight.color.setHex( val );
					render();
				} );
				gui.add( params, 'intensity', 0, 2 ).onChange( function ( val ) {
					spotLight.intensity = val;
					render();
				} );
				gui.add( params, 'distance', 50, 3000 ).onChange( function ( val ) {
					spotLight.distance = val;
					render();
				} );
				gui.add( params, 'angle', 0, Math.PI / 3 ).onChange( function ( val ) {
					spotLight.angle = val;
					render();
				} );
				gui.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {
					spotLight.penumbra = val;
					render();
				} );
				gui.add( params, 'decay', 0, 2 ).onChange( function ( val ) {
					spotLight.decay = val;
					render();
				} );
				gui.add( params, 'positionX', 500, 1500 ).onChange( function ( val ) {
					spotLight.position.x = val;
					render();
				} );
				gui.add( params, 'positionY', 500, 1500 ).onChange( function ( val ) {
					spotLight.position.y = val;
					render();
				} );
				gui.add( params, 'positionZ', 500, 1500 ).onChange( function ( val ) {
					spotLight.position.z = val;
					render();
				} );
				gui.open();
//new stats screen
				stats = new Stats();
				document.body.appendChild( stats.domElement );
}

//https://github.com/mrdoob/three.js/blob/master/examples/webgl_lights_rectarealight.html
function animateLight(){
	requestAnimationFrame( animateLight );
				if ( params.LightAnimation ) {
					var t = ( Date.now() / 2000 );
					// move light in circle around center
					// change light height with sine curve
					var r = 1000;
					var lx = r * Math.cos( t );
					var lz = r * Math.sin( t );
					var ly = 1000;
					spotLight.position.set( lx, ly, lz );
					spotLight.lookAt( origin );
				}
				renderer.render( scene, camera );
				stats.update();
}

function animateCamera() {
	requestAnimationFrame( animateCamera );
				if ( params.CameraAnimation ) {
					var t = ( Date.now() / 2000 );
					// move camera in circle around center
					// change camera height with sine curve
					var r = 4000;
					var lx = r * Math.cos( t );
					var lz = r * Math.sin( t );
					var ly = 1500;
					camera.position.set( lx, ly, lz );
					camera.lookAt( origin );
				}
}

//setBackground image
function sky(){

				sky = new THREE.Sky();
				sky.scale.setScalar( 50000 );
				scene.add( sky );				

}

https://github.com/mrdoob/three.js/blob/master/examples/webgl_shader2.html
function shaders(){
	
				// set shaders
	uniforms1 = {
					time: { value: 1.0 }
				};
	uniforms2 = {
					time: { value: 1.0 },
					texture: { value: new THREE.TextureLoader().load( 'assets/fire.jpg' ) }
				};
	uniforms2.texture.value.wrapS = uniforms2.texture.value.wrapT = THREE.RepeatWrapping;
	
	var params = [
			[ 'fragment_shader1', uniforms1 ],
			[ 'fragment_shader2', uniforms2 ],
			[ 'fragment_shader3', uniforms1 ],
			[ 'fragment_shader4', uniforms1 ]
	];
	
	// apply shaders

	var material1 = new THREE.ShaderMaterial( {
			uniforms: params[ 1 ][ 1 ],
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( params[ 1 ][ 0 ] ).textContent
			} );
			
	var material2 = new THREE.ShaderMaterial( {
			uniforms: params[ 0 ][ 1 ],
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( params[ 0 ][ 0 ] ).textContent
			} );
	
	
	
	// create three sphere object
	
	object1 = new THREE.Mesh(new THREE.SphereBufferGeometry( 60, 10, 10 ), material1);
	object1.position.set(-600, 150, -300);
	object1.castShadow = true;
	scene.add(object1);
	
	object2 = new THREE.Mesh(new THREE.SphereBufferGeometry( 60, 10, 10 ), material2);
	object2.position.set(200, 150, 0);
	object2.castShadow = true;
	scene.add(object2);
	
	object3 = new THREE.Mesh(new THREE.SphereBufferGeometry( 60, 10, 10 ), new THREE.MeshLambertMaterial( { color:0x800909, side: THREE.DoubleSide } ));
	object3.position.set(-620, 150, 200);
	object3.castShadow = true;
	scene.add(object3);

}

//https://googlechrome.github.io/omnitone/#home
function audioAPI(){

	// set up an audio element to feed the ambisonic source audio feed.  
    var audioElement = document.createElement('audio');
    audioElement.src = 'assets/1.mp3';
    audioElement.loop = true;

    // create AudioContext, MediaElementSourceNode and FOARenderer.
    var audioContext = new AudioContext();
    var audioElementSource = audioContext.createMediaElementSource(audioElement);
    var foaRenderer = Omnitone.createFOARenderer(audioContext);

    // make connection and start play.
    foaRenderer.initialize().then(function() {
    audioElementSource.connect(foaRenderer.input);
    foaRenderer.output.connect(audioContext.destination);
    audioElement.play();
    });
}

//init() gets executed once
function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xcce0ff );
	scene.fog = new THREE.Fog( 0xcce0ff, 500, 20000 );
		
	clock = new THREE.Clock();
	
	audioAPI();
			
    createRenderer();
    createCamera();
    createLight();
    buildGui();
    
    shaders();
    video();
    sky();
	createFloor();
    loadModels();
	loadCampusBuilding();
	
	animateLight();
	animateCamera();
	
	
    document.body.appendChild(renderer.domElement);

    //render() gets called at end of init
    //as it looped forever
    render();
}

//infinite loop
function render() {
if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
	{
		videoImageContext.drawImage( video, 0, 0 );
		if ( videoTexture ) 
			videoTexture.needsUpdate = true;
	}
	
var delta = clock.getDelta();
		uniforms1.time.value += delta * 5;
		uniforms2.time.value = clock.elapsedTime;
	
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
// lightHelper.update();
//shadowCameraHelper.update();
}

init();