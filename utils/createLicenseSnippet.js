
const createLicenseSnippet = ({name, shortId, url, content}) => {
    let snippet = {};

    // Set snippet name to be the license's fullname
    snippet[name] = {};

    // Set snippet prefix to be the license's shortId
    snippet[name].prefix = shortId;

    // Set snippet body to be the license's content
    snippet[name].body = content;

    // Set snippet description
    snippet[name].description = `${name} \n ${url}`;

    return snippet; 
};

module.exports = createLicenseSnippet;