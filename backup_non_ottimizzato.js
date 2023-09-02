// =======================================================
// DEFINIZIONE DEGLI ALIAS
// =======================================================
let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events;




// =======================================================
// CONFIGURAZIONE DEL MOTORE E DEL RENDERER
// =======================================================
let engine = Engine.create();

/* 
Aumentando il numero di iterazioni delle collisioni e delle correzioni di posizione, 
puoi rendere la simulazione più stabile. 
Questo può essere particolarmente utile se stai utilizzando corpi ad alta velocità.
*/
engine.positionIterations = 10; 
engine.velocityIterations = 10;

let render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

// =======================================================
// AVVIO DEL MOTORE E DEL RENDERER
// =======================================================
Engine.run(engine);
Render.run(render);

// =======================================================
// CREAZIONE E AGGIUNTA DEI CORPI
// =======================================================
let ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 30, window.innerWidth, 60, { isStatic: true });

let ball = Bodies.circle(400, 100, 40);
let box = Bodies.rectangle(450, 200, 80, 80);

// Creazione di altri 8 corpi con forme diverse
let rect1 = Bodies.rectangle(100, 100, 50, 100);
let rect2 = Bodies.rectangle(200, 150, 100, 50);
let circle1 = Bodies.circle(150, 250, 30);
let circle2 = Bodies.circle(250, 350, 60);
let polygon1 = Bodies.polygon(300, 100, 6, 40); // Esagono
let polygon2 = Bodies.polygon(350, 200, 5, 50); // Pentagono
let trapezoid1 = Bodies.trapezoid(400, 300, 100, 60, 0.5); 

World.add(engine.world, [ground, ball, box, rect1, rect2, circle1, circle2, polygon1, polygon2, trapezoid1]);







// =======================================================
// LIMITAZIONE DELLA VELOCITÀ DEI CORPI
// =======================================================
Events.on(engine, 'afterUpdate', function() {
    Matter.Composite.allBodies(engine.world).forEach(function(body) {
        Matter.Body.setVelocity(body, { 
            x: Math.min(Math.max(body.velocity.x, -10), 40),
            y: Math.min(Math.max(body.velocity.y, -10), 40)
        });
    });
});

// =======================================================
// CREAZIONE E AGGIUNTA DEI MURI
// =======================================================
const wallOptions = {
    isStatic: true,
    density: 1000  // un valore molto alto per la densità
};

let topWall = Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, wallOptions);
let bottomWall = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, wallOptions);
let leftWall = Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight,wallOptions);
let rightWall = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, window.innerHeight,wallOptions);



World.add(engine.world, [topWall, bottomWall, leftWall, rightWall]);

// =======================================================
// CONFIGURAZIONE DELL'INTERAZIONE DEL MOUSE
// =======================================================
let mouse = Mouse.create(render.canvas);
let mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse
});
World.add(engine.world, mouseConstraint);
render.mouse = mouse;


// =======================================================
// AGGIUNTA DEL TESTO AL RENDERER
// =======================================================
Events.on(render, 'afterRender', function() {
    const context = render.context;
    
    const text = "Made with ❤️ by Alpaca Studio S.R.L. SB";
    const x = window.innerWidth / 2;  // Centra il testo orizzontalmente

    // Calcola la dimensione del font in base alla larghezza dello schermo
    let fontSize;
    if (window.innerWidth > 768) {  // Consideriamo desktop
        fontSize = Math.min(4 + window.innerWidth * 0.01, 16);  // Ridotto di 4px, quindi ora max 16px, min 4px
    } else {  // Dispositivi mobili
        fontSize = Math.min(12 + window.innerWidth * 0.01, 24);  // Max 24px, min 12px
    }
    
    // Posiziona il testo leggermente più in basso rispetto al ground, tenendo conto della dimensione del font
    const y = window.innerHeight - 30 + fontSize;  
    
    context.font = fontSize + "px Montserrat";
    context.textAlign = "center";
    context.fillStyle = "#FFFFFF";  // Colore del testo bianco, ma puoi cambiarlo
    context.fillText(text, x, y);
});




// =======================================================
// GESTIONE DEL RIDIMENSIONAMENTO DELLA FINESTRA
// =======================================================
window.addEventListener('resize', function() {
    // Aggiorna le dimensioni del canvas
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;

    // Aggiorna la posizione e le dimensioni del terreno e dei muri
    Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight - 30 });
    Matter.Body.setPosition(topWall, { x: window.innerWidth / 2, y: 25 }); // metà dello spessore del muro
    Matter.Body.setPosition(bottomWall, { x: window.innerWidth / 2, y: window.innerHeight - 25 }); // altezza della finestra meno metà dello spessore del muro
    Matter.Body.setPosition(leftWall, { x: 0, y: window.innerHeight / 2 });
    Matter.Body.setPosition(rightWall, { x: window.innerWidth, y: window.innerHeight / 2 });

    // Ri-visualizza il renderer per adattarsi alle nuove dimensioni
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight }
    });
});