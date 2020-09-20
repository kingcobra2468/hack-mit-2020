const fs = require('fs');

module.exports.word_generator = function word_generator (num_words, file) {
    
    let selected_words = []
    let words = fs.readFileSync(file, 'utf8').split('\n');

    for (let i = 0; i < num_words; i++) {
        selected_words.push(words[Math.floor(Math.random() * words.length)])
    }

    return selected_words
}