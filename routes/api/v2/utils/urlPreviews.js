import { parse } from "node-html-parser";

/**
 * 
 * @param { string } url 
 * @returns an HTML string with the preview of the URL
 */
async function getURLPreview(url) {
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
    
        return`    
            <div class="card">
                <a href="${ogTag['og:url']}">
                    <p><strong>${ogTag['og:title']}</strong></p>
                    ${ogTag['og:image'] !== '' ? `<img src="${ogTag['og:image']}" style="max-height: 200px; max-width: 270px;"/>` : ''}
                </a>
                ${ogTag['og:type'] !== undefined ? `<p><strong>Type:</strong> ${ogTag['og:type']}</p>` : ''}
                ${ogTag['og:site_name'] !== undefined ? `<p><strong>Site:</strong> ${ogTag['og:site_name']}</p>` : ''}
                ${ogTag['og:description'] !== '' ? `<p>${ogTag['og:description']}</p>` : ''}
            </div>`
        ;
}

export default getURLPreview;