const axios = require('axios');
const cheerio = require('cheerio');
const canonicalUrl = require('./canonicalUrl');

const source_url = 'https://opensource.org/licenses/alphabetical';
const licensesListSelector = '.field-items ul li a';
const licenseContentSelector = '#main-content';

 
const fetchLicenseContent = async (licenseUrl) => {
    const html_doc = await axios.get(licenseUrl);
    const $ = await cheerio.load(html_doc.data);
    const content = await $(licenseContentSelector).text();
    console.log(`Fetched: ${licenseUrl}`);
    return content;
};

const fetchLicenseList = async function* () {
    // Fetch license list
    const html_doc = await axios.get(source_url);
    const $ = await cheerio.load(html_doc.data);
    const licensesList = await $(licensesListSelector);


    for (let license  of licensesList.toArray()){
        const url = canonicalUrl(license.attribs.href);
        const content = await fetchLicenseContent(url);
        const nameParts = license.children[0].data.split(/\((.*)\)/); // Assumes first child is a text node
        
        const _license = {
            name: nameParts[0],
            shortId: nameParts.length >= 2 ? nameParts[1] : nameParts[0],
            url: url,
            content: content.trim().replace(/ *\n */g,'\n').replace(/(\r? ?\n ?|\r ?)+/g,'$1')
        };

        yield _license;
    }

};

module.exports = fetchLicenseList;