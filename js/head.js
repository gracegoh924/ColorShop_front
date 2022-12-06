async function loadHeader(user_id){
    const user = await getProfile(user_id)

    const dropdownProfileImage = document.getElementById("dropdown_profile_image")
    dropdownProfileImage.setAttribute("src", `${backend_base_url}${user.profile_img}`)
    
    const dropdownUsername = document.getElementById("username")
    dropdownUsername.innerText = user.username

    console.log(user_id)
    const profile = document.getElementById("profile")
    profile.setAttribute("id", `${user_id}`)
    profile.setAttribute("onclick", "profileButton(this.id)")

    const userinfo = document.getElementById("user_info")
    userinfo.setAttribute("id", `${user_id}`)
    userinfo.setAttribute("onclick", "userinfoButton(this.id)")
}

function profileButton(user_id){
    const url = `${frontend_base_url}/html/profile.html?id=${user_id}`
    location.href=url
}

function userinfoButton(user_id){
    const url = `${frontend_base_url}/html/user_info.html?id=${user_id}`
    location.href=url
}

loadHeader(user_id)