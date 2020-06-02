const axios = require('axios');
const cheerio = require('cheerio');
const JSONStream = require('JSONStream');
const canonicalUrl = require('./canonicalUrl');

const source_url = 'https://opensource.org/licenses/alphabetical';
const licensesListSelector = '.field-items ul li a';
const licenseContentSelector = '#main-content';

let licenseCount = 0;
 
const fetchLicenseContent = async (licenseUrl) => {
    const html_doc = await axios.get(licenseUrl);
    const $ = await cheerio.load(html_doc.data);
    const content = await $(licenseContentSelector).text();
    console.log(`Fetched: ${licenseUrl}`);
    return content;
};

const fetchLicenseList = async (writeStream) => {
    const jsonWriter = JSONStream.stringify();
    jsonWriter.pipe(writeStream);

    const html_doc = await axios.get(source_url);
    const $ = await cheerio.load(html_doc.data);
    const licensesList = $(licensesListSelector);

    licenseCount = licensesList.length;

    licensesList.each(async (index, element) => {
        const content = await fetchLicenseContent(canonicalUrl($(element).attr('href')));
        const nameParts = $(element).text().split(/\((.*)\)/);
        const chunk = {
            name: nameParts[0],
            shortId: nameParts.length >= 2 ? nameParts[1] : nameParts[0],
            url: canonicalUrl($(element).attr('href')),
            content: content.trim().replace(/ *\n */g,'\n').replace(/(\r? ?\n ?|\r ?)+/g,'$1')
        };
        jsonWriter.write(chunk);

        licenseCount--;
        
        if(licenseCount === 0){
            jsonWriter.end();
        }
    });
};

module.exports = fetchLicenseList;