module.exports = {
    createChannel,
    getAllChannels,
    createMessage,
    getMessages
}

const Mam = require('@iota/mam')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
const { provider } = require('../config/options.json')
const { generateSeed } = require('./iota')
const db = require('../lib/database')

// Publish to tangle
const publish = async (data, mamState) => {
    return new Promise(async function(resolve, reject) {
        try {
            // Create MAM Payload - STRING OF TRYTES
            const trytes = asciiToTrytes(JSON.stringify(data))
            const message = Mam.create(mamState, trytes)
            // Attach the payload.
            Mam.setIOTA(provider)
            await Mam.attach(message.payload, message.address, 3, 14)
            resolve({ root: message.root, state: message.state })
        } catch (error) {
            reject(error)
        }
    })
}


function createChannel(data) {
    return new Promise(async function(resolve, reject) {
        let seed = generateSeed()

        let state_object = Mam.init(provider, seed, 2)

        state_object = Mam.changeMode(state_object, 'public')

        try {

            // publish object
            let channel = await publish(data, state_object)

            resolve(channel)
        } catch (error) {
            console.log('createMAMChannel error', error)
            reject()
        }
    })
}

async function createMessage(mam, data) {

    try {

        const mamData = await publish(data, mam.state);

        return mamData;
    } catch (error) {
        console.log('MAM append error', error);
        return null;
    }
};

function getAllChannels(body) {
    return new Promise(async function(resolve, reject) {
        const channels = db.get('channels').value()
        resolve(channels)
    })
}

function getMessages(channel_id) {
    return new Promise(async function(resolve, reject) {
        let parking = db
            .get('parking')
            .find({ id: channel_id })
            .value()

        try {
            const itemEvents = []
            function convertData(data) {
                const itemEvent = JSON.parse(trytesToAscii(data))
                itemEvents.push(itemEvent)
            }
            Mam.setIOTA(provider)

            await Mam.fetch(
                parking.mam.root,
                'public',
                parking.mam.state.channel.side_key,
                convertData
            )

            resolve(itemEvents)
        } catch (e) {
            console.error('fetchItem:', '\n', e)
            reject(e)
        }
    })
}