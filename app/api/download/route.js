import { NextResponse } from "next/server";
const ytdl = require('ytdl-core');

export const POST = async req => {
    const jsonBody = await req.json()
    const { videoId, itag } = jsonBody

    if (!videoId || !itag) {
        return NextResponse.json({
            success: false,
            error: 'Provide videoId and itag parameters.'
        }, {
            status: 400
        })
    }

    if (!ytdl.validateID(videoId)) {
        return NextResponse.json({
            success: false,
            error: 'Invalid videoId parameter.'
        }, {
            status: 400
        })
    }

    
    const {videoName, itagExists} = await ytdl.getBasicInfo(`https://www.youtube.com/watch?v=${videoId}`)
        .then(info => ({
            videoName: info.player_response.videoDetails.title,
            itagExists: info.formats.filter(item => item.itag == itag)
        }))
    
    if (!itagExists){
        return NextResponse.json({
            success: false,
            error: 'Invalid quality/format selected.'
        }, {
            status: 400
        })
    }

    var responseHeaders = new Headers();
    responseHeaders.set(
        "Content-Disposition",
        `attachment; filename="${videoName}.${itagExists[0].mimeType.includes('audio') ? 'm4a' : 'mp4'}"`,
    );

    responseHeaders.set(
        "User-Agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    );

    let contentLength = 0;
    const data = ytdl(videoId, {
        quality: itag,
        filter: format => format.audioTrack ? format.audioTrack.audioIsDefault : format
    })
    
    responseHeaders.set(
        "Total-Bytes",
        `${contentLength}`
    )

    return new Response(data, {
        headers: responseHeaders,
    });
}