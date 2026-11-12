import * as THREE from "three";


/* =====================================================
   MARS EQUIPMENT DATA
===================================================== */

const equipmentData = {

    viking1: {

        name: "Viking 1 Lander",

        date: "20 July 1976 — Viking 1",

        function:
            "A robotic lander designed to study the Martian surface, soil, atmosphere and weather, and conduct experiments related to the search for life.",

        reason:
            "Viking 1 remained on the Martian surface after its mission ended. Its final transmission was received in November 1982.",

        image:
            "./mars images/viking1.png",

        source:
            "https://science.nasa.gov/mission/viking-1/",

        lat: 22.48,

        lon: -47.97
    },


    pathfinder: {

        name: "Mars Pathfinder Lander",

        date: "4 July 1997 — Mars Pathfinder",

        function:
            "A robotic lander designed to demonstrate a new landing system and support scientific exploration of the Martian surface together with the Sojourner rover.",

        reason:
            "The Pathfinder mission ended after its final data transmission on 27 September 1997, leaving the lander on the Martian surface.",

        image:
            "./mars images/mars pathfinder lander.png",

        source:
            "https://science.nasa.gov/mission/mars-pathfinder/",

        lat: 19.13,

        lon: -33.22
    },


    sojourner: {

        name: "Sojourner Rover",

        date: "4 July 1997 — Mars Pathfinder",

        function:
            "A small robotic rover designed to explore Martian terrain and study rocks, soil and the surrounding environment.",

        reason:
            "Sojourner remained on Mars after the Pathfinder mission ended and communication with the mission was lost.",

        image:
            "./mars images/sojourner rover.png",

        source:
            "https://www.jpl.nasa.gov/missions/mars-pathfinder-sojourner-rover/",

        lat: 19.13,

        lon: -33.24
    }

};


/* =====================================================
   HTML ELEMENTS
===================================================== */

const container =
    document.getElementById(
        "mars3d-container"
    );

const infoCard =
    document.getElementById(
        "infoCard"
    );

const closeCard =
    document.getElementById(
        "closeCard"
    );

const backBtn =
    document.getElementById(
        "backBtn"
    );

const instruction =
    document.getElementById(
        "instruction"
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

const equipmentImage =
    document.getElementById(
        "equipmentImage"
    );

const nasaSource =
    document.getElementById(
        "nasaSource"
    );


/* =====================================================
   THREE.JS SCENE
===================================================== */

const scene =
    new THREE.Scene();


const camera =
    new THREE.PerspectiveCamera(
        45,
        window.innerWidth /
        window.innerHeight,
        0.1,
        100
    );


camera.position.set(
    0,
    0,
    5
);


/* =====================================================
   RENDERER
===================================================== */

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


container.appendChild(
    renderer.domElement
);


/* =====================================================
   LIGHTING
===================================================== */

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        0.35
    );

scene.add(
    ambientLight
);


const sunLight =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );


sunLight.position.set(
    5,
    3,
    5
);


scene.add(
    sunLight
);


/* =====================================================
   MARS
===================================================== */

const textureLoader =
    new THREE.TextureLoader();


const marsTexture =
    textureLoader.load(
        "./textures/mars-texture.jpg"
    );


marsTexture.colorSpace =
    THREE.SRGBColorSpace;


marsTexture.anisotropy =
    renderer.capabilities.getMaxAnisotropy();


const marsGeometry =
    new THREE.SphereGeometry(
        1.7,
        128,
        128
    );


const marsMaterial =
    new THREE.MeshStandardMaterial({

        map: marsTexture,

        roughness: 1,

        metalness: 0

    });


const mars =
    new THREE.Mesh(
        marsGeometry,
        marsMaterial
    );


scene.add(
    mars
);


/* =====================================================
   INTERACTION VARIABLES
===================================================== */

let autoRotate = true;

let isDragging = false;

let cameraMoving = false;

let selectedEquipment = null;

let pointerDownX = 0;

let pointerDownY = 0;


/* =====================================================
   START CAMERA POSITION
===================================================== */

const startCameraPosition =
    new THREE.Vector3(
        0,
        0,
        5
    );


/* =====================================================
   LATITUDE / LONGITUDE
===================================================== */

function marsCoordinates(
    latitude,
    longitude
) {

    const lat =
        THREE.MathUtils.degToRad(
            latitude
        );


    const lon =
        THREE.MathUtils.degToRad(
            longitude
        );


    const radius = 1.72;


    const x =
        radius *
        Math.cos(lat) *
        Math.cos(lon);


    const y =
        radius *
        Math.sin(lat);


    const z =
        radius *
        Math.cos(lat) *
        Math.sin(lon);


    return new THREE.Vector3(
        x,
        y,
        z
    );

}


/* =====================================================
   VISUAL OFFSETS
===================================================== */

const visualOffsets = {

    pathfinder: {
        x: -16,
        y: -8
    },

    sojourner: {
        x: 16,
        y: 8
    }

};


/* =====================================================
   CREATE EQUIPMENT MARKERS
===================================================== */

const markerElements = {};


Object.entries(
    equipmentData
).forEach(
    ([id, equipment]) => {

        const marker =
            document.createElement(
                "button"
            );


        marker.className =
            "mars-3d-marker";


        marker.dataset.equipment =
            id;


        marker.innerHTML =
            "<span></span>";


        marker.title =
            equipment.name;


        /* ---------------------------------------------
           Prevent marker click from starting drag
        --------------------------------------------- */

        marker.addEventListener(
            "pointerdown",
            event => {

                event.stopPropagation();

            }
        );


        /* ---------------------------------------------
           Click marker
        --------------------------------------------- */

        marker.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                selectEquipment(id);

            }
        );


        container.appendChild(
            marker
        );


        markerElements[id] =
            marker;

    }
);


/* =====================================================
   SELECT EQUIPMENT
===================================================== */

function selectEquipment(id) {

    const equipment =
        equipmentData[id];


    if (!equipment) {

        console.error(
            "Equipment not found:",
            id
        );

        return;

    }


    /* ---------------------------------------------
       Stop rotation
    --------------------------------------------- */

    autoRotate =
        false;


    isDragging =
        false;


    selectedEquipment =
        id;


    cameraMoving =
        true;


    /* ---------------------------------------------
       Hide instruction
    --------------------------------------------- */

    instruction.style.opacity =
        "0";


    /* ---------------------------------------------
       Fill information card
    --------------------------------------------- */

    equipmentName.textContent =
        equipment.name;


    equipmentDate.textContent =
        equipment.date;


    equipmentFunction.textContent =
        equipment.function;


    equipmentReason.textContent =
        equipment.reason;


    /* ---------------------------------------------
       Equipment image
    --------------------------------------------- */

    equipmentImage.src =
        equipment.image;


    equipmentImage.alt =
        equipment.name;


    /* ---------------------------------------------
       NASA source
    --------------------------------------------- */

    nasaSource.href =
        equipment.source;


    /* ---------------------------------------------
       Zoom to selected location
    --------------------------------------------- */

    zoomToLocation(
        equipment
    );

}


/* =====================================================
   ZOOM TO LOCATION
===================================================== */

function zoomToLocation(
    equipment
) {

    /*
       Mars itself will NOT rotate.

       We calculate the selected location
       and move the camera toward it.
    */


    const start =
        camera.position.clone();


    /* ---------------------------------------------
       Get equipment location
    --------------------------------------------- */

    const target =
        marsCoordinates(
            equipment.lat,
            equipment.lon
        );


    /* ---------------------------------------------
       Convert Mars local position
       into world position
    --------------------------------------------- */

    const worldTarget =
        target.clone();


    mars.localToWorld(
        worldTarget
    );


    /* ---------------------------------------------
       Camera direction
    --------------------------------------------- */

    const direction =
        worldTarget
            .clone()
            .normalize();


    /* ---------------------------------------------
       Zoom distance

       Smaller = closer
    --------------------------------------------- */

    const end =
        direction.multiplyScalar(
            3.0
        );


    const startTime =
        performance.now();


    const duration =
        1200;


    /* ---------------------------------------------
       Zoom animation
    --------------------------------------------- */

    function animateZoom() {

        const elapsed =
            performance.now() -
            startTime;


        const progress =
            Math.min(
                elapsed /
                duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        /* -----------------------------------------
           Move camera only
        ----------------------------------------- */

        camera.position.lerpVectors(
            start,
            end,
            eased
        );


        /*
           Look toward selected location.

           Mars itself stays still.
        */

        camera.lookAt(
            worldTarget
        );


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                animateZoom
            );

        } else {

            cameraMoving =
                false;


            infoCard.classList.add(
                "active"
            );

        }

    }


    animateZoom();

}


/* =====================================================
   CLOSE INFORMATION CARD
===================================================== */

if (closeCard) {

    closeCard.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            resetMars();

        }
    );

}


/* =====================================================
   RESET MARS
===================================================== */

function resetMars() {

    cameraMoving =
        false;


    selectedEquipment =
        null;


    isDragging =
        false;


    /* ---------------------------------------------
       Reset camera
    --------------------------------------------- */

    camera.position.copy(
        startCameraPosition
    );


    camera.lookAt(
        0,
        0,
        0
    );


    /* ---------------------------------------------
       Close card
    --------------------------------------------- */

    infoCard.classList.remove(
        "active"
    );


    /* ---------------------------------------------
       Show instruction
    --------------------------------------------- */

    instruction.style.opacity =
        "1";


    /*
       IMPORTANT:

       We do NOT set autoRotate = true.

       Once the user manually controls Mars,
       automatic rotation stays OFF.
    */

}


/* =====================================================
   BACK BUTTON
===================================================== */

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            window.history.back();

        }
    );

}


/* =====================================================
   MANUAL MARS CONTROL
===================================================== */

renderer.domElement.addEventListener(
    "pointerdown",
    event => {

        /*
           Don't allow dragging while zooming
           or when equipment is selected.
        */

        if (
            cameraMoving ||
            selectedEquipment
        ) {

            return;

        }


        isDragging =
            true;


        /*
           THIS IS THE IMPORTANT PART:

           The first manual click/drag stops
           automatic Mars rotation.
        */

        autoRotate =
            false;


        pointerDownX =
            event.clientX;


        pointerDownY =
            event.clientY;


        renderer.domElement.setPointerCapture(
            event.pointerId
        );

    }
);


/* =====================================================
   MANUAL ROTATION
===================================================== */

renderer.domElement.addEventListener(
    "pointermove",
    event => {

        if (!isDragging) {
            return;
        }


        const deltaX =
            event.clientX -
            pointerDownX;


        const deltaY =
            event.clientY -
            pointerDownY;


        pointerDownX =
            event.clientX;


        pointerDownY =
            event.clientY;


        /* ---------------------------------------------
           Rotate Mars horizontally
        --------------------------------------------- */

        mars.rotation.y +=
            deltaX * 0.01;


        /* ---------------------------------------------
           Rotate Mars vertically
        --------------------------------------------- */

        mars.rotation.x +=
            deltaY * 0.005;


        mars.rotation.x =
            THREE.MathUtils.clamp(
                mars.rotation.x,
                -0.9,
                0.9
            );

    }
);


/* =====================================================
   STOP DRAGGING
===================================================== */

renderer.domElement.addEventListener(
    "pointerup",
    event => {

        isDragging =
            false;


        try {

            renderer.domElement.releasePointerCapture(
                event.pointerId
            );

        } catch (error) {}

    }
);


renderer.domElement.addEventListener(
    "pointercancel",
    () => {

        isDragging =
            false;

    }
);


/* =====================================================
   UPDATE MARKER POSITIONS
===================================================== */

const projectedPosition =
    new THREE.Vector3();


function updateMarkers() {

    Object.entries(
        equipmentData
    ).forEach(
        ([id, equipment]) => {

            const marker =
                markerElements[id];


            if (!marker) {
                return;
            }


            /* -----------------------------------------
               Get Mars location
            ----------------------------------------- */

            projectedPosition.copy(
                marsCoordinates(
                    equipment.lat,
                    equipment.lon
                )
            );


            /* -----------------------------------------
               Apply Mars rotation
            ----------------------------------------- */

            mars.localToWorld(
                projectedPosition
            );


            /* -----------------------------------------
               Check distance
            ----------------------------------------- */

            const distance =
                camera.position.distanceTo(
                    projectedPosition
                );


            /* -----------------------------------------
               Project to screen
            ----------------------------------------- */

            projectedPosition.project(
                camera
            );


            const x =
                (
                    projectedPosition.x *
                    0.5 +
                    0.5
                ) *
                window.innerWidth;


            const y =
                (
                    -projectedPosition.y *
                    0.5 +
                    0.5
                ) *
                window.innerHeight;


            /* -----------------------------------------
               Visual offset
            ----------------------------------------- */

            const offset =
                visualOffsets[id] ||
                {
                    x: 0,
                    y: 0
                };


            marker.style.left =
                `${x + offset.x}px`;


            marker.style.top =
                `${y + offset.y}px`;


            /* -----------------------------------------
               Hide markers on back side
            ----------------------------------------- */

            const visible =
                projectedPosition.z < 1 &&
                distance < 5;


            marker.style.display =
                visible
                    ? "block"
                    : "none";

        }
    );

}


/* =====================================================
   ANIMATION LOOP
===================================================== */

function animate() {

    requestAnimationFrame(
        animate
    );


    /*
       AUTO ROTATION

       Mars rotates automatically only
       while the user has not manually
       interacted with it.
    */

    if (
        autoRotate &&
        !isDragging &&
        !cameraMoving &&
        !selectedEquipment
    ) {

        mars.rotation.y +=
            0.0015;

    }


    updateMarkers();


    renderer.render(
        scene,
        camera
    );

}


animate();


/* =====================================================
   WINDOW RESIZE
===================================================== */

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


/* =====================================================
   IMAGE ERROR CHECK
===================================================== */

equipmentImage.addEventListener(
    "error",
    () => {

        console.error(
            "Mars equipment image could not be loaded:",
            equipmentImage.src
        );

    }
);


/* =====================================================
   GLOBAL FUNCTIONS
===================================================== */

window.showEquipmentInfo =
    selectEquipment;


window.resetMars =
    resetMars;