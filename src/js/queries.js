// List of random queries to display
const queries = [
    "Quantify productivity loss because of gender dysphoria or trans invisibility",
    "Surviving a people sea attack in Huaqiangbei",
    "Hormone hunters, but this time not limited to adrenaline",
    "Visiting a synchrotron",
    "Playing artificial angels, 100 gecs and metaroom on an oscilloscope",
    "differential geometry",
    "Collecting out of distribution friends from 50+ countries"
];

function getRandomQuery() {
    return randomQueries[Math.floor(Math.random() * randomQueries.length)];
}