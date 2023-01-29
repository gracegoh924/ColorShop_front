const backend_base_url = 'http://127.0.0.1:8000'
const frontend_base_url = 'https://auto-color.shop/html/'

const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const fistForm = document.getElementById("form1");
const secondForm = document.getElementById("form2");
const container = document.querySelector(".container");

signInBtn.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

fistForm.addEventListener("submit", (e) => e.preventDefault());
secondForm.addEventListener("submit", (e) => e.preventDefault());
window.onload = () => {
    container.classList.remove("right-panel-active");
}

async function handleSignup() {
    const username = document.getElementById("signup_username").value
    const password = document.getElementById("signup_password").value
    const password_check = document.getElementById("signup_password_check").value
    const nickname = document.getElementById("nickname").value
    const sign_up_Alert = document.getElementById("sign_up_Alert")

    const response = await fetch(`${backend_base_url}/users/`, {
        headers: {
            'content-type' : 'application/json',
        },
        method: 'POST',
        body: JSON.stringify( {
            "username": username,
            "password": password,
            "password_check": password_check,
            "nickname":nickname
        })
    })

    const Response = await response.json()

    if (response.status === 201){
        alert("회원가입 성공!");
        container.classList.remove("right-panel-active");
    }
    else if(response.status === 400){
    if ("username" in Response){
        sign_up_Alert.innerText = Response.username[0]
    }
    else if ("password" in Response){
        sign_up_Alert.innerText = Response.password[0]
    }
    else if ("password_check" in Response){
        sign_up_Alert.innerText = Response.password_check[0]
    }
    else if ("nickname" in Response){
        sign_up_Alert.innerText = Response.nickname[0]
    }
    }
  }

  async function handleLogin(){
    const Username = document.getElementById("Username").value
    const password = document.getElementById("password").value
    const Alert = document.getElementById("alert")
    const response = await fetch(`${backend_base_url}/users/api/token/`,{
        headers : {
            'content-type' : 'application/json',
        },
        method : 'POST',
        body : JSON.stringify({
            "username":Username,
            "password":password
        })
    })

    const response_json = await response.json()
    localStorage.setItem("access", response_json.access);
    localStorage.setItem("refresh", response_json.refresh);

    if (response.status === 200){
        alert("로그인이 완료되었습니다!");
        location.href="home.html"
    }        
    else{
        Alert.innerText = "유저이름 또는 비밀번호를 확인해주세요"
        return false
    }
    const base64Url = response_json.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c){
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    localStorage.setItem("payload", jsonPayload);
  }

  function home(){
    const url = `${frontend_base_url}home.html`
    location.href=url
}
