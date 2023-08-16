'use client'

import React, { Component } from 'react'
import {
    Grid,
    Container,
} from 'semantic-ui-react'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles';
import JsFileDownloader from 'js-file-downloader';
const ytdl = require('ytdl-core');

import { formatTime, formatNumber } from './utils';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';
import VideoCard from './components/VideoCard';
import Form from './components/Form'
import Loader from './components/Loader';

export default class Page extends Component {
    constructor() {
        // Prevent defaultProps error
        const error = console.error;
        console.error = (...args) => {
            if (/defaultProps/.test(args[0])) return;
            error(...args);
        };
        super()
    }

    state = {
        isParticleLoading: true,
        videoUrl: '',
        videoUrlError: false,
        isSearching: false,
        videoInfo: null,
        errorMessage: null,
        downloadingPercentage: null,
        isVisible: false
    }

    componentDidMount() {
        this.timeout = setTimeout(() => {
            this.setState({ isVisible: true });
        }, 500);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    particlesInit = async engine => await loadFull(engine)

    particlesLoaded = () => this.setState({ isParticleLoading: false })

    stripYoutubeId = url => {
        url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
    }

    validateYoutubeUrlId = () => {
        if (!this.state.videoUrl) {
            this.setState({ videoUrlError: true })
            return false;
        }
        let videoId = this.stripYoutubeId(this.state.videoUrl)

        if (!ytdl.validateID(videoId)) {
            this.setState({ videoUrlError: true })
            return false;
        }
        this.setState({ videoUrlError: false })
        return true;
    }

    onChangeInput = value => {
        this.setState({ videoUrl: value }, () => {
            if (this.state.videoUrlError)
                this.validateYoutubeUrlId()
        })
    }

    onSearch = async () => {
        let videoUrlIdValid = this.validateYoutubeUrlId();
        if (!videoUrlIdValid) {
            return
        }

        let videoId = this.stripYoutubeId(this.state.videoUrl)
        this.setState({ isSearching: true, errorMessage: null })
        await fetch('/api/getInfo', {
            method: 'POST',
            body: JSON.stringify({
                videoId
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    this.setState({
                        videoInfo: {
                            ...res.details,
                            thumbnail: res.details.thumbnail.thumbnails.length ? res.details.thumbnail.thumbnails.slice(-1)[0].url : '/not_found.jpg',
                            length: res.details.lengthSeconds ? formatTime(res.details.lengthSeconds) : null,
                            viewCount: res.details.viewCount ? formatNumber(res.details.viewCount) : null,
                            formats: res.formats.map(item => ({ ...item, isDownloading: false }))
                        }
                    })
                } else {
                    this.setState({ errorMessage: res.error, videoInfo: null })
                }
            })
            .catch(err => {
                this.setState({ errorMessage: 'Internal server errror, please, try again later.', videoInfo: null })
                console.error(err)
            })
            .finally(() => this.setState({ isSearching: false, downloadingPercentage: null }))
    }

    onDownload = async (itag, mimeType, quality, contentLength) => {
        this.setState({
            videoInfo: {
                ...this.state.videoInfo,
                formats: this.state.videoInfo.formats.map(item => ({
                    ...item,
                    isDownloading: item.itag === itag ? true : false
                }))

            },
            errorMessage: null,
            downloadingPercentage: 0
        })
        const fileName = `${quality}-${this.state.videoInfo.title}.${mimeType.includes('audio') ? 'm4a' : 'mp4'}`
        const download = new JsFileDownloader({
            url: 'api/download',
            method: 'POST',
            body: JSON.stringify({
                itag,
                videoId: this.state.videoInfo.videoId
            }),
            filename: fileName,
            contentTypeDetermination: 'full',
            autoStart: false,
            forceDesktopMode: true,
            process: event => {
                var downloadingPercentage = Math.floor(event.loaded / contentLength * 100);
                this.setState({ downloadingPercentage })
            }
        })
        download.start()
            .then(() => {
                this.setState({ downloadingPercentage: 100 })
                setTimeout(() => this.setState({ downloadingPercentage: null }), 2000)
            })
            .catch(err => {
                if (err.request.status == 429){
                    this.setState({ errorMessage: 'Numerous downloads in a short time, please wait for 10 seconds and then try again.' })    
                } else {
                    this.setState({ errorMessage: 'Error occurred while downloading video, please, try again later.' })
                }
                this.setState({ downloadingPercentage: null })
            })
            .finally(() => {
                this.setState({
                    videoInfo: {
                        ...this.state.videoInfo,
                        formats: this.state.videoInfo.formats.map(item => ({
                            ...item,
                            isDownloading: false
                        }))
                    }
                })
            })
    }

    render() {
        return (
            <>
                <Particles id='tsparticles' init={this.particlesInit} loaded={this.particlesLoaded}
                    url='/particles.json' />
                {this.state.isParticleLoading ?
                    <Loader /> :
                    <Container style={{
                        opacity: this.state.isVisible ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out',
                    }}>
                        <Grid verticalAlign='middle' textAlign='center' stackable>
                            <Form isSearching={this.state.isSearching} videoUrlError={this.state.videoUrlError}
                                onChangeInput={this.onChangeInput} onSearch={this.onSearch} />
                            <ErrorMessage errorMessage={this.state.errorMessage} active={Boolean(this.state.errorMessage)} />
                            <VideoCard videoInfo={this.state.videoInfo} active={Boolean(this.state.videoInfo)} downloadingPercentage={this.state.downloadingPercentage}
                                onDownload={this.onDownload} />
                            <Footer />
                        </Grid>
                    </Container>}
            </>
        )
    }
}