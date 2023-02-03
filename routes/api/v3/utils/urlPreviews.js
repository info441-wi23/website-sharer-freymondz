import { parse } from "node-html-parser";

/**
 * 
 * @param { string } url 
 * @returns an HTML string with the preview of the URL
 */
async function getURLPreview(url) {
    console.log(url);
    const request = await fetch(url);
    const html = await request.text();
    const root = parse(html);
    const meta = root.querySelectorAll('meta[property^="og:"]');

    const ogTag = {
        'og:url': url,
        'og:title': root.querySelector('title')?.text ?? url,
        'og:image': '',
        'og:description': '',
    };
    for (const element of meta) {
        const attributes = element.rawAttributes;
        ogTag[attributes.property] = attributes.content;
    }
    
    const escapeHTML = str => String(str).replace(/[&<>'"]/g, 
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));

    return `    
        <div class="card">
            <a href="${escapeHTML(ogTag['og:url'])}">
                <p><strong>${escapeHTML(ogTag['og:title'])}</strong></p>
                ${ogTag['og:image'] !== '' ? `<img src="${escapeHTML(ogTag['og:image'])}" style="max-height: 200px; max-width: 270px;"/>` : ''}
            </a>
            ${ogTag['og:type'] !== undefined ? `<p><strong>Type:</strong> ${escapeHTML(ogTag['og:type'])}</p>` : ''}
            ${ogTag['og:site_name'] !== undefined ? `<p><strong>Site:</strong> ${escapeHTML(ogTag['og:site_name'])}</p>` : ''}
            ${ogTag['og:description'] !== '' ? `<p>${escapeHTML(ogTag['og:description'])}</p>` : ''}
        </div>`
        ;
}

export default getURLPreview;