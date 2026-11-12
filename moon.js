import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// =====================================================
// EQUIPMENT DATA
// REAL NASA/JPL LOCATIONS
// =====================================================

const equipmentData = {

    lrrr: {
        name: "Laser Ranging Retroreflector",

        date: "21 July 1969 — Apollo 11",

        function:
            "A precision optical reflector array used to reflect laser pulses from Earth and measure the Earth–Moon distance.",

        reason:
            "The LRRR was left on the lunar surface so scientists could continue making precise measurements of the Earth–Moon distance after the astronauts departed.",

        image: "./moon images/lrrr.jpg",

        source:
            "https://www.nasa.gov/missions/apollo/apollo-11/the-apollo-experiment-that-keeps-on-giving/",

        // NASA/JPL
        lat: 0.67337,
        lon: 23.47293
    },


    psep: {
        name: "Passive Seismic Experiment Package",

        date: "21 July 1969 — Apollo 11",

        function:
            "A scientific instrument designed to detect and measure seismic activity on the Moon, including moonquakes and impacts.",

        reason:
            "The PSEP was deployed on the lunar surface so it could continue collecting scientific data after the astronauts departed.",

        image: "./moon images/psep.jpg",

        source:
            "https://science.nasa.gov/resource/apollo-11-seismic-experiment/",

        // NASA/JPL
        lat: 0.67322,
        lon: 23.47299
    }

};


// =====================================================
// THREE.JS SETUP
// =====================================================

const moonContainer =
    document.getElementById("moon3d");

const scene =
    new THREE.Scene();


const camera =
    new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

camera.position.set(
    0,
    0,
    3.2
);


const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


moonContainer.appendChild(
    renderer.domElement
);


// =====================================================
// LIGHTING
// =====================================================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1.5
    );

scene.add(
    ambientLight
);


const directionalLight =
    new THREE.DirectionalLight(
        0xffffff,
        2.5
    );

directionalLight.position.set(
    5,
    3,
    5
);

scene.add(
    directionalLight
);


// =====================================================
// MOON
// =====================================================

const moonGroup =
    new THREE.Group();

scene.add(
    moonGroup
);


const textureLoader =
    new THREE.TextureLoader();


const moonTexture =
    textureLoader.load(
        "./models/moon_small.jpg"
    );


moonTexture.colorSpace =
    THREE.SRGBColorSpace;


moonTexture.anisotropy =
    renderer
        .capabilities
        .getMaxAnisotropy();


const moonGeometry =
    new THREE.SphereGeometry(
        1,
        128,
        128
    );


const moonMaterial =
    new THREE.MeshStandardMaterial({
        map: moonTexture,
        roughness: 1,
        metalness: 0
    });


const moon =
    new THREE.Mesh(
        moonGeometry,
        moonMaterial
    );


moonGroup.add(
    moon
);


// =====================================================
// LATITUDE / LONGITUDE → 3D
// =====================================================

function latLonToVector3(
    lat,
    lon,
    radius = 1.03
) {

    const phi =
        (90 - lat) *
        Math.PI /
        180;


    const theta =
        (lon + 180) *
        Math.PI /
        180;


    const x =
        -radius *
        Math.sin(phi) *
        Math.cos(theta);


    const y =
        radius *
        Math.cos(phi);


    const z =
        radius *
        Math.sin(phi) *
        Math.sin(theta);


    return new THREE.Vector3(
        x,
        y,
        z
    );
}


// =====================================================
// MARKERS
// =====================================================

const markerElements =
    document.querySelectorAll(
        ".equipment-marker"
    );


const markerObjects = [];


// Small VISUAL separation.
// IMPORTANT:
// This does NOT change the stored NASA coordinates.
// It only makes two very close markers easier to see.

const visualOffsets = {

    lrrr: {
        x: -14,
        y: 0
    },

    psep: {
        x: 14,
        y: 0
    }

};


markerElements.forEach(
    marker => {

        const id =
            marker.dataset.equipment;


        const data =
            equipmentData[id];


        if (!data) return;


        const position =
            latLonToVector3(
                data.lat,
                data.lon
            );


        markerObjects.push({

            element: marker,

            position: position,

            id: id,

            offset:
                visualOffsets[id] || {
                    x: 0,
                    y: 0
                }

        });


        marker.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                openEquipment(id);

            }
        );

    }
);


// =====================================================
// MARKER POSITIONING
// =====================================================

const worldPosition =
    new THREE.Vector3();


const screenPosition =
    new THREE.Vector3();


function updateMarkers() {

    markerObjects.forEach(
        marker => {

            // Get the REAL 3D NASA location
            worldPosition
                .copy(marker.position)
                .applyMatrix4(
                    moonGroup.matrixWorld
                );


            // Project to screen
            screenPosition
                .copy(worldPosition)
                .project(camera);


            let x =
                (
                    screenPosition.x *
                    0.5 +
                    0.5
                ) *
                window.innerWidth;


            let y =
                (
                    -screenPosition.y *
                    0.5 +
                    0.5
                ) *
                window.innerHeight;


            // Visual separation only
            x += marker.offset.x;
            y += marker.offset.y;


            marker.element.style.left =
                `${x}px`;


            marker.element.style.top =
                `${y}px`;


            // =================================================
            // CHECK IF LOCATION IS ON FRONT OF MOON
            // =================================================

            const cameraDirection =
                camera.position
                    .clone()
                    .sub(worldPosition)
                    .normalize();


            const surfaceNormal =
                worldPosition
                    .clone()
                    .normalize();


            const visible =
                surfaceNormal.dot(
                    cameraDirection
                ) > 0;


            if (visible) {

                marker.element.style.opacity =
                    "1";

                marker.element.style.pointerEvents =
                    "auto";

            } else {

                marker.element.style.opacity =
                    "0";

                marker.element.style.pointerEvents =
                    "none";

            }

        }
    );

}


// =====================================================
// INFORMATION CARD
// =====================================================

const infoCard =
    document.getElementById(
        "infoCard"
    );


const equipmentImage =
    document.getElementById(
        "equipmentImage"
    );


const equipmentName =
    document.getElementById(
        "equipmentName"
    );


const equipmentDate =
    document.getElementById(
        "equipmentDate"
    );


const equipmentFunction =
    document.getElementById(
        "equipmentFunction"
    );


const equipmentReason =
    document.getElementById(
        "equipmentReason"
    );


const nasaSource =
    document.getElementById(
        "nasaSource"
    );


const closeCard =
    document.getElementById(
        "closeCard"
    );


const instruction =
    document.getElementById(
        "instruction"
    );


let selectedEquipment =
    null;


// =====================================================
// OPEN EQUIPMENT
// =====================================================

function openEquipment(id) {

    const data =
        equipmentData[id];


    if (!data) return;


    selectedEquipment =
        id;


    equipmentName.textContent =
        data.name;


    equipmentDate.textContent =
        data.date;


    equipmentFunction.textContent =
        data.function;


    equipmentReason.textContent =
        data.reason;


    equipmentImage.src =
        data.image;


    equipmentImage.alt =
        data.name;


    nasaSource.href =
        data.source;


    infoCard.classList.add(
        "active"
    );


    instruction.style.opacity =
        "0";

}


// =====================================================
// CLOSE CARD
// =====================================================

closeCard.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        selectedEquipment =
            null;


        infoCard.classList.remove(
            "active"
        );


        instruction.style.opacity =
            "1";

    }
);


// =====================================================
// BACK BUTTON
// =====================================================

const backBtn =
    document.getElementById(
        "backBtn"
    );


backBtn.addEventListener(
    "click",
    () => {

        window.history.back();

    }
);


// =====================================================
// DRAG / ROTATE
// =====================================================

let isDragging =
    false;


let autoRotate =
    true;


let previousX =
    0;


let previousY =
    0;


renderer.domElement.addEventListener(
    "pointerdown",
    event => {

        isDragging =
            true;


        autoRotate =
            false;


        previousX =
            event.clientX;


        previousY =
            event.clientY;


        renderer.domElement.setPointerCapture(
            event.pointerId
        );

    }
);


renderer.domElement.addEventListener(
    "pointermove",
    event => {

        if (!isDragging)
            return;


        const deltaX =
            event.clientX -
            previousX;


        const deltaY =
            event.clientY -
            previousY;


        moonGroup.rotation.y +=
            deltaX * 0.008;


        moonGroup.rotation.x +=
            deltaY * 0.008;


        moonGroup.rotation.x =
            Math.max(
                -Math.PI / 2,
                Math.min(
                    Math.PI / 2,
                    moonGroup.rotation.x
                )
            );


        previousX =
            event.clientX;


        previousY =
            event.clientY;

    }
);


renderer.domElement.addEventListener(
    "pointerup",
    event => {

        isDragging =
            false;


        if (
            renderer.domElement.hasPointerCapture(
                event.pointerId
            )
        ) {

            renderer.domElement.releasePointerCapture(
                event.pointerId
            );

        }

    }
);


renderer.domElement.addEventListener(
    "pointercancel",
    () => {

        isDragging =
            false;

    }
);


// =====================================================
// TOUCH
// =====================================================

renderer.domElement.addEventListener(
    "touchstart",
    event => {

        if (
            event.touches.length !== 1
        )
            return;


        isDragging =
            true;


        autoRotate =
            false;


        previousX =
            event.touches[0].clientX;


        previousY =
            event.touches[0].clientY;

    },
    {
        passive: true
    }
);


renderer.domElement.addEventListener(
    "touchmove",
    event => {

        if (
            !isDragging ||
            event.touches.length !== 1
        )
            return;


        const currentX =
            event.touches[0].clientX;


        const currentY =
            event.touches[0].clientY;


        const deltaX =
            currentX -
            previousX;


        const deltaY =
            currentY -
            previousY;


        moonGroup.rotation.y +=
            deltaX * 0.008;


        moonGroup.rotation.x +=
            deltaY * 0.008;


        moonGroup.rotation.x =
            Math.max(
                -Math.PI / 2,
                Math.min(
                    Math.PI / 2,
                    moonGroup.rotation.x
                )
            );


        previousX =
            currentX;


        previousY =
            currentY;

    },
    {
        passive: true
    }
);


renderer.domElement.addEventListener(
    "touchend",
    () => {

        isDragging =
            false;

    }
);


// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


// =====================================================
// ANIMATION
// =====================================================

function animate() {

    requestAnimationFrame(
        animate
    );


    if (
        autoRotate &&
        !isDragging &&
        !selectedEquipment
    ) {

        moonGroup.rotation.y +=
            0.0015;

    }


    moonGroup.updateMatrixWorld(
        true
    );


    camera.lookAt(
        0,
        0,
        0
    );


    updateMarkers();


    renderer.render(
        scene,
        camera
    );

}


animate();