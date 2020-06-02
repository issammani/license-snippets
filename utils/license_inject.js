/** Scrape licenses from:
 * https://opensource.org/licenses/alphabetical 
 **/

const fs = require('fs');

const fetchLicenseList = require('./fetchLicense');
const createLicenseSnippet = require('./createLicenseSnippet');


const snippets = fs.WriteStream('snippets/licenses.code-snippets', {flags: 'w'});
let firstIter = true;

(async () => {
    console.log('Started');

    // Start JSON Object
    snippets.write('{');

    for await (const license of fetchLicenseList()) {
        let licenseSnippet = createLicenseSnippet(license);
        let snippetName = `,"${license.name}":`;
        
        if(firstIter){
            snippetName = snippetName.substr(1);
            firstIter = false;
        }

        snippets.write(snippetName);
        snippets.write(JSON.stringify(licenseSnippet[license.name]));
    }

    // Terminate JSON Object
    snippets.write('}');
    console.log('All done.');
})();
