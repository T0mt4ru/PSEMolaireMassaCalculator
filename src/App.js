import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import rawTrivialNamesData from './data/trivialNames.json'; 

 const trivialNames = {};
 for (const formula in rawTrivialNamesData) {
   if (Object.prototype.hasOwnProperty.call(rawTrivialNamesData, formula)) {
     const namesArray = rawTrivialNamesData[formula];
     if (Array.isArray(namesArray)) {
       namesArray.forEach(name => {
         trivialNames[name.toLowerCase()] = formula;
       });
     }
   }
 }
 // Draai de trivialNames map om voor snelle lookup van namen per formule.
// En voor de suggesties hebben we de namen zelf nodig.
const trivialFormulasToNames = {}; // Niet direct gebruikt, maar handig voor omgekeerde lookup
for (const formula in rawTrivialNamesData) {
    if (Object.prototype.hasOwnProperty.call(rawTrivialNamesData, formula)) {
        trivialFormulasToNames[formula] = rawTrivialNamesData[formula];
    }
}
const allTrivialNames = Object.values(rawTrivialNamesData).flat().map(name => name.toLowerCase());

// Data voor het periodiek systeem
// Bron voor atoommassa's: IUPAC, afgerond voor eenvoud
const elementsData = [  
  { symbol: 'H',  name: 'Waterstof',      atomicNumber: 1,    atomicMass: 1.008,    group: 1,   period: 1, type: 'niet-metaal' },
  { symbol: 'He', name: 'Helium',         atomicNumber: 2,    atomicMass: 4.003,    group: 18,  period: 1, type: 'edelgas' },
  { symbol: 'Li', name: 'Lithium',        atomicNumber: 3,    atomicMass: 6.941,    group: 1,   period: 2, type: 'alkalimetaal' },
  { symbol: 'Be', name: 'Beryllium',      atomicNumber: 4,    atomicMass: 9.012,    group: 2,   period: 2, type: 'aardalkalimetaal' },
  { symbol: 'B',  name: 'Boor',           atomicNumber: 5,    atomicMass: 10.811,   group: 13,  period: 2, type: 'metaloïde' },
  { symbol: 'C',  name: 'Koolstof',       atomicNumber: 6,    atomicMass: 12.011,   group: 14,  period: 2, type: 'niet-metaal' },
  { symbol: 'N',  name: 'Stikstof',       atomicNumber: 7,    atomicMass: 14.007,   group: 15,  period: 2, type: 'niet-metaal' },
  { symbol: 'O',  name: 'Zuurstof',       atomicNumber: 8,    atomicMass: 15.999,   group: 16,  period: 2, type: 'niet-metaal' },
  { symbol: 'F',  name: 'Fluor',          atomicNumber: 9,    atomicMass: 18.998,   group: 17,  period: 2, type: 'halogeen' },
  { symbol: 'Ne', name: 'Neon',           atomicNumber: 10,   atomicMass: 20.180,   group: 18,  period: 2, type: 'edelgas' },
  { symbol: 'Na', name: 'Natrium',        atomicNumber: 11,   atomicMass: 22.990,   group: 1,   period: 3, type: 'alkalimetaal' },
  { symbol: 'Mg', name: 'Magnesium',      atomicNumber: 12,   atomicMass: 24.305,   group: 2,   period: 3, type: 'aardalkalimetaal' },
  { symbol: 'Al', name: 'Aluminium',      atomicNumber: 13,   atomicMass: 26.982,   group: 13,  period: 3, type: 'hoofdgroepmetaal' },
  { symbol: 'Si', name: 'Silicium',       atomicNumber: 14,   atomicMass: 28.085,   group: 14,  period: 3, type: 'metaloïde' },
  { symbol: 'P',  name: 'Fosfor',         atomicNumber: 15,   atomicMass: 30.974,   group: 15,  period: 3, type: 'niet-metaal' },
  { symbol: 'S',  name: 'Zwavel',         atomicNumber: 16,   atomicMass: 32.060,   group: 16,  period: 3, type: 'niet-metaal' },
  { symbol: 'Cl', name: 'Chloor',         atomicNumber: 17,   atomicMass: 35.453,   group: 17,  period: 3, type: 'halogeen' },
  { symbol: 'Ar', name: 'Argon',          atomicNumber: 18,   atomicMass: 39.948,   group: 18,  period: 3, type: 'edelgas' },
  { symbol: 'K',  name: 'Kalium',         atomicNumber: 19,   atomicMass: 39.098,   group: 1,   period: 4, type: 'alkalimetaal' },
  { symbol: 'Ca', name: 'Calcium',        atomicNumber: 20,   atomicMass: 40.078,   group: 2,   period: 4, type: 'aardalkalimetaal' },
  { symbol: 'Sc', name: 'Scandium',       atomicNumber: 21,   atomicMass: 44.956,   group: 3,   period: 4, type: 'overgangsmetaal' },
  { symbol: 'Ti', name: 'Titanium',       atomicNumber: 22,   atomicMass: 47.867,   group: 4,   period: 4, type: 'overgangsmetaal' },
  { symbol: 'V',  name: 'Vanadium',       atomicNumber: 23,   atomicMass: 50.942,   group: 5,   period: 4, type: 'overgangsmetaal' },
  { symbol: 'Cr', name: 'Chroom',         atomicNumber: 24,   atomicMass: 51.996,   group: 6,   period: 4, type: 'overgangsmetaal' },
  { symbol: 'Mn', name: 'Mangaan',        atomicNumber: 25,   atomicMass: 54.938,   group: 7,   period: 4, type: 'overgangsmetaal' },
  { symbol: 'Fe', name: 'IJzer',          atomicNumber: 26,   atomicMass: 55.845,   group: 8,   period: 4, type: 'overgangsmetaal' },
  { symbol: 'Co', name: 'Kobalt',         atomicNumber: 27,   atomicMass: 58.933,   group: 9,   period: 4, type: 'overgangsmetaal' },
  { symbol: 'Ni', name: 'Nikkel',         atomicNumber: 28,   atomicMass: 58.693,   group: 10,  period: 4, type: 'overgangsmetaal' },
  { symbol: 'Cu', name: 'Koper',          atomicNumber: 29,   atomicMass: 63.546,   group: 11,  period: 4, type: 'overgangsmetaal' },
  { symbol: 'Zn', name: 'Zink',           atomicNumber: 30,   atomicMass: 65.380,   group: 12,  period: 4, type: 'overgangsmetaal' },
  { symbol: 'Ga', name: 'Gallium',        atomicNumber: 31,   atomicMass: 69.723,   group: 13,  period: 4, type: 'hoofdgroepmetaal' },
  { symbol: 'Ge', name: 'Germanium',      atomicNumber: 32,   atomicMass: 72.630,   group: 14,  period: 4, type: 'metaloïde' },
  { symbol: 'As', name: 'Arseen',         atomicNumber: 33,   atomicMass: 74.922,   group: 15,  period: 4, type: 'metaloïde' },
  { symbol: 'Se', name: 'Seleen',         atomicNumber: 34,   atomicMass: 78.971,   group: 16,  period: 4, type: 'niet-metaal' },
  { symbol: 'Br', name: 'Broom',          atomicNumber: 35,   atomicMass: 79.904,   group: 17,  period: 4, type: 'halogeen' },
  { symbol: 'Kr', name: 'Krypton',        atomicNumber: 36,   atomicMass: 83.798,   group: 18,  period: 4, type: 'edelgas' },
  { symbol: 'Rb', name: 'Rubidium',       atomicNumber: 37,   atomicMass: 85.468,   group: 1,   period: 5, type: 'alkalimetaal' },
  { symbol: 'Sr', name: 'Strontium',      atomicNumber: 38,   atomicMass: 87.620,   group: 2,   period: 5, type: 'aardalkalimetaal' },
  { symbol: 'Y',  name: 'Yttrium',        atomicNumber: 39,   atomicMass: 88.906,   group: 3,   period: 5, type: 'overgangsmetaal' },
  { symbol: 'Zr', name: 'Zirkonium',      atomicNumber: 40,   atomicMass: 91.224,   group: 4,   period: 5, type: 'overgangsmetaal' },
  { symbol: 'Nb', name: 'Niobium',        atomicNumber: 41,   atomicMass: 92.906,   group: 5,   period: 5, type: 'overgangsmetaal' },
  { symbol: 'Mo', name: 'Molybdeen',      atomicNumber: 42,   atomicMass: 95.950,   group: 6,   period: 5, type: 'overgangsmetaal' },
  { symbol: 'Tc', name: 'Technetium',     atomicNumber: 43,   atomicMass: 98.000,   group: 7,   period: 5, type: 'overgangsmetaal' },
  { symbol: 'Ru', name: 'Ruthenium',      atomicNumber: 44,   atomicMass: 101.070,  group: 8,   period: 5, type: 'overgangsmetaal' },
  { symbol: 'Rh', name: 'Rhodium',        atomicNumber: 45,   atomicMass: 102.906,  group: 9,   period: 5, type: 'overgangsmetaal' },
  { symbol: 'Pd', name: 'Palladium',      atomicNumber: 46,   atomicMass: 106.420,  group: 10,  period: 5, type: 'overgangsmetaal' },
  { symbol: 'Ag', name: 'Zilver',         atomicNumber: 47,   atomicMass: 107.868,  group: 11,  period: 5, type: 'overgangsmetaal' },
  { symbol: 'Cd', name: 'Cadmium',        atomicNumber: 48,   atomicMass: 112.414,  group: 12,  period: 5, type: 'overgangsmetaal' },
  { symbol: 'In', name: 'Indium',         atomicNumber: 49,   atomicMass: 114.818,  group: 13,  period: 5, type: 'hoofdgroepmetaal' },
  { symbol: 'Sn', name: 'Tin',            atomicNumber: 50,   atomicMass: 118.710,  group: 14,  period: 5, type: 'hoofdgroepmetaal' },
  { symbol: 'Sb', name: 'Antimoon',       atomicNumber: 51,   atomicMass: 121.760,  group: 15,  period: 5, type: 'metaloïde' },
  { symbol: 'Te', name: 'Telluur',        atomicNumber: 52,   atomicMass: 127.600,  group: 16,  period: 5, type: 'metaloïde' },
  { symbol: 'I',  name: 'Jood',           atomicNumber: 53,   atomicMass: 126.904,  group: 17,  period: 5, type: 'halogeen' },
  { symbol: 'Xe', name: 'Xenon',          atomicNumber: 54,   atomicMass: 131.293,  group: 18,  period: 5, type: 'edelgas' },
  { symbol: 'Cs', name: 'Cesium',         atomicNumber: 55,   atomicMass: 132.905,  group: 1,   period: 6, type: 'alkalimetaal' },
  { symbol: 'Ba', name: 'Barium',         atomicNumber: 56,   atomicMass: 137.327,  group: 2,   period: 6, type: 'aardalkalimetaal' },
  { symbol: 'La', name: 'Lanthaan',       atomicNumber: 57,   atomicMass: 138.905,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Ce', name: 'Cerium',         atomicNumber: 58,   atomicMass: 140.116,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Pr', name: 'Praseodymium',   atomicNumber: 59,   atomicMass: 140.908,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Nd', name: 'Neodymium',      atomicNumber: 60,   atomicMass: 144.242,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Pm', name: 'Promethium',     atomicNumber: 61,   atomicMass: 145.000,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Sm', name: 'Samarium',       atomicNumber: 62,   atomicMass: 150.360,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Eu', name: 'Europium',       atomicNumber: 63,   atomicMass: 151.964,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Gd', name: 'Gadolinium',     atomicNumber: 64,   atomicMass: 157.250,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Tb', name: 'Terbium',        atomicNumber: 65,   atomicMass: 158.925,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Dy', name: 'Dysprosium',     atomicNumber: 66,   atomicMass: 162.500,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Ho', name: 'Holmium',        atomicNumber: 67,   atomicMass: 164.930,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Er', name: 'Erbium',         atomicNumber: 68,   atomicMass: 167.259,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Tm', name: 'Thulium',        atomicNumber: 69,   atomicMass: 168.934,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Yb', name: 'Ytterbium',      atomicNumber: 70,   atomicMass: 173.054,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Lu', name: 'Lutetium',       atomicNumber: 71,   atomicMass: 174.967,  group: 3,   period: 6, type: 'lanthanide' },
  { symbol: 'Hf', name: 'Hafnium',        atomicNumber: 72,   atomicMass: 178.490,  group: 4,   period: 6, type: 'overgangsmetaal' },
  { symbol: 'Ta', name: 'Tantaal',        atomicNumber: 73,   atomicMass: 180.948,  group: 5,   period: 6, type: 'overgangsmetaal' },
  { symbol: 'W',  name: 'Wolfraam',       atomicNumber: 74,   atomicMass: 183.840,  group: 6,   period: 6, type: 'overgangsmetaal' },
  { symbol: 'Re', name: 'Renium',         atomicNumber: 75,   atomicMass: 186.207,  group: 7,   period: 6, type: 'overgangsmetaal' },
  { symbol: 'Os', name: 'Osmium',         atomicNumber: 76,   atomicMass: 190.230,  group: 8,   period: 6, type: 'overgangsmetaal' },
  { symbol: 'Ir', name: 'Iridium',        atomicNumber: 77,   atomicMass: 192.217,  group: 9,   period: 6, type: 'overgangsmetaal' },
  { symbol: 'Pt', name: 'Platina',        atomicNumber: 78,   atomicMass: 195.084,  group: 10,  period: 6, type: 'overgangsmetaal' },
  { symbol: 'Au', name: 'Goud',           atomicNumber: 79,   atomicMass: 196.967,  group: 11,  period: 6, type: 'overgangsmetaal' },
  { symbol: 'Hg', name: 'Kwik',           atomicNumber: 80,   atomicMass: 200.592,  group: 12,  period: 6, type: 'overgangsmetaal' },
  { symbol: 'Tl', name: 'Thallium',       atomicNumber: 81,   atomicMass: 204.383,  group: 13,  period: 6, type: 'hoofdgroepmetaal' },
  { symbol: 'Pb', name: 'Lood',           atomicNumber: 82,   atomicMass: 207.200,  group: 14,  period: 6, type: 'hoofdgroepmetaal' },
  { symbol: 'Bi', name: 'Bismut',         atomicNumber: 83,   atomicMass: 208.980,  group: 15,  period: 6, type: 'hoofdgroepmetaal' },
  { symbol: 'Po', name: 'Polonium',       atomicNumber: 84,   atomicMass: 209.000,  group: 16,  period: 6, type: 'metaloïde' },
  { symbol: 'At', name: 'Astatium',       atomicNumber: 85,   atomicMass: 210.000,  group: 17,  period: 6, type: 'halogeen' },
  { symbol: 'Rn', name: 'Radon',          atomicNumber: 86,   atomicMass: 222.000,  group: 18,  period: 6, type: 'edelgas' },
  { symbol: 'Fr', name: 'Francium',       atomicNumber: 87,   atomicMass: 223.000,  group: 1,   period: 7, type: 'alkalimetaal' },
  { symbol: 'Ra', name: 'Radium',         atomicNumber: 88,   atomicMass: 226.000,  group: 2,   period: 7, type: 'aardalkalimetaal' },
  { symbol: 'Ac', name: 'Actinium',       atomicNumber: 89,   atomicMass: 227.000,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'Th', name: 'Thorium',        atomicNumber: 90,   atomicMass: 232.038,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'Pa', name: 'Protactinium',   atomicNumber: 91,   atomicMass: 231.036,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'U',  name: 'Uranium',        atomicNumber: 92,   atomicMass: 238.029,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'Np', name: 'Neptunium',      atomicNumber: 93,   atomicMass: 237.000,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'Pu', name: 'Plutonium',      atomicNumber: 94,   atomicMass: 244.000,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'Am', name: 'Americium',      atomicNumber: 95,   atomicMass: 243.000,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'Cm', name: 'Curium',         atomicNumber: 96,   atomicMass: 247.000,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'Bk', name: 'Berkelium',      atomicNumber: 97,   atomicMass: 247.000,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'Cf', name: 'Californium',    atomicNumber: 98,   atomicMass: 251.000,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'Es', name: 'Einsteinium',    atomicNumber: 99,   atomicMass: 252.000,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'Fm', name: 'Fermium',        atomicNumber: 100,  atomicMass: 257.000,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'Md', name: 'Mendelevium',    atomicNumber: 101,  atomicMass: 258.000,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'No', name: 'Nobelium',       atomicNumber: 102,  atomicMass: 259.000,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'Lr', name: 'Lawrencium',     atomicNumber: 103,  atomicMass: 262.000,  group: 3,   period: 7, type: 'actinide' },
  { symbol: 'Rf', name: 'Rutherfordium',  atomicNumber: 104,  atomicMass: 267.000,  group: 4,   period: 7, type: 'overgangsmetaal' },
  { symbol: 'Db', name: 'Dubnium',        atomicNumber: 105,  atomicMass: 268.000,  group: 5,   period: 7, type: 'overgangsmetaal' },
  { symbol: 'Sg', name: 'Seaborgium',     atomicNumber: 106,  atomicMass: 271.000,  group: 6,   period: 7, type: 'overgangsmetaal' },
  { symbol: 'Bh', name: 'Bohrium',        atomicNumber: 107,  atomicMass: 272.000,  group: 7,   period: 7, type: 'overgangsmetaal' },
  { symbol: 'Hs', name: 'Hassium',        atomicNumber: 108,  atomicMass: 277.000,  group: 8,   period: 7, type: 'overgangsmetaal' },
  { symbol: 'Mt', name: 'Meitnerium',     atomicNumber: 109,  atomicMass: 276.000,  group: 9,   period: 7, type: 'overgangsmetaal' },
  { symbol: 'Ds', name: 'Darmstadtium',   atomicNumber: 110,  atomicMass: 281.000,  group: 10,  period: 7, type: 'overgangsmetaal' },
  { symbol: 'Rg', name: 'Roentgenium',    atomicNumber: 111,  atomicMass: 282.000,  group: 11,  period: 7, type: 'overgangsmetaal' },
  { symbol: 'Cn', name: 'Copernicium',    atomicNumber: 112,  atomicMass: 285.000,  group: 12,  period: 7, type: 'overgangsmetaal' },
  { symbol: 'Nh', name: 'Nihonium',       atomicNumber: 113,  atomicMass: 286.000,  group: 13,  period: 7, type: 'onbekend' }, 
  { symbol: 'Fl', name: 'Flerovium',      atomicNumber: 114,  atomicMass: 289.000,  group: 14,  period: 7, type: 'onbekend' },
  { symbol: 'Mc', name: 'Moscovium',      atomicNumber: 115,  atomicMass: 290.000,  group: 15,  period: 7, type: 'onbekend' },
  { symbol: 'Lv', name: 'Livermorium',    atomicNumber: 116,  atomicMass: 293.000,  group: 16,  period: 7, type: 'onbekend' },
  { symbol: 'Ts', name: 'Tennessine',     atomicNumber: 117,  atomicMass: 294.000,  group: 17,  period: 7, type: 'onbekend' },
  { symbol: 'Og', name: 'Oganesson',      atomicNumber: 118,  atomicMass: 294.000,  group: 18,  period: 7, type: 'onbekend' }
];

// Atoommassa's in een makkelijk doorzoekbaar object
const atomicMasses = elementsData.reduce((acc, el) => {
  acc[el.symbol] = el.atomicMass;
  return acc;
}, {})

// Helper functie om de Tailwind-kleurklasse op basis van type te krijgen
const getElementColorClass = (type) => {
    const colorMap = {
        'niet-metaal': 'bg-blue-400',
        'edelgas': 'bg-purple-400',
        'alkalimetaal': 'bg-red-400',
        'aardalkalimetaal': 'bg-orange-400',
        'metaloïde': 'bg-green-400',
        'halogeen': 'bg-teal-400',
        'hoofdgroepmetaal': 'bg-gray-400',
        'overgangsmetaal': 'bg-yellow-400',
        'lanthanide': 'bg-pink-400', // Roze voor Lanthaniden
        'actinide': 'bg-indigo-400', // Indigo voor Actiniden
        'onbekend': 'bg-gray-300',
    };
    return colorMap[type] || colorMap['onbekend'];
};


// Component voor een enkel element in het periodiek systeem
const ElementTile = ({ element, onPress }) => (
  <button
    className={`flex flex-col items-center justify-center p-1 border border-gray-400 rounded-md h-full w-full ${getElementColorClass(element.type)}`}
    onClick={() => onPress(element)}
  >
    <span className="text-lg font-bold text-white">{element.symbol}</span>
    <span className="absolute top-0.5 left-0.5 text-xs text-white/70">{element.atomicNumber}</span>
    <span className="text-xs text-center text-white/90">{element.name}</span>
    <span className="text-[9px] text-center text-white/80">{element.atomicMass.toFixed(3)}</span>
  </button>
);

// Scherm voor het Periodiek Systeem
const PeriodicTableScreen = ({ setSelectedElementForCalc }) => {
  const [selectedElement, setSelectedElement] = useState(null);

  // Filter elementen voor de hoofdtabel en de aparte rijen
  const mainElements = elementsData.filter(el =>
    !(el.atomicNumber >= 57 && el.atomicNumber <= 71) && // Geen Lanthanide
    !(el.atomicNumber >= 89 && el.atomicNumber <= 103)    // Geen Actinide
  );
  const lanthanides = elementsData.filter(el => el.atomicNumber >= 57 && el.atomicNumber <= 71);
  const actinides = elementsData.filter(el => el.atomicNumber >= 89 && el.atomicNumber <= 103);

  // Bepaal de maximale groepen en periodes voor de hoofdtabel
  const maxPeriod = 7; // Maximaal aantal periodes in de hoofdtabel
  const maxGroup = 18; // Maximaal aantal groepen in de hoofdtabel
  
  // Initialiseer het rooster voor de hoofdtabel
  const grid = Array(maxPeriod).fill(null).map(() => Array(maxGroup).fill(null));

  // Plaats de hoofdelementen in het rooster
  mainElements.forEach(el => {
    if (el.period > 0 && el.group > 0) {
      grid[el.period - 1][el.group - 1] = el;
    }
  });

  // Plaats plaatsaanduidingen voor Lanthaniden en Actiniden in de hoofdtabel
  // Lanthaniden: Periode 6 (index 5), Groep 3 (index 2)
  if (grid[5] && grid[5][2] === null) {
      grid[5][2] = { placeholder: 'lanthanides', display: '57-71', linkText: 'La-Lu' };
  }
  // Actiniden: Periode 7 (index 6), Groep 3 (index 2)
  if (grid[6] && grid[6][2] === null) {
      grid[6][2] = { placeholder: 'actinides', display: '89-103', linkText: 'Ac-Lr' };
  }

  const handleElementPress = (element) => {
    setSelectedElement(element);
    if (setSelectedElementForCalc) {
        setSelectedElementForCalc(element.symbol); // Stuur symbool naar calculator
    }
  };

  return (
    <div className="flex-1 p-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-5 text-center text-gray-900">Periodiek Systeem der Elementen</h1>
      <div className="overflow-x-auto pb-4"> {/* Extra opvulling aan de onderkant voor de scrollbalk */}
        <div>
          {/* Render Groepsnummers bovenaan */}
          <div className="flex flex-nowrap"> {/* Voorkomt dat items wrappen */}
            {/* Lege cel voor periodenummer */}
            <div className="w-[30px] h-[30px] m-0.5 flex-shrink-0" /> 
            {Array.from({ length: maxGroup }, (_, i) => i + 1).map(groupNum => (
              <div key={`group-label-${groupNum}`} className="w-[75px] h-[30px] m-0.5 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                {groupNum}
              </div>
            ))}
          </div>

          {grid.map((row, rowIndex) => (
            <div key={`period-${rowIndex}`} className="flex flex-nowrap"> {/* Voorkomt dat items wrappen */}
              {/* Periodenummer aan de linkerkant */}
              <div className="w-[30px] h-[90px] m-0.5 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                {rowIndex + 1}
              </div>
              {row.map((cellContent, colIndex) => (
                <div key={`element-${rowIndex}-${colIndex}`} className="w-[75px] h-[90px] m-0.5 flex-shrink-0"> {/* Zorgt voor vaste breedte en voorkomt krimpen */}
                  {cellContent ? (
                    cellContent.placeholder ? (
                      // Render placeholder voor Lanthaniden/Actiniden
                      <div
                        className="flex flex-col items-center justify-center p-1 border border-gray-400 rounded-md h-full w-full bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors flex-shrink-0"
                        onClick={() => {
                          const sectionId = cellContent.placeholder === 'lanthanides' ? 'lanthanides-section' : 'actinides-section';
                          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <p className="text-gray-700 font-semibold">{cellContent.display}</p>
                        <p className="text-gray-500 text-xs">{cellContent.linkText}</p>
                      </div>
                    ) : (
                      // Render een reguliere ElementTile
                      <ElementTile element={cellContent} onPress={handleElementPress} />
                    )
                  ) : (
                    <div className="w-[75px] h-[90px] m-0.5 flex-shrink-0" /> // Lege cel, zorgt voor vaste breedte en voorkomt krimpen
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Lanthaniden rij */}
      <div id="lanthanides-section" className="mt-8 px-4 py-2 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-xl font-bold mb-2 text-center text-gray-800">Lanthaniden (La-Lu)</h2>
          <div className="flex overflow-x-auto pb-2 -ml-0.5 -mr-0.5 flex-nowrap"> {/* Voorkomt dat items wrappen */}
              {/* Lege cellen voor uitlijning (Groepen 1 en 2, plus extra voor start van groep 3) */}
              {Array(3).fill(null).map((_, i) => <div key={`empty-lanth-start-${i}`} className="w-[75px] h-[90px] m-0.5 flex-shrink-0" />)} {/* Vaste breedte, voorkomt krimpen */}
              {lanthanides.map((element) => (
                  <div key={element.symbol} className="w-[75px] h-[90px] m-0.5 flex-shrink-0"> {/* Vaste breedte, voorkomt krimpen */}
                      <ElementTile element={element} onPress={handleElementPress} />
                  </div>
              ))}
          </div>
      </div>

      {/* Actiniden rij */}
      <div id="actinides-section" className="mt-4 mb-8 px-4 py-2 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-xl font-bold mb-2 text-center text-gray-800">Actiniden (Ac-Lr)</h2>
          <div className="flex overflow-x-auto pb-2 -ml-0.5 -mr-0.5 flex-nowrap"> {/* Voorkomt dat items wrappen */}
              {/* Lege cellen voor uitlijning */}
              {Array(3).fill(null).map((_, i) => <div key={`empty-actin-start-${i}`} className="w-[75px] h-[90px] m-0.5 flex-shrink-0" />)} {/* Vaste breedte, voorkomt krimpen */}
              {actinides.map((element) => (
                  <div key={element.symbol} className="w-[75px] h-[90px] m-0.5 flex-shrink-0"> {/* Vaste breedte, voorkomt krimpen */}
                      <ElementTile element={element} onPress={handleElementPress} />
                  </div>
              ))}
          </div>
      </div>

      {selectedElement && (
        <div className="mt-5 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
          <h2 className="text-xl font-bold mb-2.5 text-gray-800">{selectedElement.name} ({selectedElement.symbol})</h2>
          <p className="text-base mb-1.5 text-gray-700">Atoomnummer: {selectedElement.atomicNumber}</p>
          <p className="text-base mb-1.5 text-gray-700">Atoommassa: {selectedElement.atomicMass.toFixed(4)} u</p>
          <p className="text-base mb-1.5 text-gray-700">Type: {selectedElement.type}</p>
          <p className="text-base mb-1.5 text-gray-700">Groep: {selectedElement.group}, Periode: {selectedElement.period}</p>
        </div>
      )}
    </div>
  );
};

// Scherm voor de Molaire Massa Calculator
const MolarMassCalculatorScreen = ({ initialFormula = '' }) => {
  const [formulaInput, setFormulaInput] = useState(initialFormula);
  const [trivialNameInput, setTrivialNameInput] = useState('');
  const [molarMass, setMolarMass] = useState(null);
  const [calculationError, setCalculationError] = useState('');
  const [elementalBreakdown, setElementalBreakdown] = useState(null);
  const [nameSuggestions, setNameSuggestions] = useState([]);

  // Kleuren voor de pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6B6B', '#6BD8FF'];

  useEffect(() => {
    if (initialFormula) {
        setFormulaInput(initialFormula);
        handleCalculateFromFormula(initialFormula);
    }
  }, [initialFormula]);


  // Functie om de brutoformule te parsen en molaire massa te berekenen
  const calculateMolarMass = (formula) => {
    if (!formula) return { mass: 0, error: '', composition: {} };

    let totalMass = 0;
    const elementsCount = {};

    // Helper functie om het canonieke elementsymbool te krijgen (hoofdlettergevoelig)
    const getCanonicalElementSymbol = (inputSymbol) => {
        // Controleer direct of het symbool exact overeenkomt met een bekend element
        if (atomicMasses[inputSymbol]) {
            return inputSymbol;
        }
        return null; // Geen herkend element
    };

    // Functie om een subformule te parsen en het elementsCount object bij te werken.
    // Dit is een recursieve parser die haakjes kan afhandelen.
    function parseFormulaSegment(segment, segmentMultiplier = 1) {
        let i = 0;
        while (i < segment.length) {
            let char = segment[i];

            // Negeer '-' en '=' symbolen, en ook witruimte
            if (char === '-' || char === '=' || /\s/.test(char)) {
                i++;
                continue; // Ga naar de volgende iteratie van de lus
            }

            if (char === '(') {
                // Zoek de overeenkomende sluithaakje
                let openParens = 1;
                let j = i + 1;
                let subFormulaStart = j;
                while (j < segment.length && openParens > 0) {
                    if (segment[j] === '(') openParens++;
                    else if (segment[j] === ')') openParens--;
                    j++;
                }

                if (openParens > 0) {
                    throw new Error(`Ongeldige formule: Ongepaard haakje in "${segment.substring(i)}".`);
                }

                let subFormula = segment.substring(subFormulaStart, j - 1);
                i = j; // Verplaats index naar na het sluithaakje

                // Zoek naar een nummer na het sluithaakje
                let numStr = '';
                while (i < segment.length && /\d/.test(segment[i])) {
                    numStr += segment[i];
                    i++;
                }
                let subMultiplier = numStr ? parseInt(numStr, 10) : 1;

                // Recursief parsen van de subformule
                parseFormulaSegment(subFormula, segmentMultiplier * subMultiplier);

            } else if (/[A-Z]/.test(char)) {
                // Begin van een elementsymbool
                let symbol = char;
                i++;
                if (i < segment.length && /[a-z]/.test(segment[i])) {
                    symbol += segment[i];
                    i++;
                }

                let canonicalSymbol = getCanonicalElementSymbol(symbol);
                if (!canonicalSymbol) {
                    throw new Error(`Onbekend element of ongeldig symbool: "${symbol}". Let op hoofdlettergevoeligheid!`);
                }

                let numStr = '';
                while (i < segment.length && /\d/.test(segment[i])) {
                    numStr += segment[i];
                    i++;
                }
                let count = numStr ? parseInt(numStr, 10) : 1;

                elementsCount[canonicalSymbol] = (elementsCount[canonicalSymbol] || 0) + count * segmentMultiplier;

            } else {
                // Ongeldig teken
                throw new Error(`Onbekend element of ongeldig symbool: "${char}". Let op hoofdlettergevoeligheid!`);
            }
        }
    }

    // Splits de formule in hoofddeel en hydraatdeel
    const parts = formula.split(/[.·*]/);
    const mainFormula = parts[0].trim();
    const hydratePart = parts.length > 1 ? parts[1].trim() : '';

    // Molaire massa water
    const molarMassH2O = 18.0150;

    // Behandel hydraat gedeelte
    if (hydratePart) {
        // Gebruik een hoofdlettergevoelige match voor H2O
        const hydrateMatch = hydratePart.match(/^(\d+)H2O$/); 
        if (hydrateMatch) {
            const hydrateMultiplier = parseInt(hydrateMatch[1], 10);
            elementsCount['H'] = (elementsCount['H'] || 0) + (hydrateMultiplier * 2);
            elementsCount['O'] = (elementsCount['O'] || 0) + (hydrateMultiplier * 1);
            totalMass += hydrateMultiplier * molarMassH2O;
        } else {
            throw new Error(`Ongeldige hydraatformule: ${hydratePart}. Verwacht formaat: nH2O`);
        }
    }

    // Parseer de hoofdformule
    parseFormulaSegment(mainFormula, 1);

    // Eindberekening voor elementen in de hoofdformule
    for (const element in elementsCount) {
        totalMass += atomicMasses[element] * elementsCount[element];
    }
    
    if (Object.keys(elementsCount).length === 0 && mainFormula.trim() !== '') {
        // Deze conditie vangt gevallen op waarbij de hoofdformule niet leeg was, maar geen elementen werden geparsed.
        // Dit kan duiden op een misvormde formule die de regex niet heeft opgevangen.
        throw new Error('Kon formule niet parsen of resulteerde in 0 massa. Controleer haakjes en symbolen.');
    }

    return { mass: totalMass, error: '', composition: elementsCount };
  };

  const handleCalculateFromFormula = (currentFormula) => {
    setMolarMass(null);
    setCalculationError('');
    setElementalBreakdown(null); // Reset elementaire samenstelling

    try {
      const result = calculateMolarMass(currentFormula);
      if (result.error) {
        setCalculationError(result.error);
      } else if (result.mass > 0) {
        setMolarMass(result.mass.toFixed(4));

        // Bereid gegevens voor de tabel en charts
        const breakdownData = [];
        let totalAtoms = 0;
        for (const symbol in result.composition) {
            totalAtoms += result.composition[symbol];
        }

        for (const symbol in result.composition) {
          const count = result.composition[symbol];
          const atomicMass = atomicMasses[symbol];
          const molarMassContribution = count * atomicMass;
          
          const atomicPercentage = (count / totalAtoms) * 100; // Atoompercentage
          const massPercentage = (molarMassContribution / result.mass) * 100; // Massapercentage
          
          breakdownData.push({
            name: symbol, // Naam voor de chart slice
            count: count,
            molarMass: atomicMass.toFixed(3), // Molaire massa van het element zelf
            molarMassContribution: molarMassContribution.toFixed(3), // Bijdrage aan totale molaire massa
            atomicPercentage: atomicPercentage.toFixed(2), // Atoompercentage als string
            massPercentage: massPercentage.toFixed(2), // Massapercentage als string
            atomicValue: count, // Waarde voor atoompercentage pie chart
            massValue: molarMassContribution // Waarde voor massapercentage pie chart
          });
        }
        setElementalBreakdown(breakdownData);

      } else if (currentFormula.trim() !== '') {
        // Als de massa 0 is maar er was input, kan het een parsefout zijn die niet werd opgevangen
        setCalculationError('Kon formule niet parsen of resulteerde in 0 massa.');
      }
    } catch (e) {
      setCalculationError(e.message);
    }
  };

  // NIEUW: Functie voor het zoeken op triviale naam
  const handleTrivialNameLookup = () => {
    setMolarMass(null);
    setCalculationError('');
    setElementalBreakdown(null);
    const normalizedInput = trivialNameInput.trim().toLowerCase();
    const formula = trivialNames[normalizedInput];
    if (formula) {
      setFormulaInput(formula); // Update ook het formule-invoerveld
      handleCalculateFromFormula(formula);
      setCalculationError(''); // Wis eerdere fouten na succesvolle lookup
    } else if (trivialNameInput.trim() !== '') {
      setCalculationError(`Triviale naam "${trivialNameInput}" niet gevonden.`);
    } else {
      setCalculationError('Voer een triviale naam in.');
    }
  };

  // Functie om suggesties te genereren
  const getSuggestions = (input) => {
    if (input.length < 1) {
      return [];
    }
    const lowerInput = input.toLowerCase();
    const filteredSuggestions = allTrivialNames.filter(name =>
      name.startsWith(lowerInput)
    ).slice(0, 5);
    return filteredSuggestions;
  };

  // Handler voor verandering in triviale naam invoer
  const handleTrivialNameInputChange = (e) => {
    const value = e.target.value;
    setTrivialNameInput(value);
    setNameSuggestions(getSuggestions(value));
  };

  // Handler voor het selecteren van een suggestie
  const handleSuggestionClick = (suggestion) => {
    setTrivialNameInput(suggestion);
    setNameSuggestions([]); // Wis de suggesties na selectie
    const formula = trivialNames[suggestion.toLowerCase()];
    if (formula) {
      setFormulaInput(formula);
      handleCalculateFromFormula(formula);
      setCalculationError(''); // Wis eerdere fouten na succesvolle selectie
    } else {
        setCalculationError(`Formule voor "${suggestion}" niet gevonden.`);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-white bg-opacity-90 border border-gray-300 rounded-md shadow-lg text-sm text-gray-800">
          <p className="font-bold">{data.name}</p>
          <p>Aantal atomen: {data.count}</p>
          <p>Molaire massa element: {data.molarMass} g/mol</p>
          <p>Bijdrage aan molaire massa: {data.molarMassContribution} g/mol</p>
          <p>Atoompercentage: {data.atomicPercentage}%</p>
          <p>Massapercentage: {data.massPercentage}%</p>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="flex-1 p-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-5 text-center text-gray-900">Molaire Massa Calculator</h1>

      <div className="mb-5 relative">
        <label className="block text-base mb-2 text-gray-700 font-medium">Zoek op triviale naam:</label>
        <input
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-base mb-3 text-gray-900 w-full"
          placeholder="bv. Water, Zoutzuur"
          value={trivialNameInput}
          onChange={handleTrivialNameInputChange}
          autoCapitalize="words"
          onBlur={() => setTimeout(() => setNameSuggestions([]), 100)}
          onKeyDown={(e) => { // NIEUW: onKeyDown handler voor Enter
            if (e.key === 'Enter') {
              handleTrivialNameLookup();
            }
          }}
        />
        {nameSuggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
            {nameSuggestions.map((suggestion, index) => (
              <li 
                key={index} 
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-900"
                onMouseDown={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" onClick={handleTrivialNameLookup}>Zoek Triviale Naam</button>
      </div>

      <div className="flex items-center my-5">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="mx-2.5 text-sm text-gray-500 font-semibold">OF</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>
      
      <div className="mb-5">
        <label className="block text-base mb-2 text-gray-700 font-medium">Voer brutoformule in:</label>
        <input
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-base mb-3 text-gray-900 w-full"
          placeholder="bv. H2O, C6H12O6, Ca(OH)2"
          value={formulaInput}
          onChange={(e) => {
            setFormulaInput(e.target.value);
          }}
          autoCapitalize="none"
          autoCorrect="off"
          onKeyDown={(e) => { // NIEUW: onKeyDown handler voor Enter
            if (e.key === 'Enter') {
              handleCalculateFromFormula(formulaInput);
            }
          }}
        />
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg" onClick={() => handleCalculateFromFormula(formulaInput)}>Bereken Molaire Massa</button>
      </div>

      {molarMass !== null && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 flex flex-col items-center">
          <p className="text-lg text-green-800 font-medium">Molaire Massa:</p>
          <p className="text-3xl font-bold text-green-700 mt-1.5">{molarMass} g/mol</p>
        </div>
      )}
      {calculationError !== '' && (
        <div className="mt-5 p-3 bg-red-50 rounded-lg border border-red-200 flex flex-col items-center">
          <p className="text-base text-red-700 text-center">{calculationError}</p>
        </div>
      )}

      {elementalBreakdown && elementalBreakdown.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center text-gray-900">Elementaire Samenstelling</h2>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-8">
            {/* Atoompercentage Sectie */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Atoompercentage</h3>
                <div className="w-full h-[250px] flex justify-center items-center"> 
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={elementalBreakdown}
                                dataKey="atomicValue" // Gebruik count voor atoompercentage
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius="70%"
                                fill="#8884d8"
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`} 
                                labelLine={true}
                            >
                                {elementalBreakdown.map((entry, index) => (
                                    <Cell key={`atom-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Massapercentage Sectie */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Massapercentage</h3>
                <div className="w-full h-[250px] flex justify-center items-center"> 
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={elementalBreakdown}
                                dataKey="massValue" // Gebruik molarMassContribution voor massapercentage
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius="70%"
                                fill="#8884d8"
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`} 
                                labelLine={true}
                            >
                                {elementalBreakdown.map((entry, index) => (
                                    <Cell key={`mass-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div> {/* Einde flex container voor charts */}

          {/* Table */}
          <div className="w-full overflow-x-auto mt-4">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-2 px-3 text-left border-b border-gray-300">Atoom</th>
                  <th className="py-2 px-3 text-left border-b border-gray-300">Aantal</th>
                  <th className="py-2 px-3 text-left border-b border-gray-300">Molaire Massa (g/mol)</th>
                  <th className="py-2 px-3 text-left border-b border-gray-300">Atoompercentage</th>
                  <th className="py-2 px-3 text-left border-b border-gray-300">Massapercentage</th>
                </tr>
              </thead>
              <tbody>
                {elementalBreakdown.map((element, index) => (
                  <tr key={element.name} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3 text-left">{element.name}</td>
                    <td className="py-2 px-3 text-left">{element.count}</td>
                    <td className="py-2 px-3 text-left">{element.molarMassContribution}</td>
                    <td className="py-2 px-3 text-left">{element.atomicPercentage}%</td>
                    <td className="py-2 px-3 text-left">{element.massPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


// Hoofd App Component met navigatie
export default function App() {
  const [activeScreen, setActiveScreen] = useState('calculator'); // 'table' of 'calculator'
  const [formulaForCalculator, setFormulaForCalculator] = useState('');

  const navigateToCalculatorWithElement = (elementSymbol) => {
    setFormulaForCalculator(elementSymbol); // Zet het symbool als formule
    setActiveScreen('calculator');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Tailwind CSS CDN is verplaatst naar public/index.html */}
      <div className="flex justify-around py-2 bg-gray-200 border-b border-gray-300">
        <button 
            className={`py-2 px-4 rounded-lg ${activeScreen === 'table' ? 'bg-blue-500 text-white' : 'text-gray-800'}`} 
            onClick={() => { setFormulaForCalculator(''); setActiveScreen('table');}}>
          Periodiek Systeem
        </button>
        <button 
            className={`py-2 px-4 rounded-lg ${activeScreen === 'calculator' ? 'bg-blue-500 text-white' : 'text-gray-800'}`} 
            onClick={() => setActiveScreen('calculator')}>
          Molaire Massa Calculator
        </button>
      </div>

      {activeScreen === 'table' && <PeriodicTableScreen setSelectedElementForCalc={navigateToCalculatorWithElement} />}
      {activeScreen === 'calculator' && <MolarMassCalculatorScreen initialFormula={formulaForCalculator} />}
    </div>
  );
}
