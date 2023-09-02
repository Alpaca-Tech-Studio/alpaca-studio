// =======================================================
// ALPACA COMPOSTO SEMPLIFICATO
// =======================================================

// Corpo principale (tronco)
let alpacaBody = Bodies.rectangle(600, 600, 80, 50, { 
    chamfer: {radius: 15},
    render: { fillStyle: '#DAA520' }
});

// Testa (usiamo un cerchio)
let alpacaHead = Bodies.circle(600, 565, 30, { 
    render: { fillStyle: '#DAA520' }
});

// Zampe (cerchi)
let legRadius = 15;

let frontRightLeg = Bodies.circle(630, 635, legRadius, { 
    render: { fillStyle: '#DAA520' }
});

let frontLeftLeg = Bodies.circle(570, 635, legRadius, { 
    render: { fillStyle: '#DAA520' }
});

let backRightLeg = Bodies.circle(615, 665, legRadius, { 
    render: { fillStyle: '#DAA520' }
});

let backLeftLeg = Bodies.circle(585, 665, legRadius, { 
    render: { fillStyle: '#DAA520' }
});

// Vincoli

let headConstraint = Constraint.create({
    bodyA: alpacaBody,
    pointA: {x: 0, y: -25},
    bodyB: alpacaHead,
    pointB: {x: 0, y: 0},
    stiffness: 0.6
});

let frontRightLegConstraint = Constraint.create({
    bodyA: alpacaBody,
    pointA: {x: 20, y: 25},
    bodyB: frontRightLeg,
    pointB: {x: 0, y: 0},
    stiffness: 0.6
});

let frontLeftLegConstraint = Constraint.create({
    bodyA: alpacaBody,
    pointA: {x: -20, y: 25},
    bodyB: frontLeftLeg,
    pointB: {x: 0, y: 0},
    stiffness: 0.6
});

let backRightLegConstraint = Constraint.create({
    bodyA: alpacaBody,
    pointA: {x: 10, y: 25},
    bodyB: backRightLeg,
    pointB: {x: 0, y: 0},
    stiffness: 0.6
});

let backLeftLegConstraint = Constraint.create({
    bodyA: alpacaBody,
    pointA: {x: -10, y: 25},
    bodyB: backLeftLeg,
    pointB: {x: 0, y: 0},
    stiffness: 0.6
});

// Aggiungere l'alpaca e i vincoli al mondo
World.add(engine.world, [
    alpacaBody, alpacaHead, frontRightLeg, frontLeftLeg, backRightLeg, backLeftLeg, 
    headConstraint, frontRightLegConstraint, frontLeftLegConstraint, backRightLegConstraint, backLeftLegConstraint
]);