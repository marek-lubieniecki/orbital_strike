// Celestial body types with realistic astronomical data
export const CELESTIAL_TYPES = {
    asteroid: {
        name: "Asteroid",
        mass: 9.39e20, // kg (Ceres mass)
        diameter: 940000, // meters (Ceres diameter)
        gameplayRadius: 12, // Scaled for gameplay
        gameplayMass: 15, // Scaled for gameplay
        color: '#8B7355',
        description: "Rocky remnants from the early solar system",
        realWorldExamples: [
            { name: "Ceres", diameter: "940 km", mass: "9.39×10²⁰ kg" },
            { name: "Vesta", diameter: "525 km", mass: "2.59×10²⁰ kg" },
            { name: "Pallas", diameter: "512 km", mass: "2.04×10²⁰ kg" }
        ],
        facts: [
            "Most asteroids orbit between Mars and Jupiter",
            "Made of rock, metal, and sometimes ice",
            "The largest asteroid is Ceres, now classified as a dwarf planet",
            "Over 1 million asteroids larger than 1 km exist",
            "Some asteroids have their own moons"
        ]
    },
    dwarf_planet: {
        name: "Dwarf Planet",
        mass: 1.31e22, // kg (Pluto mass)
        diameter: 2374000, // meters (Pluto diameter)
        gameplayRadius: 20,
        gameplayMass: 35,
        color: '#A0522D',
        description: "Small planetary bodies that haven't cleared their orbital path",
        realWorldExamples: [
            { name: "Pluto", diameter: "2,374 km", mass: "1.31×10²² kg" },
            { name: "Eris", diameter: "2,326 km", mass: "1.66×10²² kg" },
            { name: "Makemake", diameter: "1,430 km", mass: "3×10²¹ kg" }
        ],
        facts: [
            "Pluto was reclassified as a dwarf planet in 2006",
            "Must orbit the Sun and have enough mass to be roughly round",
            "Haven't cleared other objects from their orbital neighborhood",
            "Most are located in the Kuiper Belt beyond Neptune",
            "Ceres is the only dwarf planet in the asteroid belt"
        ]
    },
    planet: {
        name: "Planet",
        mass: 5.97e24, // kg (Earth mass)
        diameter: 12742000, // meters (Earth diameter)
        gameplayRadius: 30,
        gameplayMass: 65,
        color: '#4169E1',
        description: "Large celestial bodies that orbit a star and have cleared their orbit",
        realWorldExamples: [
            { name: "Earth", diameter: "12,742 km", mass: "5.97×10²⁴ kg" },
            { name: "Mars", diameter: "6,779 km", mass: "6.39×10²³ kg" },
            { name: "Venus", diameter: "12,104 km", mass: "4.87×10²⁴ kg" }
        ],
        facts: [
            "There are 8 planets in our solar system",
            "Must orbit the Sun, have sufficient mass to be round, and clear their orbit",
            "Rocky planets are closer to the Sun than gas giants",
            "Earth is the only known planet with life",
            "Venus rotates backwards compared to most planets"
        ]
    },
    gas_giant: {
        name: "Gas Giant",
        mass: 1.898e27, // kg (Jupiter mass)
        diameter: 139820000, // meters (Jupiter diameter)
        gameplayRadius: 45,
        gameplayMass: 100,
        color: '#FF8C00',
        description: "Massive planets composed primarily of hydrogen and helium",
        realWorldExamples: [
            { name: "Jupiter", diameter: "139,820 km", mass: "1.90×10²⁷ kg" },
            { name: "Saturn", diameter: "116,460 km", mass: "5.68×10²⁶ kg" },
            { name: "Neptune", diameter: "49,244 km", mass: "1.02×10²⁶ kg" }
        ],
        facts: [
            "Jupiter is the largest planet in our solar system",
            "Saturn's rings are made of ice and rock particles",
            "Gas giants have no solid surface to land on",
            "Jupiter has over 80 moons including the four largest: Io, Europa, Ganymede, Callisto",
            "Uranus rotates on its side due to an ancient collision"
        ]
    },
    star: {
        name: "Star",
        mass: 1.989e30, // kg (Sun mass)
        diameter: 1391000000, // meters (Sun diameter)
        gameplayRadius: 60,
        gameplayMass: 150,
        color: '#FFD700',
        description: "Massive balls of plasma that generate energy through nuclear fusion",
        realWorldExamples: [
            { name: "Sun", diameter: "1,391,000 km", mass: "1.99×10³⁰ kg" },
            { name: "Proxima Centauri", diameter: "200,000 km", mass: "2.45×10²⁹ kg" },
            { name: "Betelgeuse", diameter: "1.2 billion km", mass: "2.2×10³¹ kg" }
        ],
        facts: [
            "The Sun contains 99.86% of the solar system's mass",
            "Stars fuse hydrogen into helium in their cores",
            "The nearest star to Earth (after the Sun) is 4.24 light-years away",
            "Stars are classified by color: blue (hottest) to red (coolest)",
            "When massive stars die, they can become black holes or neutron stars"
        ]
    }
};