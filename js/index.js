///////
// EVENT: USER: CLICK TEACHER DETAILS
async function teacherDetails(teacherId) {

    // try to loging for error return an error message
    try {
        const mainDashboard = document.getElementById("main-dashboard");
        mainDashboard.innerHTML='';
        const teacherHTML = await httpPromise('GET', 'http://localhost:8090/_dist/teacher/details?id='+teacherId, null);
        mainDashboard.innerHTML = teacherHTML;

    } catch (e) {
        pushNotification(e);
        console.error(e);
    }
}

///////
// EVENT: USER: CLICK STUDENT DETAILS
async function studentDetails(studentId) {

    // try to loging for error return an error message
    try {
        const mainDashboard = document.getElementById("main-dashboard");
        mainDashboard.innerHTML='';
        const studentHTML = await httpPromise('GET', 'http://localhost:8090/_dist/student/details?id='+studentId, null);
        mainDashboard.innerHTML = studentHTML;
        console.log(studentHTML);
    } catch (e) {
        pushNotification(e);
        console.error(e);
    }
}

///////
// EVENT: USER: CLICK LOGIN
async function loginButton(_t) {

    //get form data
    const username = document.forms["login_form"]["email"].value;
    const password = document.forms["login_form"]["password"].value;

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
// EVENT: USER: CLICK NEW USER
async function createNewStudent() {

    //get form data
    const firstName = document.forms["new_student_form"]["firstName"].value;
    const lastName = document.forms["new_student_form"]["lastName"].value;
    const email = document.forms["new_student_form"]["email"].value;
    const city = document.forms["new_student_form"]["city"].value;
    const state = document.forms["new_student_form"]["state"].value;
    const address = document.forms["new_student_form"]["address"].value;
    const phone1 = document.forms["new_student_form"]["phone1"].value;
    const phone2 = document.forms["new_student_form"]["phone2"].value;
    const birthdate = document.forms["new_student_form"]["birthdate"].value;
    const postalCode = document.forms["new_student_form"]["postalCode"].value;

    
    // try to loging for error return an error message
    try {
        // example create data
        const data = {
            "first_name": firstName,
            "last_name": lastName,
            "birthdate": birthdate,
            "phone_number": phone1,
            "email": email,
            "phone_number_2": phone2,
            "postal_code": postalCode,
            "address": address,
            "city": city,
            "state": state
        };
        const record = await pb.collection('student').create(data);
        console.log(record);

        pushNotification(record);

    } catch (e) {
        pushNotification(e);
        console.error(e);
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
    document.getElementById("UI_MAIN").innerHTML = '';

    // Succesfully logged in! send token to header requests and navigate to where the nav variable says
    let nav = window.localStorage.getItem('nav');
    nav = nav !== undefined ? nav : "dashboard";
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
            <td><a href="javascript:studentDetails('${element.id}');" >${element.first_name}</a></td>\
            <td><a href="javascript:studentDetails('${element.id}');" >${element.last_name}</a></td>\
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
            <td><a href="javascript:teacherDetails('${element.id}');" >${element.first_name}</a></td>\
            <td><a href="javascript:teacherDetails('${element.id}');" >${element.last_name}</a></td>\
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

function httpPromise(method, url, data) {
    return new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            console.log(this.onerror);
            if(this.status > 299) {
                reject(this.response);
            } else {
                resolve(this.response);
            }
        }
        xhttp.open(method, url, false);
        xhttp.setRequestHeader("Authorization", pb.authStore.token.trim());
        xhttp.send(JSON.stringify(data));
    });
}

function pushNotification(data) {
    console.log('pushing')
    const toast_board = document.getElementById("toast_board")
    toast_board.innerHTML += `<div role="alert" aria-live="assertive" aria-atomic="true" class="toast" data-bs-autohide="false">
        <div class="toast-header">
        <strong class="me-auto">Message</strong>
        <small>11 mins ago</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
        ${data}
        </div>
    </div>`
    $('.toast').show();
}