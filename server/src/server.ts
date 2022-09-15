import express, { response } from 'express'
import { PrismaClient } from '@prisma/client'
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes'
import { convertMinutesToHourString } from './utils/convert-minutes-to-hour-string'
import cors from 'cors';
// ECMAscript modules

const app = express()

app.use(express.json())
app.use(cors())

const prisma = new PrismaClient({
    log: ['query']
})

// localhost:3333/ads

// HTTP methods / API RESTful 

//HTTP Codes
// começando por 2 são de sucesso
// começando por 3 redirecionamento
// começando por 4 cod bugados, erros de app
// começando por 5 erros inesperados
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    })

    return response.json([games]);
})

app.post('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;
    const body = request.body;


    const ad = await prisma.ad.create({
        data: {
            gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHourStringToMinutes(body.hourStart),
            hourEnd: convertHourStringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel
        }
    })

    return response.status(201).json(ad);
})

/* Query: localhost:4444/ads?page=2&sort=title
   Route: localhost:4444/ads/5 ou localhost:4444/post/como-criar-um-site
   Body: fora da url e mais seguro para senhas e forms 
*/

app.get('/games/:id/ads', async (request, response)=> {
    const gameId = request.params.id;
    
    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true
        },
        
        where: {
            gameId: gameId,
        },

        orderBy: {
            createdAt: 'desc',
        }
    })

    return response.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesToHourString(ad.hourStart),
            hourEnd: convertMinutesToHourString(ad.hourEnd),
        }
    }))
})

app.get('/ads/:id/discord', async ( request, response ) => {
    const adId = request.params.id;
    
    const ad = await prisma.ad.findUniqueOrThrow({

        select: {
            discord: true,
        },
        where: {
            id: adId,
        }

    })

    return response.json({
        discord: ad.discord,
    })
})

app.listen(3333)