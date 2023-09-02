// =======================================================
// DEFINIZIONE DEGLI ALIAS
// =======================================================
const MatterJS = {
    Engine: Matter.Engine,
    Render: Matter.Render,
    World: Matter.World,
    Bodies: Matter.Bodies,
    Composite: Matter.Composite,
    Constraint: Matter.Constraint,
    Mouse: Matter.Mouse,
    MouseConstraint: Matter.MouseConstraint,
    Events: Matter.Events
};

// =======================================================
// CONFIGURAZIONE CENTRALIZZATA
// =======================================================
const config = {
    engineOptions: {
        positionIterations: 10,
        velocityIterations: 10
    },
    renderOptions: {
        element: document.body,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false
        }
    },
    wallOptions: {
        isStatic: true,
        density: 1000
    }
};

const engine = MatterJS.Engine.create(config.engineOptions);

const render = MatterJS.Render.create({
    ...config.renderOptions,
    engine: engine
});

// =======================================================
// AVVIO DEL MOTORE E DEL RENDERER
// =======================================================
MatterJS.Engine.run(engine);
MatterJS.Render.run(render);

// Funzione per la creazione dei corpi
function createBodies() {
    const ground = MatterJS.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 30, window.innerWidth, 60, { isStatic: true });
    const bodies = [ground]; // Inizia con il ground come primo corpo nell'array

    function generateRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    // Genera corpi randomicilet NUMBER_BODIES_TO_GENERATE;
    if (window.innerWidth > 768) {
        // Consideriamo desktop
        NUMBER_BODIES_TO_GENERATE = 50;
    } else {
        // Dispositivi mobili
        NUMBER_BODIES_TO_GENERATE = 20;
    }

    for (let i = 0; i < NUMBER_BODIES_TO_GENERATE; i++) { // Puoi cambiare 20 con qualsiasi altro numero di corpi che desideri generare
        let randomX = Math.random() * window.innerWidth;
        let randomY = Math.random() * window.innerHeight;

        switch(Math.floor(Math.random() * 4)) {
            case 0:
                bodies.push(MatterJS.Bodies.circle(randomX, randomY, Math.random() * 60, { 
                    render: { fillStyle: generateRandomColor() }
                }));
                break;
            case 1:
                bodies.push(MatterJS.Bodies.rectangle(randomX, randomY, Math.random() * 100, Math.random() * 100, { 
                    render: { fillStyle: generateRandomColor() }
                }));
                break;
            case 2:
                bodies.push(MatterJS.Bodies.polygon(randomX, randomY, Math.floor(Math.random() * 8) + 3, Math.random() * 50, { 
                    render: { fillStyle: generateRandomColor() }
                }));
                break;
            case 3:
                bodies.push(MatterJS.Bodies.trapezoid(randomX, randomY, Math.random() * 100, Math.random() * 100, Math.random(), { 
                    render: { fillStyle: generateRandomColor() }
                }));
                break;
            default:
                bodies.push(MatterJS.Bodies.circle(randomX, randomY, Math.random() * 60, { 
                    render: { fillStyle: generateRandomColor() }
                }));
                break;
        }
    }

    return bodies;
}
MatterJS.World.add(engine.world, createBodies());


// Funzione per generare un colore random
function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

MatterJS.World.add(engine.world, createBodies());


// Funzione per limitare la velocità dei corpi
function limitBodySpeed(event) {
    MatterJS.Composite.allBodies(event.source.world).forEach(function(body) {
        Matter.Body.setVelocity(body, { 
            x: Math.min(Math.max(body.velocity.x, -10), 40),
            y: Math.min(Math.max(body.velocity.y, -10), 40)
        });
    });
}
MatterJS.Events.on(engine, 'afterUpdate', limitBodySpeed);

// Funzione per la creazione dei muri
function createWalls() {
    const wallOptions = {
        isStatic: true,
        density: 1000  // un valore molto alto per la densità
    };

    const topWall = MatterJS.Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, wallOptions);
    const bottomWall = MatterJS.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, wallOptions);
    const leftWall = MatterJS.Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, wallOptions);
    const rightWall = MatterJS.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, window.innerHeight, wallOptions);

    const walls = [
        topWall,
        bottomWall,
        leftWall,
        rightWall
    ];
    
    return walls;
}
MatterJS.World.add(engine.world, createWalls());


// Funzione per la configurazione dell'interazione del mouse
function setupMouseInteraction() {
    const mouse = MatterJS.Mouse.create(render.canvas);
    const mouseConstraint = MatterJS.MouseConstraint.create(engine, {
        mouse: mouse
    });
    MatterJS.World.add(engine.world, mouseConstraint);
    render.mouse = mouse;
}
setupMouseInteraction();

// Funzione per l'aggiunta del testo al renderer

/*
function addTextToRenderer(event) {
    const context = event.source.context;
    const text = "Made with ❤️ by Alpaca Studio S.R.L. SB";
    const x = window.innerWidth / 2;

    let fontSize;
    if (window.innerWidth > 768) {  
        fontSize = Math.min(4 + window.innerWidth * 0.01, 16);  
    } else {  
        fontSize = Math.min(12 + window.innerWidth * 0.01, 24);  
    }
    const y = window.innerHeight - 30 + fontSize;  
    
    context.font = fontSize + "px Montserrat";
    context.textAlign = "center";
    context.fillStyle = "#FFFFFF";  
    context.fillText(text, x, y);
}
MatterJS.Events.on(render, 'afterRender', addTextToRenderer);

*/


// =======================================================
// PER GESTIONE GRAVITA
// =======================================================



// Funzione per aggiunta gravita
function setSpaceGravity(engine) {
    // Imposta la gravità a zero
    engine.world.gravity.x = 0;
    engine.world.gravity.y = 0;
}

// Per utilizzare la funzione e attivare la modalità "gravità spaziale":
//setSpaceGravity(engine);

const gravityToggle = document.getElementById('gravity-toggle');
const gravityButton = document.getElementById('gravity-button');
let isGravityEnabled = true;

gravityButton.addEventListener('click', function() {
    console.log("Clicca qui");
    isGravityEnabled = !isGravityEnabled;

    if (isGravityEnabled) {
        engine.world.gravity.x = 0; // Ripristina la gravità normale
        engine.world.gravity.y = 1;
        gravityButton.innerText = 'Alpaca Gravity 🦙';
    } else {
        setSpaceGravity(engine); // Disattiva la gravità
        const NUMBER_ALPACA = 22;
        //const numEmojis = Math.floor(Math.random() * NUMBER_ALPACA) + 1; // Numero casuale da 1 a 42
        gravityButton.innerText = '🦙'.repeat(NUMBER_ALPACA); // Ripeti l'emoji il numero di volte

    }
});

// Funzione per aggiunta gravita
function setSpaceGravity(engine) {
    // Imposta la gravità a zero
    engine.world.gravity.x = 0;
    engine.world.gravity.y = 0;
}




// =======================================================
// PER RESPONSIVE
// =======================================================

// Funzione per la gestione del ridimensionamento della finestra
function handleWindowResize() {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;

    MatterJS.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight - 30 });
    MatterJS.Body.setPosition(topWall, { x: window.innerWidth / 2, y: 25 });
    MatterJS.Body.setPosition(bottomWall, { x: window.innerWidth / 2, y: window.innerHeight - 25 });
    MatterJS.Body.setPosition(leftWall, { x: 25, y: window.innerHeight / 2 });  // Aggiornato la posizione x a 25
    MatterJS.Body.setPosition(rightWall, { x: window.innerWidth - 25, y: window.innerHeight / 2 });  // Aggiornato la posizione x

    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight }
    });
}

window.addEventListener('resize', handleWindowResize);
