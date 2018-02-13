
var renderer, scene, camera;

var cameraZ = 100;

const scall = 65;

const circleSize = [12.5, 25, 45];

const interval = 1;

with(Math) {
    var trigoCircle = [
        [0, 1],
        [1/2, sqrt(3)/2],
        [sqrt(3)/2, 1/2],
        [1, 0],
        [sqrt(3)/2, -1/2],
        [1/2, -sqrt(3)/2],
        [0, -1],
        [-1/2, -sqrt(3)/2],
        [-sqrt(3)/2, -1/2],
        [-1, 0],
        [-sqrt(3)/2, 1/2],
        [-1/2, sqrt(3)/2]
    ];
}

var listen = [
    70.98972336,
    38.54596978,
    78.51562328,
    33.40830006,
    12.26479929,
    66.31250841,
    57.04290894,
    89.13390786,
    78.84897795,
    60.44050702,
    43.8293792,
    55.6542152
];

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

init();
listen = scallIt(listen);
circle(circleSize[2], true);
circle(circleSize[1], false);
circle(circleSize[0], false);
axes();
interPoints(new THREE.Vector3(
    trigoCircle[7][0]*listen[7],
    trigoCircle[7][1]*listen[7],
    0));
// linkPoints();
// displayPoints();


var i=0;
while(i<12) {
    // splineWave(i);
    i++;
}
render();

function interPoints(max=null) {

    var material = new THREE.PointsMaterial( { color: 0xffff00 } );

    var nbPoints = 10;
    var x = y = 0;
    var intervalX;
    var intervalY;

    if(max){
        console.log(max);
        x = max.x;
        y = max.y;
    }
    else {
        while(x==0 && y==0) {
            x = getRandomInt(-60, 60);
            y = getRandomInt(-60, 60);
        }
    }
   
    intervalX = x/nbPoints;
    intervalY = y/nbPoints;

    var geometry = new THREE.Geometry();

    with(Math) {
        var i = abs(x)/abs(intervalX);
        var j = abs(y)/abs(intervalY);
    }

    while(Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2) )>circleSize[0]) {
        console.log(circleSize[0] + ' || ' + Math.sqrt( Math.pow(x) + Math.pow(y) ));
        geometry.vertices.push(new THREE.Vector3(x, y, 0));      
        x -= intervalX;
        y -= intervalY;
        i--;
        j--;
    }

    var points = new THREE.Points(geometry, material);

    traceWave(geometry.vertices, new THREE.Vector3(0, 50, 0), new THREE.Vector3(0, -50, 0));

    scene.add(points);
}

function traceWave(pointsArray, start, end) {
    var material = new THREE.LineBasicMaterial( { color : `rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})` } );

    var i=0;

    while(i<pointsArray.length) {
        var curve = new THREE.SplineCurve([
            start,
            pointsArray[i],
            end]);
        
        var points = curve.getPoints( 500 );
        var geometry = new THREE.BufferGeometry().setFromPoints( points );
        
        //Create the final object to add to the scene
        var curveObject = new THREE.Line( geometry, material );
    
        scene.add(curveObject);

        i++;
    }
}


function init() {
    renderer = new THREE.WebGLRenderer( { alpha: true } ); // init like this
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, cameraZ);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    document.body.appendChild( renderer.domElement );
}

function render() {
    renderer.render(scene, camera);
}

function circle(rayon, plain=true) {
    var geometry = new THREE.CircleGeometry(rayon, 300);
    if(plain) {
        var material = new THREE.MeshBasicMaterial( { color: 0x515057 } );
        var circle = new THREE.Mesh( geometry, material );
    }
    else {
        var material = new THREE.LineBasicMaterial( { color: 0xDDDDDD } );
        var circle = new THREE.Line( geometry, material );
    }
    geometry.vertices.shift();
    scene.add( circle );
}

function axes() {
    var material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    var i = 0;

    while( i < 12) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(trigoCircle[i][0]*50, trigoCircle[i][1]*50, 0));
        var line = new THREE.Line(geometry, material);
        scene.add(line);
        i++;
    }
}

function displayPoints() {
    var material = new THREE.PointsMaterial( { color: 0xff0000 } );

    var i = 0;
    
    var geometry = new THREE.Geometry();
    while(i<12) {
        var x = trigoCircle[i][0]*listen[i];
        var y = trigoCircle[i][1]*listen[i];
        geometry.vertices.push(new THREE.Vector3(x, y, 0));
        i++;
    }
    var points = new THREE.Points(geometry, material);
    scene.add(points);
}

function linkPoints() {
    
    var i = 0;
    
    var pointsArray = [];
    while(i<12) {
        var x = trigoCircle[i][0]*listen[i];
        var y = trigoCircle[i][1]*listen[i];
        pointsArray.push(new THREE.Vector2(x, y));
        i++;
    }
    var x = trigoCircle[0][0]*listen[0];
    var y = trigoCircle[0][1]*listen[0];
    pointsArray.push(new THREE.Vector2(x, y));
    
    var curve = new THREE.SplineCurve(pointsArray);
    
    var points = curve.getPoints( 500 );
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    var material = new THREE.PointsMaterial( { color: 0xff00ff } );
    
    var curveObject = new THREE.Line( geometry, material );
    
    scene.add(curveObject);
}

function splineWave(nb) {
    var pointsArray = [];
    var start, end;

    if(nb-2 == -2) {
        start = [
            trigoCircle[10][0]*circleSize[0], 
            trigoCircle[10][1]*circleSize[0]
        ];
    }
    else if(nb-2 == -1) {
        start = [
            trigoCircle[11][0]*circleSize[0], 
            trigoCircle[11][1]*circleSize[0]
        ];
    }
    else {
        start = [
            trigoCircle[nb-2][0]*circleSize[0], 
            trigoCircle[nb-2][1]*circleSize[0]
        ];
    }

    if(nb+2 == 12) {
        end = [
            trigoCircle[0][0]*circleSize[1],
            trigoCircle[0][1]*circleSize[1]
        ];
    }
    else if(nb+2 == 13) {
        end = [
            trigoCircle[1][0]*circleSize[1],
            trigoCircle[1][1]*circleSize[1]
        ];
    }
    else {
        end = [
            trigoCircle[nb+2][0]*circleSize[1],
            trigoCircle[nb+2][1]*circleSize[1]
        ];
    }

    var max = [
        trigoCircle[nb][0]*listen[nb],
        trigoCircle[nb][1]*listen[nb]
    ];

    pointsArray.push(new THREE.Vector2(start[0], start[1]));
    pointsArray.push(new THREE.Vector2(max[0], max[1]));
    pointsArray.push(new THREE.Vector2(end[0], end[1]));
    
    var material = new THREE.LineBasicMaterial( { color : `rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})` } );
    
    var i=0;
    while(i<15) {
        var curve = new THREE.SplineCurve(pointsArray);
        
        var points = curve.getPoints( 500 );
        var geometry = new THREE.BufferGeometry().setFromPoints( points );
        
        //Create the final object to add to the scene
        var curveObject = new THREE.Line( geometry, material );
    
        scene.add(curveObject);

        pointsArray = bezierCurve(pointsArray, nb);

        i++;
    }
}

function bezierCurve(array, nb) {
    array[1].x -= trigoCircle[nb][0];
    array[1].y -= trigoCircle[nb][1];
    return array;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function scallIt(values) {
    var max = values.max();
    return values.map(value => {
        return scall/max*value;
    });
}
