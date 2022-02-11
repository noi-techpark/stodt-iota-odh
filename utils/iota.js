function generateSeed() {
    const randomstring = require('randomstring')

    const length = 81
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9'

    return randomstring.generate({
        length: length,
        charset: charset,
    })
}

module.exports = { generateSeed }