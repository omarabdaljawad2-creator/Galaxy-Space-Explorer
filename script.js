/* =========================================
   SPACE EXPLORER
   SHARED JAVASCRIPT
========================================= */


import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";



/* =========================================
   HOME → EXPLORE
========================================= */

const startBtn =
    document.getElementById("startBtn");


if (startBtn) {

    startBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "explore.html";

        }
    );

}



/* =========================================
   CONTACT FORM
========================================= */

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            alert(
                "Your message has been sent!"
            );

            contactForm.reset();

        }
    );

}



/* =========================================
   CREATE 3D PLANET
========================================= */

function createPlanet(
    containerId,
    texturePath,
    rotationSpeed,
    planetType
) {


    const container =
        document.getElementById(
            containerId
        );


    /* If this page doesn't contain
       this planet, do nothing. */

    if (!container) {
        return;
    }



    /* =====================================
       SCENE
    ===================================== */

    const scene =
        new THREE.Scene();



    /* =====================================
       CAMERA
    ===================================== */

    const camera =
        new THREE.PerspectiveCamera(

            45,

            container.clientWidth /
            container.clientHeight,

            0.1,

            100

        );


    camera.position.z = 3;



    /* =====================================
       RENDERER
    ===================================== */

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

        container.clientWidth,

        container.clientHeight

    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;


    renderer.toneMappingExposure =
        1;


    container.appendChild(
        renderer.domElement
    );



    /* =====================================
       LIGHTING
    ===================================== */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            planetType === "mars"
                ? 0.35
                : 0.25
        );


    scene.add(
        ambientLight
    );



    /* Main sunlight */

    const sunLight =
        new THREE.DirectionalLight(
            0xffffff,
            planetType === "mars"
                ? 2.8
                : 3.2
        );


    sunLight.position.set(
        5,
        3,
        5
    );


    scene.add(
        sunLight
    );



    /* =====================================
       TEXTURE
    ===================================== */

    const textureLoader =
        new THREE.TextureLoader();


    textureLoader.load(

        texturePath,


        function (texture) {


            console.log(
                planetType +
                " texture loaded successfully"
            );


            texture.colorSpace =
                THREE.SRGBColorSpace;


            texture.anisotropy =
                renderer
                    .capabilities
                    .getMaxAnisotropy();



            /* =================================
               SPHERE
            ================================= */

            const geometry =
                new THREE.SphereGeometry(

                    1,

                    128,

                    128

                );



            /* =================================
               MATERIAL
            ================================= */

            const material =
                new THREE.MeshStandardMaterial({

                    map: texture,

                    roughness:
                        planetType === "mars"
                            ? 0.9
                            : 1,

                    metalness: 0,

                    bumpMap: texture,

                    bumpScale:
                        planetType === "mars"
                            ? 0.025
                            : 0.015

                });



            /* =================================
               PLANET
            ================================= */

            const planet =
                new THREE.Mesh(

                    geometry,

                    material

                );


            scene.add(
                planet
            );



            /* =================================
               MARS ATMOSPHERE
            ================================= */

            let atmosphere = null;


            if (
                planetType === "mars"
            ) {


                const atmosphereGeometry =
                    new THREE.SphereGeometry(

                        1.035,

                        96,

                        96

                    );


                const atmosphereMaterial =
                    new THREE.MeshBasicMaterial({

                        color: 0xc96f4a,

                        transparent: true,

                        opacity: 0.08,

                        side:
                            THREE.BackSide,

                        blending:
                            THREE.AdditiveBlending

                    });


                atmosphere =
                    new THREE.Mesh(

                        atmosphereGeometry,

                        atmosphereMaterial

                    );


                scene.add(
                    atmosphere
                );

            }



            /* =================================
               ANIMATION
            ================================= */

            function animate() {


                requestAnimationFrame(
                    animate
                );


                /* Planet rotation */

                planet.rotation.y +=
                    rotationSpeed;


                /* Mars atmosphere */

                if (atmosphere) {

                    atmosphere.rotation.y +=
                        rotationSpeed * 0.8;

                }


                renderer.render(
                    scene,
                    camera
                );

            }


            animate();

        },


        undefined,


        function (error) {

            console.error(

                "Could not load texture:",

                texturePath,

                error

            );

        }

    );



    /* =====================================
       RESIZE
    ===================================== */

    function resizePlanet() {


        const width =
            container.clientWidth;


        const height =
            container.clientHeight;


        if (
            width === 0 ||
            height === 0
        ) {

            return;

        }


        camera.aspect =
            width / height;


        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height
        );

    }


    window.addEventListener(
        "resize",
        resizePlanet
    );


    resizePlanet();

}



/* =========================================
   HOME MOON
========================================= */

createPlanet(

    "moon3d",

    "./models/moon_small.jpg",

    0.0015,

    "moon"

);



/* =========================================
   EXPLORE MOON
========================================= */

createPlanet(

    "exploreMoon3d",

    "./models/moon_small.jpg",

    0.0015,

    "moon"

);



/* =========================================
   EXPLORE MARS
========================================= */

createPlanet(

    "mars3d",

    "./textures/mars-texture.jpg",

    0.0012,

    "mars"

);