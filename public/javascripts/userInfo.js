async function init() {
    await loadIdentity();
    loadUserInfo();
}

async function saveUserInfo() {
    const value = document.getElementById("userInfo").value;
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    await fetchJSON(`api/${apiVersion}/user`, {
        method: "POST",
        body: { username: username, website_url: value }
    });
    await loadUserInfo();
}

async function loadUserInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if (username == myIdentity) {
        document.getElementById("username-span").innerText = `You (${username})`;
        document.getElementById("user_info_new_div").classList.remove("d-none");

    } else {
        document.getElementById("username-span").innerText = username;
        document.getElementById("user_info_new_div").classList.add("d-none");
    }

    const response = await fetchJSON(`api/${apiVersion}/user?user=${username}`, {
        method: "GET"
    });
    console.log(response)
    document.getElementById("user_info_div").innerText = response.website_url;

    loadUserInfoPosts(username);
}


async function loadUserInfoPosts(username) {
    document.getElementById("posts_box").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/posts?username=${encodeURIComponent(username)}`);
    let postsHtml = postsJson.map(postInfo => {
        return `
        <div class="post">
            ${escapeHTML(postInfo.description)}
            ${postInfo.htmlPreview}
            <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.username)}</a>, ${escapeHTML(postInfo.created_date)}</div>
            <div class="post-interactions">
                <div>
                    <span title="${postInfo.likes ? escapeHTML(postInfo.likes.join(", ")) : ""}"> ${postInfo.likes ? `${postInfo.likes.length}` : 0} likes </span> &nbsp; &nbsp; 
                </div>
                <br>
                <div><button onclick='deletePost("${postInfo.id}")' class="${postInfo.username == myIdentity ? "" : "d-none"}">Delete</button></div>
            </div>
        </div>`;
    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;
}


async function deletePost(postID) {
    let responseJson = await fetchJSON(`api/${apiVersion}/posts`, {
        method: "DELETE",
        body: { postID: postID }
    });
    loadUserInfo();
}