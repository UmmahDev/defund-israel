const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const axios = require('axios');
const cheerio = require('cheerio');
const localReps = require('../reps.json'); // Make sure the path is correct
const TABLENAME = 'RepresentativesCache';

// The rest of your code (getRepresentative, getFirstAndLastName) remains the same...
// Function to get representative based on the zip code
async function getRepresentative(zipcode) {
    const url = 'https://ziplook.house.gov/htbin/findrep_house';

    const headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://www.house.gov',
        'Referer': 'https://www.house.gov/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"'
    };

    const data = `ZIP=${zipcode}`;

    try {
        const response = await axios.post(url, data, { headers: headers });

        // Load the HTML into cheerio
        const $ = cheerio.load(response.data);

        const representatives = [];

        // Extract the representatives' data
        $('div[id="PossibleReps"] div[name="RepeatReps"], div[id="RepInfo"]').each((index, element) => {
            const name = $(element).find('a').first().text().trim();
            const imageUrl = $(element).find('img.repPhoto').attr('src');

            representatives.push({
                name: name,
                imageUrl: imageUrl,
            });
        });

        return representatives;
    } catch (error) {
        console.error('Error fetching and parsing representative data:', error);
        throw error;
    }
}

function getFirstAndLastName(nameStr) {
    // Define suffixes to check against
    const suffixes = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];

    // Remove commas and extra spaces, then split the name into parts
    let nameParts = nameStr.replace(',', '').split(/\s+/);

    // Check if the last part is a suffix and adjust accordingly
    if (suffixes.includes(nameParts[nameParts.length - 1])) {
        nameParts.pop();
    }

    let firstName, lastName;

    // If there is only one part left, it will be considered the first name
    if (nameParts.length === 1) {
        firstName = nameParts[0];
        lastName = ''; // If there is no last name
    } else {
        // The first part is the first name
        firstName = nameParts[0];
        // The last part is the last name
        lastName = nameParts[nameParts.length - 1];
    }

    return { firstName, lastName };
}

// Function to check and return cached data if available
async function getCachedData(zipcode) {
    const params = {
        TableName: TABLENAME,
        Key: {
            zipcode: zipcode,
        },
    };

    try {
        const result = await dynamoDb.get(params).promise();
        if (result.Item) {
            return result.Item.data;
        }
    } catch (error) {
        console.error('Error retrieving cache:', error);
    }
    return null;
}

// Function to cache data
async function cacheData(zipcode, data) {
    const params = {
        TableName: TABLENAME,
        Item: {
            zipcode: zipcode,
            data: data,
        },
    };

    try {
        await dynamoDb.put(params).promise();
    } catch (error) {
        console.error('Error caching data:', error);
    }
}


const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Adjust the origin according to your needs
    'Access-Control-Allow-Credentials': true,
};

// Lambda handler
exports.handler = async (event) => {
    let zipcode = "";

    // Check if invoked via API Gateway with a query string parameter
    if (event.queryStringParameters && event.queryStringParameters.zipcode) {
        zipcode = event.queryStringParameters.zipcode;
    }

    console.log({ zipcode });

    try {
        let cachedData = await getCachedData(zipcode);
        if (cachedData) {
            console.log({ message: 'got data from cache', cachedData, zipcode });
            return {
                statusCode: 200,
                body: JSON.stringify(cachedData),
                headers
            };
        }

        // Fetch the representative information based on the zipcode
        const fetchedRepresentatives = await getRepresentative(zipcode);

        // Iterate over the fetched representatives to enrich them with emails from localReps
        const enrichedRepresentatives = fetchedRepresentatives.map(fetchedRep => {
            const { firstName, lastName } = getFirstAndLastName(fetchedRep.name);
            let email = null; // Default email to null if not found

            // Search for matching representative in localReps to find the email
            Object.values(localReps).forEach(stateReps => {
                stateReps.representatives.forEach(rep => {
                    if (rep.firstName === firstName && rep.lastName === lastName) {
                        // If a match is found, assign the email
                        email = rep.email;
                    }
                });
            });

            // Return a new object that includes the email from localReps
            return {
                ...fetchedRep,
                email: email, // This will be null if no email was matched
            };
        });

        await cacheData(zipcode, enrichedRepresentatives);
        console.log({ message: 'cached data', enrichedRepresentatives, zipcode });


        // Return the successful response with the enriched data
        return {
            statusCode: 200,
            body: JSON.stringify(enrichedRepresentatives),
            headers
        };
    } catch (error) {
        // Log the error and return a failure response
        console.error('Error fetching representatives:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred while fetching representatives.' }),
            headers
        };
    }
};
