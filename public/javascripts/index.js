
async function previewUrl(){
    const url = document.getElementById("urlInput").value;
    try {
        const preview = await fetch(`api/v1/urls/preview?url=${url}`);
        displayPreviews(await preview.text());
    } catch (error) {
        displayPreviews(error);
    }
}

/**
 * @param {string} previewHTML
 */
function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
