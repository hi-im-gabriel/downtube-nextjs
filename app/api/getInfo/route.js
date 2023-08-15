import { NextResponse } from "next/server";
const ytdl = require('ytdl-core');
const url = require('url');

export const POST = async req => {
    const jsonBody = await req.json()
    const videoId = jsonBody.videoId

    if (!videoId) {
        return NextResponse.json({
            success: false,
            error: 'Provide videoId parameter.'
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

    const qualityOrder = {
        "2160p": 0,
        "1440p": 1,
        "1080p": 2,
        "720p": 3,
        "480p": 4,
        "360p": 5,
        "240p": 6,
        "144p": 7,
    };

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const { data, status_code } = await ytdl.getInfo(videoUrl, {})
        .catch(err => console.log(`Err ${err}`))
        .then(async info => {
            const formatData = await Promise.all(info.formats.sort((a, b) => {
                const qualityA = qualityOrder[a.qualityLabel] !== undefined ? qualityOrder[a.qualityLabel] : 8; // Assign a higher order for audio
                const qualityB = qualityOrder[b.qualityLabel] !== undefined ? qualityOrder[b.qualityLabel] : 8; // Assign a higher order for audio

                if (qualityA !== qualityB) {
                    return qualityA - qualityB;
                }

                return a.mimeType.localeCompare(b.mimeType);
            })
                .filter(value => (value.qualityLabel && value.audioQuality) || (value.audioQuality && !value.qualityLabel && value.mimeType.includes('mp4')))
                .map(async value => {
                    if (!value.contentLength) {
                        var parsed = url.parse(value.url);
                        parsed.method = 'HEAD';
                        const res = await fetch(value.url);
                        return {
                            ...value,
                            contentLength: res.headers.get('content-length')
                        };
                    }
                    return value;
            }))

            if (info.player_response.videoDetails.isPrivate) {
                return {
                    data: {
                        success: false,
                        error: "Can't download private content."
                    },
                    status_code: 400
                }
            }
            if (info.player_response.videoDetails.isLiveContent) {
                return {
                    data: {
                        success: false,
                        error: "Can't download live content."
                    },
                    status_code: 400
                }
            }

            return {
                data: {
                    success: true,
                    details: {
                        ...info.player_response.videoDetails,
                        ...info.videoDetails
                    },
                    formats: formatData
                }, status_code: 200
            }
        })

    return NextResponse.json(data, {
        status: status_code
    })
}