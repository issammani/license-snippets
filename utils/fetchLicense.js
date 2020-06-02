const axios = require('axios');
const HTMLParser  = require('node-html-parser');
const canonicalUrl = require('./canonicalUrl');

const source_url = 'https://opensource.org/licenses/alphabetical';
const licensesListSelector = '.field-items ul li a';
const licenseContentSelector = '#main-content';

 
const fetchLicenseContent = async (licenseUrl) => {
    const html_doc = await axios.get(licenseUrl);
    const root = await HTMLParser.parse(html_doc.data);
    const content = await root.querySelector(licenseContentSelector).text;
    console.log(`Fetched: ${licenseUrl}`);
    return content;
};

const fetchLicenseList = async function* () {
    // Fetch license list
    const html_doc = await axios.get(source_url);
    const root = await HTMLParser.parse(html_doc.data);
    const licenseList = await root.querySelectorAll(licensesListSelector);

    for (let license  of licenseList){
        const url = canonicalUrl(license.attributes.href);
        const content = await fetchLicenseContent(url);
        const nameParts = license.text.split(/\((.*)\)/); // Assumes first child is a text node
        
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