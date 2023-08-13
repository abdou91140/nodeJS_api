/* const axios = require('axios');
const pool = require('../config/database.js');

async function fetchData(postalCode) {
    try {
        const response = await axios.get(`https://recherche-entreprises.api.gouv.fr/search?code_postal=${postalCode}`);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function insertData(query, values) {
    return new Promise((resolve, reject) => {
        pool.query(query, values, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function updateData(query, values) {
    return new Promise((resolve, reject) => {
        pool.query(query, values, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function saveEntreprisesToDatabase(entreprisesData) {
    const queryCheckExists = 'SELECT siren FROM society WHERE siren = ?';
    const queryInsert = 'INSERT INTO society (siren,nom_complet,nom_raison_sociale,sigle,adresse,code_postal,coordonnees,departement) VALUES (?,?,?,?,?,?,?,?)';
    const queryUpdate = 'UPDATE society SET nom_complet = ?, nom_raison_sociale = ?, sigle = ?, adresse = ?, code_postal = ?, coordonnees = ?, departement = ? WHERE siren = ?';

    for (const entrepriseData of entreprisesData) {
        const [existingData] = await insertData(queryCheckExists, [entrepriseData.siren]);

        if (!existingData) {
            await insertData(queryInsert, [
                entrepriseData.siren,
                entrepriseData.nom_complet,
                entrepriseData.nom_raison_sociale,
                entrepriseData.sigle,
                entrepriseData.siege.adresse,
                entrepriseData.siege.code_postal,
                entrepriseData.siege.coordonnees,
                entrepriseData.siege.departement
            ]);
            console.log(`Data for SIREN ${entrepriseData.siren} inserted`);
        } else {
            await updateData(queryUpdate, [
                entrepriseData.nom_complet,
                entrepriseData.nom_raison_sociale,
                entrepriseData.sigle,
                entrepriseData.siege.adresse,
                entrepriseData.siege.code_postal,
                entrepriseData.siege.coordonnees,
                entrepriseData.siege.departement,
                entrepriseData.siren
            ]);
            console.log(`Data for SIREN ${entrepriseData.siren} updated`);
        }
    }
    try {
        await Promise.all(insertData);
        console.log('All data inserted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

async function main() {
    const targetPostalCode = '69001';

    try {
        const data = await fetchData(targetPostalCode);
        await saveEntreprisesToDatabase(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
 */
const axios = require('axios');
const pool = require('../config/database.js');

// Fetch data from the API
const fetchData = async (postalCode) => {
    try {
        const response = await axios.get(`https://recherche-entreprises.api.gouv.fr/search?code_postal=${postalCode}`);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

// Function to insert data into the database
function insertData(query, values) {
    return pool.query(query, values);
}

// Function to update existing data in the database
function updateData(query, values) {
    return pool.query(query, values);
}

// Function to check if data exists in the table
async function checkDataExists() {
    const query = 'SELECT COUNT(*) as count FROM society';
    const [rows] = await pool.query(query);
    return rows[0].count > 0;
}

// Function to save multiple entreprises data into the database
async function saveEntreprisesToDatabase(entreprisesData) {
    const queryInsert = 'INSERT INTO society (siren,nom_complet,nom_raison_sociale,sigle,adresse,code_postal,coordonnees,departement) VALUES (?,?,?,?,?,?,?,?)';
    const queryUpdate = 'UPDATE society SET nom_complet=?, nom_raison_sociale=?, sigle=?, adresse=?, code_postal=?, coordonnees=?, departement=? WHERE siren=?';

    const dataExists = await checkDataExists();

    const promises = entreprisesData.map(entrepriseData => {
        const values = [
            entrepriseData.nom_complet,
            entrepriseData.nom_raison_sociale,
            entrepriseData.sigle,
            entrepriseData.siege.adresse,
            entrepriseData.siege.code_postal,
            entrepriseData.siege.coordonnees,
            entrepriseData.siege.departement,
            entrepriseData.siren
        ];
        if (dataExists) {
            return updateData(queryUpdate, values);
        } else {
            values.unshift(entrepriseData.siren);
            return insertData(queryInsert, values);
        }
    });

    try {
        await Promise.all(promises);
        console.log('All data saved/updated successfully');
    } catch (error) {
        console.error('Error saving/updating data:', error);
    }
}

// Specify the postal code for which you want to fetch and insert data
const targetPostalCode = '69001';

// Fetch data and insert/update into the database
fetchData(targetPostalCode)
    .then(data => saveEntreprisesToDatabase(data))
    .catch(err => console.error('Error:', err));