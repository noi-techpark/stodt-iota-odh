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
            console.log("data", data)
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
        console.log("createChannel", data)
        let seed = generateSeed()
        
        console.log("provider", provider)
        console.log("seed", seed)

        let state_object = Mam.init(provider, seed, 2)

        state_object = Mam.changeMode(state_object, 'public')
        console.log("state_object", state_object)

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

async function createMessage(mamState, data) {

    try{
        const mamData = await publish(data, mamState.state)
    
        let channel = {
            root: mamData.root,
            state: mamState.state,
        }
    
        return channel;

    }catch(ex) {
        console.log(ex);
    }

}

// function appendChannel(
//     // channel_id,
//     data,
//     root,
//     seed,
//     next_root,
//     start,
//     side_key
// ) {
//     const mamState = {
//         subscribed: [],
//         channel: {
//             side_key: side_key,
//             mode: 'public',
//             next_root: next_root,
//             security: 2,
//             start: start,
//             count: 1,
//             next_count: 1,
//             index: 0,
//         },
//         seed: seed,
//     }

//     // console.log('mamState', mamState)

//     const promise = new Promise(async (resolve, reject) => {
//         try {
//             if (root) {
                
//                 console.log('mamState in', mamState)


//             }else
//                 return reject()
//         } catch (error) {
//             console.log('appendChannel error', error)
//             return reject()
//         }
//     })

//     return promise
// }

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

        console.log('parking', parking)

        try {
            const itemEvents = []
            function convertData(data) {
                console.log('what1', data)
                const itemEvent = JSON.parse(trytesToAscii(data))
                itemEvents.push(itemEvent)
            }
            Mam.setIOTA(provider)

            console.log('key', parking.mam.state.channel.side_key)
            let what = await Mam.fetch(
                parking.mam.root,
                'public',
                parking.mam.state.channel.side_key,
                convertData
            )
            console.log('whatwhat', what)
            console.log('what', itemEvents)

            resolve(itemEvents)
        } catch (e) {
            console.error('fetchItem:', '\n', e)
            reject(e)
        }
    })
}