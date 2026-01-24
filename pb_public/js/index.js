///////
// EVENT: USER: CLICK TEACHER DETAILS
async function teacherDetails(teacherId) {

    // try to loging for error return an error message
    try {
        const mainDashboard = document.getElementById("main-dashboard");
        mainDashboard.innerHTML = '';
        const teacherHTML = await httpPromise('GET', 'http://192.168.191.216:8090/_dist/teacher/details?id=' + teacherId, null);
        mainDashboard.innerHTML = teacherHTML;

    } catch (e) {
        pushNotification("ERROR: " + JSON.stringify(e.response));
        console.error(e);
    }
    const scheduleData = document.getElementById("schedule").value; 
    const schedule = JSON.parse(scheduleData);
    drawTeacherCallendar(schedule, 2026);
}

///////
// EVENT: USER: CLICK STUDENT DETAILS
async function studentDetails(studentId) {

    // try to loging for error return an error message
    try {
        const mainDashboard = document.getElementById("main-dashboard");
        mainDashboard.innerHTML = '';
        const studentHTML = await httpPromise('GET', 'http://192.168.191.216:8090/_dist/student/details?id=' + studentId, null);
        mainDashboard.innerHTML = studentHTML;
    } catch (e) {
        pushNotification("ERROR: " + JSON.stringify(e.response));
        console.error(e);
    }
}

///////
// EVENT: USER: CLICK CLASSROOM DETAILS
async function classroomDetails(classroomId) {

    // try to loging for error return an error message
    try {
        const mainDashboard = document.getElementById("main-dashboard");
        mainDashboard.innerHTML = '';
        const classroomHTML = await httpPromise('GET', 'http://192.168.191.216:8090/_dist/classroom/details?id=' + classroomId, null);
        mainDashboard.innerHTML = classroomHTML;
    } catch (e) {
        pushNotification("ERROR: " + JSON.stringify(e.response));
        console.error(e);
    }
}

///////
// EVENT: USER: CLICK CUSTOMER DETAILS
async function customerDetails(customerId) {

    // reset all data placeholders
    document.getElementById("paymentTable").innerHTML = '';
    document.getElementById("tbodyStudents").innerHTML = '';
    document.getElementById("paymentProgress").style.width = '0%';
    document.getElementById("totalFee").innerText = '€0.00';
    document.getElementById("paidAmount").innerText = '€0.00';
    document.getElementById("unpaidAmount").innerText = '€0.00';
    document.getElementById("card_studnet_name").innerText = '';
    document.getElementById("card_classroom_name").innerText = '';

    // get customer/parent payment details
    const customer = await pb.collection('customer').getOne(customerId);

    // get customer related students
    const relatedStudents = await pb.collection('student').getFullList({
        filter: `parent_1 = "${customerId}" || parent_2 = "${customerId}"`,
        sort: '-created',
    });

    document.getElementById("tbodyStudents").innerHTML = '';
    relatedStudents.forEach(student => {
        const age = ((new Date()).getFullYear() - new Date(student.birthdate).getFullYear())
        document.getElementById("tbodyStudents").innerHTML += `<tr>\
            <td><a href="javascript:studentFees('${student.id}','${customerId}','${customer.first_name}','${student.first_name + ' ' + student.last_name}');" >${student.first_name}</a></td>\
            <td><a href="javascript:studentFees('${student.id}','${customerId}','${customer.first_name}','${student.first_name + ' ' + student.last_name}');" >${student.last_name}</a></td>\
            <td>${age}</td>\
            <td>${student.phone_number}</td>\
        </tr>`
    });


}

///////
// EVENT: USER: CLICK CUSTOMER -> STUDENT DETAILS
async function studentFees(studentId, customerId, customerName, studentName) {

    // reset all data placeholders
    document.getElementById("paymentTable").innerHTML = '';
    document.getElementById("paymentProgress").style.width = '0%';
    document.getElementById("totalFee").innerText = '€0.00';
    document.getElementById("paidAmount").innerText = '€0.00';
    document.getElementById("unpaidAmount").innerText = '€0.00';
    document.getElementById("card_studnet_name").innerText = '';
    document.getElementById("card_classroom_name").innerText = '';

    // get classroom for students to get fee details
    const classroom = await pb.collection('classroom').getFullList({
        sort: '-created',
        filter: `students ~ "${studentId}"`,
    });

    // get payments for student under this customer
    const payments = await pb.collection('payment').getFullList({
        sort: '-created',
        filter: `payment_student = "${studentId}" && payment_parent = "${customerId}"`,
    });

    // replace layout placeholders with data
    document.getElementById("card_studnet_name").innerText = studentName;
    document.getElementById("card_classroom_name").innerText = classroom[0] ? classroom[0].name : 'N/A';

    // fill the payments table
    document.getElementById("paymentTable").innerHTML = '';
    let totalFee = classroom[0].fee;
    let paidAmount = 0;
    // populate payments
    payments.forEach(payment => {
        paidAmount += payment.payment_amount;

        const unpaidAmount = totalFee - paidAmount;

        document.getElementById("totalFee").innerText = '€' + totalFee;
        document.getElementById("paidAmount").innerText = '€' + paidAmount;
        document.getElementById("unpaidAmount").innerText = '€' + unpaidAmount;

        document.getElementById("paymentTable").innerHTML += `<tr>\
            <td>${payment.created}</td>\
            <td>${customerName}</td>\
            <td>€${payment.payment_amount}</td>\
            <td>DIRECT</td>\
            <td><span class="badge bg-success">Completed</span></td>\
        </tr>`;

        // payment progrees bar
        document.getElementById("paymentProgress").style.width = ((paidAmount / totalFee) * 100) + '%';

    });
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
        pushNotification("ERROR: " + JSON.stringify(e.response.data));
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
    const parent1 = document.forms["new_student_form"]["parentSelect1"].value?? '';
    const parent2 = document.forms["new_student_form"]["parentSelect2"].value?? '';


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
            "state": state,
            "parent_1": parent1,
            "parent_2": parent2
        };
        const record = await pb.collection('student').create(data);
        pushNotification('Successfully created New Entry!');

    } catch (e) {
        pushNotification("ERROR: " + JSON.stringify(e.response.data));
    }
}

///////
// EVENT: USER: CLICK NEW CUSTOMER
async function createNewCustomer() {

    //get form data
    const firstName = document.forms["new_customer_form"]["firstName"].value;
    const lastName = document.forms["new_customer_form"]["lastName"].value;
    const email = document.forms["new_customer_form"]["email"].value;
    const city = document.forms["new_customer_form"]["city"].value;
    const state = document.forms["new_customer_form"]["state"].value;
    const address = document.forms["new_customer_form"]["address"].value;
    const phone1 = document.forms["new_customer_form"]["phone1"].value;
    const phone2 = document.forms["new_customer_form"]["phone2"].value;
    const birthdate = document.forms["new_customer_form"]["birthdate"].value;
    const postalCode = document.forms["new_customer_form"]["postalCode"].value;


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
        const record = await pb.collection('customer').create(data);
        pushNotification('Successfully created New Entry!');

    } catch (e) {
        pushNotification("ERROR: " + JSON.stringify(e.response.data));
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
    // SUCCESS: CLEAR LOGIN FORM
    document.getElementById("UI_MAIN").innerHTML = '';

    // Succesfully logged in! send token to header requests and navigate to where the nav variable says
    let nav = window.localStorage.getItem('nav');
    nav = nav !== null ? nav : "dashboard";
    window.localStorage.setItem('nav', nav);
    try {
        const mainDashboard = document.getElementById("UI_MAIN");
        mainDashboard.innerHTML = '';
        const dashboard = await httpPromise('GET', 'http://192.168.191.216:8090/_dist/dashboard?wd=dashboard', null);
        mainDashboard.innerHTML = dashboard;

    } catch (e) {
        pushNotification("ERROR: " + JSON.stringify(e.response));
        console.error(e);
    }
}

async function initializeApp() {
    if (pb.authStore.isValid) {
        login();
    } else {
        // LOAD LOGIN PAGE
        try {
            const mainLogin = document.getElementById("UI_MAIN");
            mainLogin.innerHTML = '';
            const loginHTML = await httpPromise('GET', 'http://192.168.191.216:8090/_dist/login', null);
            mainLogin.innerHTML = loginHTML;

        } catch (e) {
            pushNotification("ERROR: " + JSON.stringify(e.response));
            console.error(e);
        }
    }
}

///////
// EVENT: CTRL: LOAD ALL STUDENTS
async function loadAllStudents() {
    console.log("Loading Students...");
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
    loadAllParentsForSelect();

    $(document).ready(function () {
        var table = $('#dataTable').DataTable({
            lengthChange: true,
            buttons: ['copy', 'excel', 'pdf', 'colvis']
        });
    });

}

///////
// EVENT: CTRL: LOAD ALL PARENTS FOR SELECT
async function loadAllParentsForSelect() {
    console.log("Loading Parents for Select...");
    // you can also fetch all records at once via getFullList
    const records = await pb.collection('customer').getFullList({
        sort: '-created',
    });

    records.forEach(element => {
        document.getElementById("parentSelect1").innerHTML += `<option value="${element.id}">${element.id}: ${element.first_name} ${element.last_name}</option>`;
    });

    records.forEach(element => {
        document.getElementById("parentSelect2").innerHTML += `<option value="${element.id}">${element.id}: ${element.first_name} ${element.last_name}</option>`;
    });
}


///////
// EVENT: CTRL: LOAD ALL TEACHERS
async function loadAllTeachers() {
    console.log("Loading Teachers...");
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

    $(document).ready(function () {
        var table = $('#dataTable').DataTable({
            lengthChange: true,
            buttons: ['copy', 'excel', 'pdf', 'colvis']
        });
    });
}

///////
// EVENT: CTRL: LOAD ALL CUSTOMERS
async function loadAllCustomers() {
    console.log("Loading Customers...");
    const records = await pb.collection('customer').getFullList({
        sort: '-created',
    });

    records.forEach(element => {
        document.getElementById("tbodyCustomers").innerHTML += `<tr>\
            <td><a href="javascript:customerDetails('${element.id}');" >${element.first_name}</a></td>\
            <td><a href="javascript:customerDetails('${element.id}');" >${element.last_name}</a></td>\
            <td>${element.email}</td>\
            <td>${element.phone_number}</td>\
        </tr>`
    }
    );

    document.getElementById("totalFee").innerText = '€0.00'; // Placeholder for total fee calculation
    document.getElementById("paidAmount").innerText = '€0.00'; // Placeholder for paid amount calculation
    document.getElementById("unpaidAmount").innerText = '€0.00'; // Placeholder for outstanding amount calculation

    $(document).ready(function () {
        var table = $('#dataTable').DataTable({
            lengthChange: true,
            buttons: ['copy', 'excel', 'pdf', 'colvis']
        });
    });
}

///////
// EVENT: LOAD TEACHER CALENDAR ON DETAILS PAGE
function drawTeacherCallendar(schedule, year) {

    // Create the calendar chart
    // Ensure Google Charts is loaded before drawing
    google.charts.load('current', { packages: ['calendar'] })
        .then(() => {
            const dataTable = new google.visualization.DataTable();
            dataTable.addColumn({ type: 'date', id: 'Date' });
            dataTable.addColumn({ type: 'number', id: 'Calls' });
            
            // for each weekday that we need to mark in the calendar 
            schedule.forEach((session) => {
                const sessionDates = getWeekdayDatesInYear(session["day"], year);
                for (let i = 0; i < 12; i++) {
                    sessionDates[i.toString()].forEach((date) => {
                        dataTable.addRow([new Date(year, i, date), 6]); // Assuming 6 calls for each date
                    });
                }
            });

            const chart = new google.visualization.Calendar(
                document.getElementById('teacher_calendar')
            );

            const options = {
                colorAxis: {
                    minValue: 0,
                    maxValue: 10,
                    colors: ['#e0f2f1', '#004d40']
                },
                title: 'Teacher Calendar',
                calendar: {
                    cellSize: 15,
                }
            };

            chart.draw(dataTable, options);
        });
}

///////
// EVENT: LOAD CLASSROOM DETAILS PAGE
//
async function loadAllClassrooms() {
    console.log("Loading Classrooms...");
    const records = await pb.collection('classroom').getFullList({
        sort: '-created',
        expand: 'teacher'
    });

    records.forEach(element => {
        const age = ((new Date()).getFullYear() - new Date(element?.birthdate).getFullYear())
        document.getElementById("tbodyClassrooms").innerHTML += `<tr>\
            <td><a href="javascript:classroomDetails('${element.id}');" >${element.name}</a></td>\
            <td><a href="javascript:teacherDetails('${element.expand.teacher.id}');sidebarNavActive('teachers');" >${element.expand.teacher.first_name} ${element.expand.teacher.last_name}</a></td>\
            <td>${element.level}</td>\
            <td>${element.room}</td>\
        </tr>`
    });

    $(document).ready(function () {
        var table = $('#dataTable').DataTable({
            lengthChange: true,
            buttons: ['copy', 'excel', 'pdf', 'colvis']
        });
    });
}

// UTIL
async function dashboardNavActive(nav) {
    console.log("Navigating to:", nav);
    try {
        const mainDashboard = document.getElementById("UI_MAIN");
        mainDashboard.innerHTML = '';
        const dashboard = await httpPromise('GET', 'http://192.168.191.216:8090/_dist/dashboard?wd=' + nav, null);
        mainDashboard.innerHTML = dashboard;

    } catch (e) {
        pushNotification("ERROR: " + JSON.stringify(e.response));
        console.error(e);
    }
    if (nav === 'students') {
        loadAllStudents();
    } else if (nav === 'teachers') {
        loadAllTeachers();
    } else if (nav === 'classrooms') {
        loadAllClassrooms();
    } else if( nav === 'customers'){ 
        loadAllCustomers();
    } 
}

function sidebarNavActive(nav) {
    const navItems = ['dashboard', 'students', 'teachers', 'classrooms', 'customers'];
    navItems.forEach(item => {
        if (item !== nav) {
            document.getElementById(item + '_a_id').setAttribute('class', 'nav-link text-white');
        } else {
            document.getElementById(item + '_a_id').setAttribute('class', 'nav-link text-white active');
        }
    }); 
}

function getAuthHeader() {
    const headers = { Authorization: pb.authStore.token.trim() }
    return JSON.stringify(headers)
}

function httpPromise(method, url, data) {
    return new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            if (this.status > 299) {
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

function getWeekdayDatesInYear(targetWeekday, year) {
    //sanity check
    if (typeof targetWeekday === 'string') {
        const dayStrArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        targetWeekday = dayStrArray.indexOf(targetWeekday);
    }

    const result = {}; // { month: [dates] }

    for (let month = 0; month < 12; month++) {
        result[month] = [];

        // Start from the first day of the month
        const date = new Date(year, month, 1);
        while (date.getMonth() === month) {
            // JS: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            const jsWeekday = date.getDay();

            // Convert JS weekday to Monday-based (0 = Monday ... 6 = Sunday)
            const mondayBasedWeekday = (jsWeekday + 6) % 7;
            if (mondayBasedWeekday === targetWeekday) {
                result[month].push(date.getDate()); // 1–31
            }
            date.setDate(date.getDate() + 1);
        }
    }
    return result;
}

// functionto get file from server
async function getFileFromServer(id) {
    try {
        const response = await fetch("http://192.168.191.216:8090/_dist/assignment/file?id=" + id, {
            headers: {
                'Authorization': pb.authStore.token.trim()
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        // Create a temporary download URL
        const url = URL.createObjectURL(blob);

        // Create a hidden <a> element
        const a = document.createElement("a");
        a.href = url;

        // Optional: set filename
        const disposition = response.headers.get("Content-Disposition");
        const filename = disposition?.match(/filename="(.+)"/)?.[1] ?? "download";
        a.download = filename;

        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}