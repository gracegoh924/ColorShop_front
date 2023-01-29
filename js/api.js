const backend_base_url = 'http://127.0.0.1:8000'
const frontend_base_url = 'https://auto-color.shop/html/'

async function handleLogin() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const response = await fetch(`${backend_base_url}/users/api/token/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })

    if (response.status == 200) {
        const response_json = await response.json()
        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem("payload", jsonPayload);
        location.replace("/html/community.html")
    }else{
        alert('아이디 혹은 비밀번호를 잘못입력했습니다')
    }
}

async function handleRelogin() {
    const response_access = await fetch(`${backend_base_url}/users/api/token/refresh/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "refresh": localStorage.getItem("refresh"),
        })
    })
    
    if (response_access.status == 200) {
        const response_access_json = await response_access.json()
        localStorage.setItem("access", response_access_json.access);
    
        const base64Url = response_access_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        localStorage.setItem("payload", jsonPayload);
        location.reload()
        getName()
    }else{
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        localStorage.removeItem("payload")
        return;
    }
}

async function getName() {
    const response = await fetch(`${backend_base_url}/users/mock/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access"),
        },
        method:'GET'
    })

    if (response.status == 200) {
        const payload = localStorage.getItem("payload");
        const payload_parse = JSON.parse(payload)
        return payload_parse.user_id
    } else if (localStorage.getItem("refresh")){
        handleRelogin()
    }
    else {
        return;
    }
}

async function getUsername() {
    const response = await fetch(`${backend_base_url}/users/mock/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access"),
        },
    })

    if (response.status == 200) {
        const payload = localStorage.getItem("payload");
        const payload_parse = JSON.parse(payload)
        return payload_parse.username
    } else {
        return null
    }
}

function logout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    window.location.replace(`${frontend_base_url}home.html`)
    alert('로그아웃 하셨습니다')
}

async function getProfile(profile_user_id){
    const response = await fetch(`${backend_base_url}/users/${profile_user_id}/`, {
        method: 'GET',
    })
    response_json = await response.json()
    return response_json
}

async function putPassword(userinfo_user_id, newPassword, newPassword2){
    const changePasswordData = {
        "password":newPassword,
        "repassword":newPassword2
    }

    const response = await fetch(`${backend_base_url}/users/changepassword/${userinfo_user_id}/`,{
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access"),
            'content-type':'application/json'
        },
        method:'PUT',
        body:JSON.stringify(changePasswordData)
    })

    response_json = await response.json()
    if(response.status == 201){
        alert('비밀번호를 변경했습니다')
        window.location.replace(`/html/user_info.html?id=${userinfo_user_id}`)
        return response_json
    }else if(response.status == 400){
        if(response_json.password && response_json.password.length > 0){
            alert(response_json.password[0])
        }else{
            alert(response_json.repassword[0])
        }
    }
}

async function putUserinfoImage(userinfo_user_id, profile_img, username){
    const userinfoData = new FormData()
    userinfoData.append("profile_img", profile_img)
    userinfoData.append("username", username)
    
    const response = await fetch(`${backend_base_url}/users/${userinfo_user_id}/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access"),
        },
        method:'PUT',
        body: userinfoData
    })

    response_json = response.json()
    
    if(response.status == 200){
        alert('수정되었습니다')
        window.location.reload()
        return response_json
    }else{
        alert('권한이 없습니다')
    }
}

async function putUserinfo(userinfo_user_id, username, nickname, bio){
    const userinfoData = {
        "username":username,
        "nickname":nickname,
        "bio":bio
    }

    const response = await fetch(`${backend_base_url}/users/${userinfo_user_id}/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access"),
            'content-type':'application/json'
        },
        method:'PUT',
        body: JSON.stringify(userinfoData)
    })

    response_json = response.json()

    if(response.status == 200){
        alert('수정되었습니다')
        window.location.reload()
        return response_json
    }else{
        alert('권한이 없습니다')
    }
}

async function deleteUserinfo(userinfo_user_id){
    const response = await fetch(`${backend_base_url}/users/${userinfo_user_id}/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access"),
        },
        method:'DELETE'
    })

    if(response.status == 204){
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        localStorage.removeItem("payload")
        window.location.replace(`${frontend_base_url}home.html`)
        alert('탈되하셨습니다.')
    }else{
        alert('권한이 없습니다')
    }
}

async function getBestPosts(){
    const response = await fetch(`${backend_base_url}/posts/`, {
        method:'GET',
    })
    response_json = await response.json()
    return response_json
}

async function getProfilePosts(user_id){
    const response = await fetch(`${backend_base_url}/posts/profile/${user_id}`, {
        method:'GET',
    })
    response_json = await response.json()
    return response_json
}

async function getPosts(){
    const response = await fetch(`${backend_base_url}/posts/community/`, {
        method:'GET',
    })
    response_json = await response.json()
    return response_json
}

function postDetail(post_id){
    const url = `${frontend_base_url}post_detail.html?id=${post_id}`
    location.href=url
}

async function getPostDetail(post_id) {
    const response = await fetch(`${backend_base_url}/posts/${post_id}/`, {
        method: 'GET'
    })

    response_json = await response.json()
    return response_json
}

async function postLike() {
    const response = await fetch(`${backend_base_url}/posts/${post_id}/like/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access"),
            'content-type':'application/json'
        },
        method: 'POST',
    })
}

async function getLike() {
    const response = await fetch(`${backend_base_url}/posts/${post_id}/like/`, {
        method: 'GET'
    })
    
    response_json = await response.json()
    return response_json
}

async function getImage() {
    const response = await fetch(`${backend_base_url}/posts/image/`, {
        method: 'GET',
    })
    response_json = await response.json()
    response_json_a = response_json[response_json.length - 1];

    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)

    if(payload_parse == null){
        alert('로그인 해주세요')
    }else if(payload_parse.username == response_json_a.user){
        return response_json_a
    }else{
        const result = response_json.filter(function (r) { return r.user == payload_parse.username })
        const result_image = result[result.length -1]
        return result_image
    }
}

async function chooseModel(imagemodel_id){ 
    const response = await fetch(`${backend_base_url}/posts/choosemodel/${imagemodel_id}/`, {
        method:'GET',
    })
    model_json = await response.json()
    return model_json
}

async function postPost(title, content) {
    const getimage = await getImage();
    const response = await fetch(`${backend_base_url}/posts/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "image": getimage.id,
            "title": title,
            "content": content
        })
    })
    response_json = await response.json()

    if(response.status == 201){
        alert('글 작성을 완료했습니다')
        window.location.reload(`${frontend_base_url}/auto_paint.html`)
    }else{
        const postContent = document.getElementById('input_content')
        const postTitle = document.getElementById('input_title')
        const postImage = document.getElementById('deepimage')
        if(postContent.value == ''){
            alert('본문을 입력해주세요')
        }else if(postTitle.value == ''){
            alert('제목을 입력해주세요')
        }else if(postImage.src == ''){
            alert('변환된 이미지가 필요합니다!')
        }else{
            alert('로그인 해주세요')
        }
    }
}

async function getImageDetail(image_id) {
    const response = await fetch(`${backend_base_url}/posts/image/${image_id}/`, {
        method: 'GET'
    })
    
    response_json = await response.json()
    return response_json
}

async function putPost(post_id, image, title, content){
    const postData = new FormData()
    postData.append("image", image)
    postData.append("title", title)
    postData.append("content", content)

    const response = await fetch(`${backend_base_url}/posts/${post_id}/`, {
        headers:{
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
        },
        method:'PUT',
        body:postData
    })
    
    if(response.status == 200){
        response_json = response.json()
        alert('수정되었습니다')
        return response_json
    }else{
        alert('권한이 없습니다.')
    }
}

async function deletePost(post_id){
    const response = await fetch(`${backend_base_url}/posts/${post_id}/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access")
        },
        method:'DELETE',
    })

    if(response.status == 204){
        alert('삭제되었습니다')
        window.location.replace(`${frontend_base_url}/home.html`)
    }else{
        alert('권한이 없습니다.')
    }
}

async function getComments(post_id){
    const response = await fetch(`${backend_base_url}/posts/${post_id}/comment/`, {
        method:'GET'
    })

    response_json = response.json()
    return response_json
}

async function postComment(post_id, content){
    const response = await fetch(`${backend_base_url}/posts/${post_id}/comment/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method:'POST',
        body:JSON.stringify({"content":content})
    })
    
    if(response.status == 200){
        response_json = response.json()
        alert('댓글이 작성되었습니다')
        return response_json
    }else{
        alert('로그인해주세요')
    }
}

async function putComment(post_id, comment_id, content){
    const response = await fetch(`${backend_base_url}/posts/${post_id}/comment/${comment_id}/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method:'PUT',
        body:JSON.stringify({"content":content})
    })
    
    if(response.status == 200){
        response_json = response.json()
        alert('댓글이 수정되었습니다')
        window.location.reload()
        return response_json
    }else{
        alert('로그인해주세요')
    }
}

async function deleteComment(post_id, comment_id){
    const response = await fetch(`${backend_base_url}/posts/${post_id}/comment/${comment_id}/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access")
        },
        method:'DELETE',
    })

    if(response.status == 204){
        alert('댓글이 삭제되었습니다')
        window.location.reload()
    }
}

async function getImages(){
    const response = await fetch(`${backend_base_url}/posts/image/`, {
        method: 'GET',
    })
    response_json = await response.json()
    return response_json
}

async function deleteImage(image_id){
    const response = await fetch(`${backend_base_url}/posts/image/${image_id}/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access")
        },
        method:'DELETE',
    })

    if(response.status == 204){
        alert('이미지가 삭제되었습니다')
        window.location.reload()
    }
}

// 게시글 작성 시간
function displayedAt(createdAt) {
    const milliSeconds = Date.parse(Date()) - Date.parse(createdAt)
    const seconds = milliSeconds / 1000
    if (seconds < 60) return `방금 전`
    const minutes = seconds / 60
    if (minutes < 60) return `${Math.floor(minutes)}분 전`
    const hours = minutes / 60
    if (hours < 24) return `${Math.floor(hours)}시간 전`
    const days = hours / 24
    if (days < 7) return `${Math.floor(days)}일 전`
    const weeks = days / 7
    if (weeks < 5) return `${Math.floor(weeks)}주 전`
    const months = days / 30
    if (months < 12) return `${Math.floor(months)}개월 전`
    const years = days / 365
    return `${Math.floor(years)}년 전`
}