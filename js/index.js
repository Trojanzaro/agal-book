///////
// EVENT: USER: CLICK LOGIN
async function loginButton(_t) {

    //get form data
    const username = document.forms["login_form"]["email"].value
    const password = document.forms["login_form"]["password"].value

    // try to loging for error return an error message
    try {
        const authData = await pb.collection('users').authWithPassword(
            username,
            password,
        ); login();
    } catch (e) {
        console.error(e);
        var myAlert = document.getElementById('login_alert')
        myAlert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">\
                        <strong>Error!</strong> '+ e.toString() + '.\
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\
                      </div>'
    }
}

///////
// EVENT: CTRL: LOGOUT
async function logout() {
    await pb.authStore.clear();
    window.location.reload();
}

///////
// EVENT: CTRL: LOGIN
async function login() {
    // SUCCESS: SET BODY HX-HEADERS
    document.getElementById("body_ID").setAttribute("hx-headers", getAuthHeader());

    // SUCCESS: CLEAR LOGIN FORM
    document.getElementById("UI_HTMX").innerHTML = '';

    // Succesfully logged in! send token to header requests
    document.getElementById("btn_logout").hidden = false; // MAKE THE LOGOUT BUTTON VISILE
    htmx.trigger("#UI_MAIN_HTMX", "loginAccept");
}

// UTIL
function getAuthHeader() {
    const headers = {Authorization:pb.authStore.token.trim()}
    return JSON.stringify(headers)
}