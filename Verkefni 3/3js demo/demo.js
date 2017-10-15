(function() {

	function main() {

		let scene = new THREE.Scene();
		let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

		let renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.enableKeys = false;
		controls.enablePan = false;

		window.addEventListener('resize', function() {
			let width = window.innerWidth;
			let height = window.innerHeight;
			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		})

		renderer.setClearColor(0x333333);
		renderer.setPixelRatio(window.devicePixelRatio);

		let loader = new THREE.TextureLoader()
		let cubeTexture = loader.load( "textures/water.jpg" );
		let sphereTexture = loader.load( "textures/water2.jpg");
		let bulletTexture = loader.load( "textures/cannonball.jpg");

		let material1 = new THREE.MeshLambertMaterial({ color:0xffffff, map: cubeTexture, side:THREE.FrontSide });
		let material2 = new THREE.MeshLambertMaterial({ color:0xffffff, map: sphereTexture, side:THREE.BackSide });
		let material3 = new THREE.MeshLambertMaterial({ color:0xffffff, map: bulletTexture, side:THREE.FrontSide });

		let cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
		let cube = new THREE.Mesh( cubeGeometry, material1 );

		let sphereGeometry = new THREE.SphereGeometry(20, 128, 128);
		let sphere = new THREE.Mesh( sphereGeometry, material2 );

		let ambientLight = new THREE.AmbientLight( 0x808080, 1 ); // soft white light
		let pointLight1 = new THREE.PointLight(0xffffff, 1, 5);
		let pointLight2 = new THREE.PointLight(0xffffff, 1, 5);

		let objectLoader = new THREE.ObjectLoader();
		let teapot = objectLoader.load("teapot-claraio.json", function ( obj ) {
			obj.position.set(0, -1, -5);
		 	scene.add( obj );
		} );


		camera.position.z = 3;
		pointLight1.position.set(0,0,3);
		pointLight2.position.set(0,0,-3);

		scene.add( cube );
		scene.add( sphere );
		scene.add( ambientLight );
		scene.add( pointLight1 );
		scene.add( pointLight2 );

		spheres = [];

		renderer.domElement.addEventListener("contextmenu", function(event) {

			let sGeo = new THREE.SphereGeometry(0.5, 32, 32);
			let s = new THREE.Mesh( sGeo, material3 );
			let vector = new THREE.Vector3(0, 0, -1,).applyQuaternion( camera.quaternion );

			let scalar = 5.0; //Speed multiplier

			vector.multiplyScalar(scalar);

			s.position.copy(camera.position);
			s.position.add(vector.clone().normalize());

			spheres.push([s, vector]);
			scene.add(s);
			
		});


		let then = 0;
		function animate(now) {
			// body...
			requestAnimationFrame( animate );

		    now *= 0.001;  // convert to seconds
		 	const deltaTime = now - then;
		    then = now;

			cube.rotation.x += deltaTime;
			cube.rotation.y += deltaTime;

			cube.scale.x += (Math.random() - 0.5) / 10;
			cube.scale.y += (Math.random() - 0.5) / 10;
			cube.scale.z += (Math.random() - 0.5) / 10;

			cube.scale.x = Math.abs(cube.scale.x);
			cube.scale.y = Math.abs(cube.scale.y);
			cube.scale.z = Math.abs(cube.scale.z);

			for (var i = spheres.length - 1; i >= 0; i--) {
				let s = spheres[i][0];
				let vel = spheres[i][1].clone();
				vel.multiplyScalar(deltaTime);
				s.position.add(vel);
				let sr = Math.abs(Math.pow(s.position.x, 3) + Math.pow(s.position.y, 3) + Math.pow(s.position.z, 3));
				let maxr = Math.pow(sphere.geometry.parameters.radius + s.geometry.parameters.radius, 3);
				if (sr > maxr) {
					scene.remove(spheres[i][0]);
					spheres.splice(i, 1);
				}
			}

			controls.update();

			renderer.render(scene, camera);
		};
		requestAnimationFrame(animate);
	}

	window.addEventListener("load", main);
})();
