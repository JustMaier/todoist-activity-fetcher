require('dotenv').config()
const fs = require('fs')
const got = require('got')

const todoist = got.extend({
    prefixUrl: 'https://api.todoist.com/sync/v8',
    responseType: 'json',
    method: 'POST',
    handlers: [(options, next) => {
        options.form.token = process.env.TOKEN
        return next(options)
    }]
})

const since = process.env.SINCE ? new Date(process.env.SINCE) : null
const emptyPageLimit = process.env.EMPTY_PAGE_LIMIT || 3
const object_event_types = process.env.OBJECT_EVENT_TYPES || '[]'
async function* getActivities(){
    let page = 0, emptyPageCount = 0, sinceMatch = false
    while (emptyPageCount < emptyPageLimit && !sinceMatch) {
        console.log(`page: ${page}`)
        
        let limit = 100, offset = 0, remaining = null
        while (remaining == null || remaining > 0) {
            console.log(`offset: ${offset}, remaining: ${remaining}`)
            
            let { body: {count, events}} = await todoist('activity/get', {
                form: { limit, offset, object_event_types, page }
            })

            if (count === 0) emptyPageCount++
            else {
                yield events
                
                if (since != null) {
                    const lastDate = new Date(events[events.length - 1].event_date)
                    console.log(`lastDate: ${lastDate}`)
                    sinceMatch = lastDate < since
                }
            }
            
            remaining = count - (offset + limit)
            offset += limit
        }

        page++
    }
}

(async () => {
    // Prepare output
    const outputDest = process.env.OUTPUT_DEST || './output.json'
    const stream = fs.createWriteStream(outputDest)
    stream.write('[')
    let sep = ''
    for await (let events of getActivities()) {
        const arrayJson = JSON.stringify(events)
        const arrayContent = arrayJson.substring(1, arrayJson.length - 1)
        stream.write(sep + arrayContent)
        if (sep == '') sep = ','
    }
    stream.end(']')
})()