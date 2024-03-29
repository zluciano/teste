let
    scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
    renderer = new THREE.WebGLRenderer({
        antialias: true
    }),
    controls = new THREE.OrbitControls(camera),
    //axesHelper = new THREE.AxesHelper(5),
		amb = new THREE.AmbientLight(0x404040),
		// Pure red light.
		light = new THREE.PointLight({
				color: 0xffffff,
				decay: 2
		}),
		// Visualize point light location.
		helper = new THREE.PointLightHelper(light, 0.1),
    keyboard = new KeyboardState();

camera.position.set(40,40,0);
camera.lookAt(0, 0, 0)

renderer.setSize(window.innerWidth*0.994, window.innerHeight*0.994);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

light.castShadow = true;
light.position.y = 10;
light.intensity = 2;

//scene.add(axesHelper);
scene.add(amb);
scene.add(light);
scene.add(helper);
const loader = new THREE.TextureLoader();
const bgTexture = loader.load('back.jpg');
scene.background = bgTexture;

const loaderFloor = new THREE.TextureLoader();
const textureFloor = loaderFloor.load('floor.jpg');
planeMat = new THREE.MeshLambertMaterial({ map : textureFloor })

const loaderWall = new THREE.TextureLoader();
const textureWall = loaderWall.load('wall.jpg');
wallMat = new THREE.MeshLambertMaterial({ map : textureWall })

var listener = new THREE.AudioListener();
camera.add( listener );
var sound = new THREE.Audio( listener );

var audioLoader = new THREE.AudioLoader();

audioLoader.load( 'fight.mp3', function( buffer ) {
  sound.setBuffer( buffer );
  sound.setLoop( true );
  sound.setVolume( 0.5 );
  sound.play();
});

planegeom = new THREE.PlaneGeometry(50, 50)
plane = new THREE.Mesh(planegeom, planeMat);
plane.castShadow = true; //default is false
plane.receiveShadow = true;

plane.rotation.x = -Math.PI * (1/2)
plane.position.x = 2
plane.position.z = 0

var geometry = new THREE.CylinderGeometry( 1.5, 1.5, 2000, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var cylinder = new THREE.Mesh( geometry, material );

// scene.add(plane)

var spheregeom = new THREE.BoxGeometry(1, 1, 1)
var spheremat = new THREE.MeshLambertMaterial({
    color: 0x800000
});
var sphere = new THREE.Mesh(spheregeom, spheremat);
sphere.castShadow = true; //default is false
sphere.receiveShadow = true;

sphere.position.x = 0
sphere.position.y = 1/2
sphere.position.z = 20

var planeBase = new THREE.Object3D()
var sphereBase = new THREE.Object3D()
planeBase.add(plane)
planeBase.add(sphereBase)
sphereBase.add(sphere)
planeBase.add(cylinder)

cylinder.position.z = -20
cylinder.position.x = -21
cylinder.position.y = cylinder.geometry.parameters.height/2
cylinder.material.transparent = true
cylinder.material.opacity = 0.4

console.log(cylinder)

var text2 = document.getElementById('demo');
text2.style.position = 'absolute';
//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
//text2.style.backgroundColor = "blue";
text2.innerHTML = "GAME OVER";
text2.style.fontSize = "50px"
text2.style.top = 200 + 'px'
text2.style.left = 500 + 'px'
text2.style.color = "#ff0000"
//text2.style.backgroundImage = "url('forster.jpg')"
text2.style.opacity = "0"
document.body.appendChild(text2);

var text3 = document.getElementById('win');
text3.style.position = 'absolute';
text3.innerHTML = "YOU DID IT";
text3.style.fontSize = "50px"
text3.style.top = 200 + 'px'
text3.style.left = 500 + 'px'
text3.style.color = "#ffff00"
text3.style.opacity = "0"
document.body.appendChild(text3);

console.log(text2.style)

var borders = new THREE.Group();
var getBorder = (pos_x,pos_y,pos_z,x,y,z, rot_x) => {
  var border = new THREE.Mesh(new THREE.BoxGeometry(x,y,z), new THREE.MeshLambertMaterial({ map : textureWall }));
  border.position.x = pos_x
  border.position.y = pos_y
  border.position.z = pos_z
  border.rotation.y = rot_x
  return border
}

var safeBorders = new THREE.Group();
var getSafeBorder = (pos_x,pos_y,pos_z,x,y,z, rot_x) => {
  var border = new THREE.Mesh(new THREE.BoxGeometry(x,y,z), new THREE.MeshLambertMaterial({color: 0x0000a5}));
  border.position.x = pos_x
  border.position.y = pos_y
  border.position.z = pos_z
  border.rotation.y = rot_x
  return border
}

var bo
var safe = []
var unsafe = []

bo = getSafeBorder(2,0,-25,50,1,1,0)
safeBorders.add(bo)
safe.push(bo)
bo = getSafeBorder(2,0,25,50,1,1,0)
safeBorders.add(bo)
safe.push(bo)
bo = getSafeBorder(-23,0,0,1,1,50,0)
safeBorders.add(bo)
safe.push(bo)
bo = getSafeBorder(27,0,0,1,1,50,0)
safeBorders.add(bo)
safe.push(bo)
bo = getBorder(2,0,-10,10,1,1,0)
borders.add(bo)
unsafe.push(bo)
bo = getBorder(2,0,10,10,1,1,0)
borders.add(bo)
unsafe.push(bo)
bo = getBorder(-10,0,0,1,1,10,0)
borders.add(bo)
unsafe.push(bo)
bo = getBorder(10,0,0,1,1,10,0)
borders.add(bo)
unsafe.push(bo)
bo = getBorder(2,0,-15,10,1,1,0)
borders.add(bo)
unsafe.push(bo)
bo = getBorder(2,0,15,10,1,1,0)
borders.add(bo)
unsafe.push(bo)
bo = getBorder(-15,0,0,1,1,10,0)
borders.add(bo)
unsafe.push(bo)
bo = getBorder(15,0,0,1,1,10,0)
borders.add(bo)
unsafe.push(bo)
bo = getBorder(17,0,-15,1,1,10,Math.PI/4)
borders.add(bo)
unsafe.push(bo)
bo = getBorder(-15,0,-17,1,1,10,-Math.PI/4)
borders.add(bo)
unsafe.push(bo)
bo = getBorder(-15,0,17,1,1,10,Math.PI/4)
borders.add(bo)
unsafe.push(bo)
bo = getBorder(19,0,17,1,1,10,-Math.PI/4)
borders.add(bo)
unsafe.push(bo)
planeBase.add(safeBorders)
planeBase.add(borders)

scene.add(planeBase)

var sphere_velocity = 0
var gravity = 0.05
var vmax = 0.1

rotateLeft = false
let rotatePlane = () => {
  if(rotateLeft) {
    if(planeBase.rotation.x > -Math.PI * (1/16))
      planeBase.rotation.x -= Math.PI * 0.002
    //else
      //rotateLeft = !rotateLeft
  } else {
    if(planeBase.rotation.x < Math.PI * (1/16))
      planeBase.rotation.x += Math.PI * 0.002
    //else
     // rotateLeft = !rotateLeft
  }
}

let getGravity = () => {
  return gravity * Math.sin(planeBase.rotation.x)
}

console.log('oi lindo')

let isInside = (box, block) => {
  vertsBox = [new THREE.Vector2(box.position.x + box.geometry.parameters.width/2, box.position.z + box.geometry.parameters.depth/2),
            new THREE.Vector2(box.position.x + box.geometry.parameters.width/2, box.position.z - box.geometry.parameters.depth/2),
            new THREE.Vector2(box.position.x - box.geometry.parameters.width/2, box.position.z - box.geometry.parameters.depth/2),
            new THREE.Vector2(box.position.x - box.geometry.parameters.width/2, box.position.z + box.geometry.parameters.depth/2)]
  vertsBlock = [new THREE.Vector2(block.position.x + (Math.cos(block.rotation.y) * block.geometry.parameters.width/2 + Math.sin(block.rotation.y) * block.geometry.parameters.depth/2), block.position.z + (Math.cos(block.rotation.y) * block.geometry.parameters.depth/2 - Math.sin(block.rotation.y) * block.geometry.parameters.width/2)),
              new THREE.Vector2(block.position.x + (Math.cos(block.rotation.y) * block.geometry.parameters.width/2 - Math.sin(block.rotation.y) * block.geometry.parameters.depth/2), block.position.z + (-Math.cos(block.rotation.y) * block.geometry.parameters.depth/2 - Math.sin(block.rotation.y) * block.geometry.parameters.width/2)),
              new THREE.Vector2(block.position.x + (-Math.cos(block.rotation.y) * block.geometry.parameters.width/2 - Math.sin(block.rotation.y) * block.geometry.parameters.depth/2), block.position.z + (-Math.cos(block.rotation.y) * block.geometry.parameters.depth/2 + Math.sin(block.rotation.y) * block.geometry.parameters.width/2)),
              new THREE.Vector2(block.position.x + (-Math.cos(block.rotation.y) * block.geometry.parameters.width/2 + Math.sin(block.rotation.y) * block.geometry.parameters.depth/2), block.position.z + (Math.cos(block.rotation.y) * block.geometry.parameters.depth/2 + Math.sin(block.rotation.y) * block.geometry.parameters.width/2))]
    sum = block.geometry.parameters.width + block.geometry.parameters.depth

  for(i=0; i<4; i++) {
    distance = Math.abs((vertsBlock[1].y - vertsBlock[0].y) * vertsBox[i].x + (vertsBlock[0].x - vertsBlock[1].x) * vertsBox[i].y + vertsBlock[1].x * vertsBlock[0].y - vertsBlock[1].y * vertsBlock[0].x)/Math.sqrt((vertsBlock[1].y - vertsBlock[0].y)*(vertsBlock[1].y - vertsBlock[0].y) + (vertsBlock[0].x - vertsBlock[1].x)*(vertsBlock[0].x - vertsBlock[1].x))
    distance += Math.abs((vertsBlock[2].y - vertsBlock[1].y) * vertsBox[i].x + (vertsBlock[1].x - vertsBlock[2].x) * vertsBox[i].y + vertsBlock[2].x * vertsBlock[1].y - vertsBlock[2].y * vertsBlock[1].x)/Math.sqrt((vertsBlock[2].y - vertsBlock[1].y)*(vertsBlock[2].y - vertsBlock[1].y) + (vertsBlock[1].x - vertsBlock[2].x)*(vertsBlock[1].x - vertsBlock[2].x))
    distance += Math.abs((vertsBlock[3].y - vertsBlock[2].y) * vertsBox[i].x + (vertsBlock[2].x - vertsBlock[3].x) * vertsBox[i].y + vertsBlock[3].x * vertsBlock[2].y - vertsBlock[3].y * vertsBlock[2].x)/Math.sqrt((vertsBlock[3].y - vertsBlock[2].y)*(vertsBlock[3].y - vertsBlock[2].y) + (vertsBlock[2].x - vertsBlock[3].x)*(vertsBlock[2].x - vertsBlock[3].x))
    distance += Math.abs((vertsBlock[0].y - vertsBlock[3].y) * vertsBox[i].x + (vertsBlock[3].x - vertsBlock[0].x) * vertsBox[i].y + vertsBlock[0].x * vertsBlock[3].y - vertsBlock[0].y * vertsBlock[3].x)/Math.sqrt((vertsBlock[0].y - vertsBlock[3].y)*(vertsBlock[0].y - vertsBlock[3].y) + (vertsBlock[3].x - vertsBlock[0].x)*(vertsBlock[3].x - vertsBlock[0].x))
    //console.log(distance)
    if(distance < sum+0.001) {
      return true
    }
  }
  return false
}

let win = (box, spot) => {
  vertsBox = [new THREE.Vector2(box.position.x + box.geometry.parameters.width/2, box.position.z + box.geometry.parameters.depth/2),
    new THREE.Vector2(box.position.x + box.geometry.parameters.width/2, box.position.z - box.geometry.parameters.depth/2),
    new THREE.Vector2(box.position.x - box.geometry.parameters.width/2, box.position.z - box.geometry.parameters.depth/2),
    new THREE.Vector2(box.position.x - box.geometry.parameters.width/2, box.position.z + box.geometry.parameters.depth/2)]
    distance1 = Math.sqrt((vertsBox[0].x - spot.position.x)*(vertsBox[0].x - spot.position.x) + (vertsBox[0].y - spot.position.z)*(vertsBox[0].y - spot.position.z))
    distance2 = Math.sqrt((vertsBox[1].x - spot.position.x)*(vertsBox[1].x - spot.position.x) + (vertsBox[1].y - spot.position.z)*(vertsBox[1].y - spot.position.z))
    distance3 = Math.sqrt((vertsBox[2].x - spot.position.x)*(vertsBox[2].x - spot.position.x) + (vertsBox[2].y - spot.position.z)*(vertsBox[2].y - spot.position.z))
    distance4 = Math.sqrt((vertsBox[3].x - spot.position.x)*(vertsBox[3].x - spot.position.x) + (vertsBox[3].y - spot.position.z)*(vertsBox[3].y - spot.position.z))
    if(distance1 < spot.geometry.parameters.radiusTop && distance2 < spot.geometry.parameters.radiusTop && distance3 < spot.geometry.parameters.radiusTop && distance4 < spot.geometry.parameters.radiusTop) {
      console.log("uhuuuul")
      return true
    }
    else {
      return false
    }
}

let applyPhysicsToSphere = () => {
  if(sphere.position.z + sphere_velocity > safe[1].position.z - (safe[1].geometry.parameters.depth + sphere.geometry.parameters.width)/2) {
    sphere.position.z = safe[1].position.z - (safe[1].geometry.parameters.depth + sphere.geometry.parameters.width)/2
    sphere_velocity = 0
  }
  else if(sphere.position.z + sphere_velocity < safe[0].position.z + (safe[0].geometry.parameters.depth + sphere.geometry.parameters.width)/2) {
    sphere.position.z = safe[0].position.z + (safe[0].geometry.parameters.depth + sphere.geometry.parameters.width)/2
    sphere_velocity = 0
  }
  else {
    sphere.position.z += sphere_velocity
  }
  sphere_velocity += getGravity() - Math.abs(getGravity()) * sphere_velocity/vmax
}

console.log(scene)
var gameOver = false
var winner = false
var t = 0
var alpha = 0
var beta = 0

var animate = function() {
    
    requestAnimationFrame(animate)
    if(!gameOver && !winner) {
      rotatePlane()
      applyPhysicsToSphere()

      keyboard.update()

      if( isInside(sphere, unsafe[0]) ) {
        unsafe[0].material.color.set( 0xff0000 )
        gameOver = true
      }

      if( isInside(sphere, unsafe[1]) ) {
        unsafe[1].material.color.set( 0xff0000 )
        gameOver = true
      }

      if( isInside(sphere, unsafe[2]) ) {
        unsafe[2].material.color.set( 0xff0000 )
        gameOver = true
      }

      if( isInside(sphere, unsafe[3]) ) {
        unsafe[3].material.color.set( 0xff0000 )
        gameOver = true
      }

      if( isInside(sphere, unsafe[4]) ) {
        unsafe[4].material.color.set( 0xff0000 )
        gameOver = true
      }

      if( isInside(sphere, unsafe[5]) ) {
        unsafe[5].material.color.set( 0xff0000 )
        gameOver = true
      }

      if( isInside(sphere, unsafe[6]) ) {
        unsafe[6].material.color.set( 0xff0000 )
        gameOver = true
      }

      if( isInside(sphere, unsafe[7]) ) {
        unsafe[7].material.color.set( 0xff0000 )
        gameOver = true
      }

      if( isInside(sphere, unsafe[8]) ) {
        unsafe[8].material.color.set( 0xff0000 )
        gameOver = true
      }

      if( isInside(sphere, unsafe[9]) ) {
        unsafe[9].material.color.set( 0xff0000 )
        gameOver = true
      }

      if( isInside(sphere, unsafe[10]) ) {
        unsafe[10].material.color.set( 0xff0000 )
        gameOver = true
      }

      if( isInside(sphere, unsafe[11]) ) {
        unsafe[11].material.color.set( 0xff0000 )
        gameOver = true
      }

      if( win(sphere, cylinder) ) {
        winner = true
        sound.stop();
        audioLoader.load( '8bit.mp3', function( buffer ) {
          sound.setBuffer( buffer );
          sound.setLoop( true );
          sound.setVolume( 0.5 );
          sound.play();
        });
      }

      //sphere_velocity = -(sphere.position.z - safe[0].position.z)/100

      if ( keyboard.down("left") )
        rotateLeft = false
      if( keyboard.down("right"))
        rotateLeft = true
      if( keyboard.pressed("up") && sphere.position.x > safe[2].position.x + (safe[2].geometry.parameters.width + sphere.geometry.parameters.width)/2)
        sphere.position.x -= vmax
      if( keyboard.pressed("down") && sphere.position.x < safe[3].position.x - (safe[3].geometry.parameters.width + sphere.geometry.parameters.width)/2)
        sphere.position.x += vmax
    }
    else if(!winner){
      if(t==0) {
        sound.stop();
        audioLoader.load( 'sad.mp3', function( buffer ) {
          sound.setBuffer( buffer );
          sound.setLoop( true );
          sound.setVolume( 0.5 );
          sound.play();
        });
      }
      if(t<1) {
        camera.position.x = 40*(1-t) + t * sphere.position.x
        camera.position.y = 40*(1-t) + t * (sphere.position.y + 25)
        camera.position.z = t * sphere.position.z
        text2.style.opacity = t
      }
      else {
        if(alpha==0){
          alpha = camera.position.x
          beta = camera.position.z
        }
        camera.position.x = alpha*Math.cos(t-1) - beta*Math.sin(t-1)
        camera.position.z = beta*Math.cos(t-1) + alpha*Math.sin(t-1)
      }
      if(t>1 && t<3) {
        light.intensity = 2*(1.5-0.5*t)
        amb.color.r = (1.5-0.5*t)*40/255
        amb.color.g = (1.5-0.5*t)*40/255
        amb.color.b = (1.5-0.5*t)*40/255
      }
      else if(t>1) {
        light.intensity = 0
        amb.color.r = 0
        amb.color.g = 0
        amb.color.b = 0
      }
      t += 0.01
    }
    else {
      if(alpha == 0) {
        alpha = camera.position.x
        beta = camera.position.y
        gamma = camera.position.z
      }
      if(t<=1) {
        cylinder.material.color.b = t
        sphere.material.color.r = 1-t
        text3.style.opacity = t
      }
      else {
        sphere.position.y += t-1
      }
      camera.position.x = alpha
      camera.position.y = beta
      camera.position.z = gamma
      light.color.r = Math.cos(2*t)
      light.color.g = Math.cos(5*t)
      light.color.b = Math.cos(7*t)
      t += 0.01
    }
    controls.update()
    renderer.render(scene, camera);
};

animate();
