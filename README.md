<h1 align="center">Downtube NextJS</h1>
<p align="center">
    <a href="https://github.com/gabzin/django-ytdownloader/blob/main/LICENSE">
        <img src="https://img.shields.io/badge/License-MIT-red.svg?labelColor=white" />
    </a>
    <a href="https://vercel.com/">
        <img src="https://img.shields.io/badge/Vercel-Deployed-green?logo=vercel&logoColor=black&labelColor=white" />
    </a>
    <a href="https://www.cloudflare.com/">
        <img src="https://img.shields.io/badge/Cloudflare-Proxied-green?logo=cloudflare&logoColor=yellow&labelColor=white" />
    </a>
    <a href="https://react.dev/">
        <img src="https://img.shields.io/badge/React-Built-teal?logo=react&logoColor=teal&labelColor=white" />
    </a>
    <a href="https://nextjs.org/">
        <img src="https://img.shields.io/badge/React-Built-blue?logo=next.js&logoColor=black&labelColor=white" />
    </a>            
    <p align="center">⭐️ Star this project ⭐️</p>
    <a href="https://downtube.vercel.app/"><p align="center">https://downtube.gabrieltavares.dev/</p></a>
</p>


<img src="https://i.imgur.com/1DIr42a.png" width="700" title="Search">
<img src="https://i.imgur.com/qXGQ5Fj.png" width="700" title="File sizes">
<img src="https://i.imgur.com/6jDx1Eh.png" width="700" title="Description">
<img src="https://i.imgur.com/2Q7GUig.png" width="700" title="Progress bar">

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Current features
- ✅ Search from any youtube URL
- ✅ Get channel and video info
- ✅ File sizes before downloading
- ✅ Video description with tags
- ✅ Up to three download options (720p, 360p and Audio only)
- ✅ Progress bar while downloading
- ✅ Allow short URLs
- ⬜ Option to download higher res. (using ffmpeg to merge video and audio)
- ⬜ Option to choose audio language (for dubbed videos)
- ⬜ Option to cancel download (Button near progress bar)

## Getting Started

First of all, install dependencies:

```bash
yarn
# or
npm install
```

Then, run development server:

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

** For production:
* Change the `allowedHostInProduction` const inside `middleware.js` file for your domain, or remove the file if you won't need.
* Change the value of `Access-Control-Allow-Origin` key inside `next.config.js` file for your domain.
## Contact
[hello@gabrieltavares.dev](mailto:hello@gabrieltavares.dev)