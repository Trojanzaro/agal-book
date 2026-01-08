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
        pushNotification("ERROR: "+JSON.stringify(e.response));
        console.error(e);
    }
    drawTeacherCallendar();
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
    } catch (e) {
        pushNotification("ERROR: "+JSON.stringify(e.response));
        console.error(e);
    }
}


///////
// EVENT: USER: CLICK SUBMIT STUDENT/TEACHER DETAILS
async function putDetails(id, collection) {

    //get form data
    const firstName = document.forms["details_form"]["inputFirstname"].value;
    const lastName = document.forms["details_form"]["inputLastname"].value;
    const email = document.forms["details_form"]["inputEmail"].value;
    const city = document.forms["details_form"]["inputCity"].value;
    const state = document.forms["details_form"]["inputState"].value;
    const address = document.forms["details_form"]["inputAddress"].value;
    const phone1 = document.forms["details_form"]["inputPhone1"].value;
    const phone2 = document.forms["details_form"]["inputPhone2"].value;
    const birthdate = document.forms["details_form"]["inputBirthdate"].value;
    const postalCode = document.forms["details_form"]["inputPostal"].value;

    
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
        const record = await pb.collection(collection).update(id, data);
        pushNotification("Succesfully Updated Entry!");

    } catch (e) {
        console.error(e);
        pushNotification("ERROR: "+JSON.stringify(e.response.data));
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
// EVENT: USER: CLICK NEW STUDENT
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
        pushNotification('Successfully created New Entry!');

    } catch (e) {
        pushNotification("ERROR: "+JSON.stringify(e.response.data));
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
    nav = nav !== null ? nav : "dashboard";
    window.localStorage.setItem('nav', nav);
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
        const age = ((new Date()).getFullYear() - new Date(element.birthdate).getFullYear())
        document.getElementById("tbodyStudents").innerHTML += `<tr>\
            <td><a href="javascript:studentDetails('${element.id}');" >${element.first_name}</a></td>\
            <td><a href="javascript:studentDetails('${element.id}');" >${element.last_name}</a></td>\
            <td>${age}</td>\
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
        const age = ((new Date()).getFullYear() - new Date(element?.birthdate).getFullYear())
        document.getElementById("tbodyTeachers").innerHTML += `<tr>\
            <td><a href="javascript:teacherDetails('${element.id}');" >${element.first_name}</a></td>\
            <td><a href="javascript:teacherDetails('${element.id}');" >${element.last_name}</a></td>\
            <td>${age}</td>\
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
    const toast_board = document.getElementById('toast-container')
    toast_board.innerHTML += `<div class="toast show" id="mytoast">
        <div class="toast-header">
        <strong class="me-auto">Message</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
        ${data}
        </div>
    </div>`
}

///////
// EVENT: LOAD TEACHER CALENDAR ON DETAILS PAGE
// TODO: REPLACE DUMMY DATA WITH ACTUAL TEACHER CALL DATA
function drawTeacherCallendar() {
  // Ensure Google Charts is loaded before drawing
  google.charts.load('current', { packages: ['calendar'] })
    .then(() => {
      const dataTable = new google.visualization.DataTable();
      dataTable.addColumn({ type: 'date', id: 'Date' });
      dataTable.addColumn({ type: 'number', id: 'Calls' });

      // Example teacher call data
      dataTable.addRows([
        [new Date(2025, 0, 3), 4],
        [new Date(2025, 0, 4), 2],
        [new Date(2025, 0, 5), 6],
        [new Date(2025, 0, 6), 1],
        [new Date(2025, 0, 7), 5]
      ]);

      const chart = new google.visualization.Calendar(
        document.getElementById('teacher_calendar')
      );

      const options = {
        title: 'Teacher Calendar',
        calendar: {
          cellSize: 15
        }
      };

      chart.draw(dataTable, options);
    });
}