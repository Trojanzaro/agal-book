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
    console.log("entering!")
    // SUCCESS: SET BODY HX-HEADERS
    document.getElementById("body_ID").setAttribute("hx-headers", getAuthHeader());

    // SUCCESS: CLEAR LOGIN FORM
    document.getElementById("UI_MAIN").innerHTML = '';

    // Succesfully logged in! send token to header requests
    htmx.trigger("#UI_MAIN_HTMX", "loginAccept");
}

///////
// EVENT: CTRL: LOAD ALL STUDENTS
async function loadAllStudents() {
    // you can also fetch all records at once via getFullList
    const records = await pb.collection('student').getFullList({
        sort: '-created',
    });

    records.forEach(element => {
        document.getElementById("tbodyStudents").innerHTML += `<tr>\
            <td>${element.first_name}</td>\
            <td>${element.last_name}</td>\
            <td>${element.birthdate}</td>\
            <td>${element.phone_number}</td>\
        </tr>`
    });

    $(document).ready(function() {
        var table = $('#dataTable').DataTable( {
            lengthChange: true,
            buttons: [ 'copy', 'excel', 'pdf', 'colvis' ]
        } );
    } );
    
}

///////
// EVENT: CTRL: LOAD ALL TEACHERS
async function loadAllTeachers() {
    // you can also fetch all records at once via getFullList
    const records = await pb.collection('teacher').getFullList({
        sort: '-created',
    });

    records.forEach(element => {
        document.getElementById("tbodyTeachers").innerHTML += `<tr>\
            <td>${element.first_name}</td>\
            <td>${element.last_name}</td>\
            <td>${element.birthdate}</td>\
            <td>${element.phone_number}</td>\
        </tr>`
    });

    $(document).ready(function() {
        var table = $('#dataTable').DataTable( {
            lengthChange: true,
            buttons: [ 'copy', 'excel', 'pdf', 'colvis' ]
        } );
    } );
}

// UTIL
function getAuthHeader() {
    const headers = {Authorization:pb.authStore.token.trim()}
    return JSON.stringify(headers)
}