/**
 * Created by zhangjk on 2014/12/14.
 */
var renderer;
var camera;
var scene;
var light;
var width;
var height;
var raycaster;
var mouse = new THREE.Vector2(-1, -1);
var eventY;
var cubeWidth = 32;

var initTime = 100;
var initCubeSize = 20;
var cubeSize = initCubeSize;
var cubeTable = new Hashtable();
var posUtil;
var showMaterial, selectMaterial, showMaterial2, selectMaterial2;

var selectedMesh;
var selectIndex;
var textIndex = 0;

var score = 0;
var maxScore = 0;
var scoreNum = 0;
var scoreI = 0;
var time = 0;
var target = "";

var clickTime = 0;
var gameLevel = 1;
var incearseArray = [2, 2, 3, 3, 5, 5, 10, 10, 10, 10];
var count = 1;
var animateId;


var fade = 0;

function initThree() {

    width = window.innerWidth;
    height = window.innerHeight - 50;
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0xf0f0f0);
    renderer.setSize(width, height);
    document.getElementById('canvasFrame').appendChild(renderer.domElement);

    camera = new THREE.OrthographicCamera(width / -2, width / 2,
            height / 2, height / -2, -500, 1000);

    scene = new THREE.Scene();

    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    posUtil = new SearchX.PosUtil({
        width: width * 0.8,
        height: height,
        depth: height,
        perLength: 50,
        size: cubeSize
    });

    raycaster = new THREE.Raycaster();

    initCube();
    render();

    window.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener("click", onClick, false);
}

function initCube() {

    textIndex = parseInt(Math.random() * SearchX.Pool.texts.length);
    showMaterial = getShowMaterial(SearchX.Pool.texts[textIndex][0]);
    showMaterial2 = getShowMaterial(SearchX.Pool.texts[textIndex][1]);
    selectMaterial = getSelectMaterial(SearchX.Pool.texts[textIndex][0]);
    selectMaterial2 = getSelectMaterial(SearchX.Pool.texts[textIndex][1]);


    var geometry = SearchX.Pool.getGeometry(cubeWidth);

    selectIndex = parseInt(Math.random() * cubeSize);
    var cube, mesh;
    for (var i = 0; i < cubeSize; i++) {
        if (cubeTable.containsKey(i)) {
            cube = cubeTable.get(i);
            if (i === selectIndex) {
                cube.mesh.material = showMaterial2;
            } else {
                cube.mesh.material = showMaterial;
            }
            mesh = cube.mesh;
        } else {
            if (i === selectIndex) {
                mesh = new THREE.Mesh(geometry, showMaterial2);
            } else {
                mesh = new THREE.Mesh(geometry, showMaterial);
            }
            cube = new SearchX.Cube(mesh, i, width - cubeWidth, height - cubeWidth, height - cubeWidth);
            cubeTable.put(i, cube);
        }
        var position = posUtil.getPosition(i);
        mesh.position.set(position.x, position.y, position.z);
        scene.add(mesh);
    }
}

function initMsg() {
    target = SearchX.Pool.texts[textIndex][1];
    $("#target").html(target);
    time = initTime;
    $("#time").html(time);
    score = 0;
    $("#score").html(score);
    maxScore = localStorage.getItem("maxScore");
    if (maxScore !== null && maxScore !== undefined) {
        maxScore = parseInt(maxScore);
    } else {
        maxScore = 0;
    }
    $("#maxScore").html(maxScore);
}

function render() {
    renderer.clear();
    renderer.render(scene, camera);
}

function animate() {

    animateId = requestAnimationFrame(animate);
    if (fade < 30) {
        fade++;
        return;
    }
    if (scoreI < scoreNum) {
        scoreI++;
        score += gameLevel;
        if (maxScore < score) {
            maxScore = score;
            $("#maxScore").html(maxScore);
            localStorage.setItem("maxScore", maxScore);
        }
        $("#score").html(score);

        if (time < initTime) {
            time += gameLevel;
            if (time > initTime) {
                time = initTime;
            }
            $("#time").html(time);
        }
    }
    if (count++ % 60 == 0) {
        time--;
        $("#time").html(time);
        if (time == 0) {
            lost();
            window.cancelAnimationFrame(animateId)

        }
        count = 1;
    }

    for (var i = 0; i < cubeSize; i++) {
        cubeTable.get(i).rotate();
    }


    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
    var direction = new THREE.Vector3(0, 0, 0.5).transformDirection(camera.matrixWorld);

    raycaster.set(vector, direction);

    var intersects = raycaster.intersectObjects(scene.children);

    if (eventY > height) {
        if (selectedMesh) {
            if (selectIndex == selectedMesh.name) {
                selectedMesh.material = showMaterial2;
            } else {
                selectedMesh.material = showMaterial;
            }
            selectedMesh = null;
        }
    } else {
        if (intersects.length > 0) {
            if (selectedMesh !== intersects[0].object) {
                if (selectedMesh) {
                    if (selectIndex == selectedMesh.name) {
                        selectedMesh.material = showMaterial2;
                    } else {
                        selectedMesh.material = showMaterial;
                    }
                }
                selectedMesh = intersects[0].object;
                if (selectIndex == selectedMesh.name) {
                    selectedMesh.material = selectMaterial2;
                } else {
                    selectedMesh.material = selectMaterial;
                }
            }
        } else {
            if (selectedMesh != null) {
                if (selectIndex == selectedMesh.name) {
                    selectedMesh.material = showMaterial2;
                } else {
                    selectedMesh.material = showMaterial;
                }
                selectedMesh = null;
            }
        }
    }

    render();
}

function reset() {
    scoreNum = parseInt(time / 10);
    if (scoreNum < 1) {
        scoreNum = 1;
    }
    scoreI = 0;
    clickTime++;
    if (gameLevel <= incearseArray.length && clickTime >= incearseArray[gameLevel - 1]) {
        gameLevel++;
        cubeSize += 10;
        posUtil.setSize(cubeSize);
        initCube();
        clickTime = 0;
    } else {

        textIndex = parseInt(Math.random() * SearchX.Pool.texts.length);
        showMaterial = getShowMaterial(SearchX.Pool.texts[textIndex][0]);
        showMaterial2 = getShowMaterial(SearchX.Pool.texts[textIndex][1]);
        selectMaterial = getSelectMaterial(SearchX.Pool.texts[textIndex][0]);
        selectMaterial2 = getSelectMaterial(SearchX.Pool.texts[textIndex][1]);

        var lastSelect = selectIndex;
        selectIndex = parseInt(Math.random() * cubeSize);
        while (selectIndex == lastSelect) {
            selectIndex = parseInt(Math.random() * cubeSize);
        }

        var lastCube = cubeTable.get(lastSelect);
        var position = posUtil.getPosition(lastSelect);
        lastCube.mesh.position.set(position.x, position.y, position.z);

        scene.add(lastCube.mesh)

        for (var i = 0; i < cubeSize; i++) {
            if (i == selectIndex) {
                cubeTable.get(i).mesh.material = showMaterial2;
            } else {
                cubeTable.get(i).mesh.material = showMaterial;
            }
        }
    }

    target = SearchX.Pool.texts[textIndex][1];
    $("#target").html(target);
}

function lost() {
    $.confirm({
        'message': 'GAME OVER',
        'buttons': {
            '重新开始': {
                'class': 'blue',
                'action': function () {
                    restart();
                }
            }
        }
    });
}

function restart() {
    for (var i = 0; i < cubeSize; i++) {
        scene.remove(cubeTable.get(i).mesh);
    }
    localStorage.setItem("maxScore", maxScore);
    cubeSize = initCubeSize;
    posUtil.setSize(cubeSize);
    initCube();
    initMsg();
    fade = 0;
    animate();

}

function onDocumentMouseMove(event) {
    event.preventDefault();
    var w1 = window.innerWidth;
    var h1 = window.innerHeight;
    var w2 = (w1 - width) / 2;
    eventY = event.y;
    mouse.x = ( event.clientX / width ) * 2 - 1;
    mouse.y = -( event.clientY / height ) * 2 + 1;

}

function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight - 50;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function getShowMaterial(text) {
    return SearchX.Pool.getMaterial(text, "#ffffff", "#5d4a36", 2, cubeWidth);
}

function getSelectMaterial(text) {
    return SearchX.Pool.getMaterial(text, "#ffffff", "red", 3, cubeWidth);
}

function onClick(event) {
    event.preventDefault();
    if (selectedMesh && selectedMesh.name == selectIndex) {
        scene.remove(selectedMesh);
        selectedMesh = null;
        reset();
    }
}

window.onload = function () {
    /*oDiv = document.getElementById('tip');
     for (var i = 0; i < 3; i++) {
     var oBox = document.createElement('div');
     oBox.className = 'box';

     aTime.push(oBox);
     oBox.innerHTML =
     '<span>0</span>' +
     '<div class="top"><span>0</span></div>' +
     '<div class="tran move">' +
     '<div class="front"><span>0</span></div>' +
     '<div class="back"><span>0</span></div>' +
     '</div>';

     oDiv.appendChild(oBox);
     }*/


    initThree();
    initMsg();
    $.confirm({
        'message2': '在下面的立方体中，只有一个上面的文字与其他的不同，赶快来找到它吧！！！',
        'dialogSpeed': "fast",
        'buttons': {
            '开始游戏': {
                'class': 'blue',
                'action': function () {
                    animate();
                }
            }
        }
    });
}

