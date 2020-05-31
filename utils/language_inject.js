const fs = require('fs');
const languages_ids = require('./language_ids');

fs.readFile(`${__dirname}/../package.json`, (err, data) => {
    if (err) throw err;
    let package = JSON.parse(data);
    let snippets = package.contributes.snippets;
    
    // Add support for languages in languages_ids
    languages_ids
        .forEach(language_id => snippets.push( {language: language_id, path: '../snippets/licenses.code-snippets'} ));
    
    // Overwrite package.json
    fs.writeFileSync(`${__dirname}/../package.json`, JSON.stringify(package,null, 4));
});

