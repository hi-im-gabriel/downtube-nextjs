export const formatTime = seconds => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    return [
        h,
        m > 9 ? m : (h ? '0' + m : m || '0'),
        s > 9 ? s : '0' + s
    ].filter(Boolean).join(':');
}

export const formatMimeType = mimeType => {
    return mimeType.split(';')[0]
}

export const formatNumber = input => {
    const ranges = [{
        divider: 1E3,
        suffix: 'K'
    }, {
        divider: 1E6,
        suffix: 'M'
    }, {
        divider: 1E9,
        suffix: 'B'
    }];
    for (let index = ranges.length - 1; index >= 0; index--) {
        if (input > ranges[index].divider) {
            let quotient = input / ranges[index].divider;

            if (quotient < 10) {
                quotient = Math.floor(quotient * 10) / 10;
            } else {
                quotient = Math.floor(quotient);
            }

            return quotient.toString() + ranges[index].suffix;
        }
    }

    return input.toString();
}

export const formatFileSize = (a, b, c, d, e) => {
    return (b = Math, c = b.log, d = 1e3, e = c(a) / c(d) | 0, a / b.pow(d, e)).toFixed(2)
        + ' ' + (e ? 'kMGTPEZY'[--e] + 'B' : 'Bytes')
}