///////
// EVENT: USER: CLICK TEACHER DETAILS
async function teacherDetails(teacherId) {

    // try to loging for error return an error message
    try {
        const mainDashboard = document.getElementById("main-dashboard");
        mainDashboard.innerHTML = '';
        const teacherHTML = await httpPromise('GET', 'https://aggal-book.ddns.net/_dist/teacher/details?id=' + teacherId + "&language=" + getLanguage(), null);
        mainDashboard.innerHTML = teacherHTML;

    } catch (e) {
        pushNotification("ERROR: " + JSON.stringify(e.response));
        console.error(e);
    }
    const scheduleData = document.getElementById("schedule").value || '[{"classroom": "3o2ktfriv7jyeps","day": "Tuesday","hours": ["16:00-17:30","19:00-20:30"]}]' ; 
    const schedule = JSON.parse(scheduleData) ;
    drawTeacherCallendar(schedule, 2026);
    scheduleTablePopulate();
}

// --- Student profile listing and grades handling ---
async function loadStudentsForProfile() {
    const records = await pb.collection('student').getFullList({ sort: 'last_name' });
    const tbody = document.getElementById('tbodyStudentsProfile');
    if (!tbody) return;
    tbody.innerHTML = '';
    records.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="javascript:void(0)" onclick="selectStudentProfile('${r.id}','${escapeHtml(r.first_name + ' ' + r.last_name)}')">${r.first_name} ${r.last_name}</a></td>
            <td class="text-end"><button class="btn btn-sm btn-outline-danger" onclick="deleteStudent('${r.id}','${r.first_name} ${r.last_name}')">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function selectStudentProfile(studentId, displayName) {
    // set header
    document.getElementById('profile_name').innerText = displayName;
    document.getElementById('profile_student_id').innerText = 'ID: ' + studentId;
    document.getElementById('addGradeBtn').style.display = '';
    document.getElementById('editProfileBtn').style.display = '';
    // store selected id
    document.getElementById('grade_student_id').value = studentId;
    // load assignments
    loadStudentProfile(studentId);
}

async function loadStudentProfile(studentId) {
    // fetch assignment submits for this student
    let subs = [];
    try {
        subs = await pb.collection('assignment_submit').getFullList({ filter: `student = "${studentId}"`, sort: '-created' });
    } catch (e) { console.error(e); }

    // calculate metrics
    let total = 0, count = 0, tests = 0;
    let latest = null;
    subs.forEach(s => {
        const g = parseFloat(s.grade || 0);
        if (!isNaN(g)) { total += g; count++; }
        if (s.type === 'test') tests++;
        if (!latest) latest = s; // already sorted desc so first is latest
    });

    const overall = count > 0 ? Math.round((total / count) * 100) / 100 : '-';
    document.getElementById('overallAverage').innerText = overall === '-' ? '-' : overall + '%';
    document.getElementById('totalTests').innerText = tests;
    document.getElementById('latestScore').innerText = latest ? (latest.grade || '-') : '-';

    // populate assignments table
    const tbody = document.getElementById('tbodyAssignments');
    tbody.innerHTML = '';
    subs.forEach(s => {
        const pct = (s.grade && s.max_score) ? Math.round((parseFloat(s.grade) / parseFloat(s.max_score)) * 100) + '%' : '-';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(s.type || '')}</td>
            <td>${escapeHtml(s.title || '')}</td>
            <td>${s.date ? (new Date(s.date)).toISOString().slice(0,10) : ''}</td>
            <td>${escapeHtml(s.grade || '')}</td>
            <td>${escapeHtml(s.max_score || '')}</td>
            <td>${pct}</td>
            <td class="text-center">
                <button class="btn btn-outline-secondary btn-sm" onclick="openEditGradeModal('${s.id}','${studentId}')"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-outline-danger btn-sm" onclick="deleteGrade('${s.id}','${studentId}')"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openEditGradeModal(subId, studentId) {
    // if subId is null -> create new
    document.getElementById('grade_id').value = subId || '';
    document.getElementById('grade_student_id').value = studentId || '';
    if (!subId) {
        document.getElementById('grade_type').value = 'homework';
        document.getElementById('grade_title').value = '';
        document.getElementById('grade_date').value = '';
        document.getElementById('grade_score').value = '';
        document.getElementById('grade_max').value = '';
        var modal = new bootstrap.Modal(document.getElementById('addGradeModal'));
        modal.show();
        return;
    }
    pb.collection('assignment_submit').getOne(subId).then(r => {
        document.getElementById('grade_type').value = r.type || 'homework';
        document.getElementById('grade_title').value = r.title || '';
        document.getElementById('grade_date').value = r.date ? (new Date(r.date)).toISOString().slice(0,10) : '';
        document.getElementById('grade_score').value = r.grade || '';
        document.getElementById('grade_max').value = r.max_score || '';
        var modal = new bootstrap.Modal(document.getElementById('addGradeModal'));
        modal.show();
    }).catch(e => console.error(e));
}

async function saveGrade() {
    const id = document.getElementById('grade_id').value || null;
    const student = document.getElementById('grade_student_id').value || '';
    const type = document.getElementById('grade_type').value || '';
    const title = document.getElementById('grade_title').value || '';
    const date = document.getElementById('grade_date').value || '';
    const grade = document.getElementById('grade_score').value || '';
    const max = document.getElementById('grade_max').value || '';

    try {
        if (id) {
            await pb.collection('assignment_submit').update(id, { type: type, title: title, date: date, grade: grade, max_score: max, student: student });
            pushNotification('Grade updated');
        } else {
            await pb.collection('assignment_submit').create({ type: type, title: title, date: date, grade: grade, max_score: max, student: student });
            pushNotification('Grade created');
        }
        var modalEl = document.getElementById('addGradeModal');
        var modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        try { modal.hide(); } catch (e) {}
        if (student) loadStudentProfile(student);
    } catch (e) {
        console.error(e);
        alert('Failed to save grade');
    }
}

async function deleteGrade(subId, studentId) {
    if (!confirm('Delete this grade?')) return;
    try {
        await pb.collection('assignment_submit').delete(subId);
        pushNotification('Grade deleted');
        if (studentId) loadStudentProfile(studentId);
    } catch (e) { console.error(e); alert('Failed to delete grade'); }
}

///////
// EVENT: USER: CLICK STUDENT DETAILS
async function studentDetails(studentId) {

    // try to loging for error return an error message
    try {
        const mainDashboard = document.getElementById("main-dashboard");
        mainDashboard.innerHTML = '';
        const studentHTML = await httpPromise('GET', 'https://aggal-book.ddns.net/_dist/student/details?id=' + studentId + "&language=" + getLanguage(), null);
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
        const classroomHTML = await httpPromise('GET', 'https://aggal-book.ddns.net/_dist/classroom/details?id=' + classroomId + "&language=" + getLanguage(), null);
        mainDashboard.innerHTML = classroomHTML;
    } catch (e) {
        pushNotification("ERROR: " + JSON.stringify(e.response));
        console.error(e);
    }
    loadAllStudentsForAssign();
    // draw classroom calendar for reports
    try { drawClassroomCalendar(classroomId, (new Date()).getFullYear()); } catch (e) { console.error(e); }
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

    // replace layout placeholders with data
    document.getElementById("card_studnet_name").innerText = studentName;
    document.getElementById("card_classroom_name").innerText = classroom[0] ? classroom[0].name : 'N/A';

    // enable payment button only if student is assigned to a classroom
    if (classroom.length !== 0) {
        document.getElementById("payment_button").removeAttribute("disabled");

        //get the rest of the data and populate accordingly
        // get payments for student under this customer
        const payments = await pb.collection('payment').getFullList({
            sort: '-created',
            filter: `payment_student = "${studentId}" && payment_parent = "${customerId}"`,
        });

        // replace layout placeholders with data
        document.getElementById("paymentStudentId").value = studentId;
        document.getElementById("paymentParentId").value = customerId;

        // fill the payments table
        document.getElementById("paymentTable").innerHTML = ''; // clear previous entries
        let totalFee = classroom[0].fee; // get fee from classroom
        document.getElementById("totalFee").innerText = '€' + totalFee; // set total fee
        
        let paidAmount = 0;
        // populate payments
        payments.forEach(payment => {
            paidAmount += payment.payment_amount;

            const unpaidAmount = totalFee - paidAmount;

            document.getElementById("paidAmount").innerText = '€' + paidAmount;
            document.getElementById("unpaidAmount").innerText = '€' + unpaidAmount;

            document.getElementById("paymentTable").innerHTML += `<tr>\
                <td>${payment.created}</td>\
                <td>${customerName}</td>\
                <td>€${payment.payment_amount}</td>\
                <td>DIRECT</td>\
                <td><span class="badge bg-success">Completed</span></td>\
                <td><button class="btn bs b-btn-xl btn-primary" type="button" onclick="window.open('https://aggal-book.ddns.net/_dist/payment?id=${payment.id}')">Print <i class="fa-solid fa-print"></i></button></td>\
            </tr>`;

            // payment progrees bar
            document.getElementById("paymentProgress").style.width = ((paidAmount / totalFee) * 100) + '%';

        });
    } else {
        document.getElementById("payment_button").setAttribute("disabled", "true");
    }

}

///////
// EVENT: USER: CLICK ADD PAYMENT
async function addPayment() {

    //get form data
    const amount = document.forms["new_payment_form"]["paymentAmount"].value;
    const studentId = document.getElementById("paymentStudentId").value;
    const customerId = document.getElementById("paymentParentId").value;

    // try to loging for error return an error message
    try {
        // example create data
        const data = {
            "payment_amount": parseFloat(amount),
            "payment_student": studentId,
            "payment_parent": customerId,
            "payment_method": "DIRECT"
        };

        console.log("Creating payment with data:", data);
        const record = await pb.collection('payment').create(data);
        pushNotification('Successfully created New Payment Entry!');

        // refresh the student fees view
        studentFees(studentId, customerId, '', document.getElementById("card_studnet_name").innerText);

    } catch (e) {
        pushNotification("ERROR: " + JSON.stringify(e.response.data));
    }
}


///////
// EVENT: CLASSROOM: CLICK ASSIGN STUDENTS
async function assignStudent() {
    const classroomId = document.getElementById("classroom_id").value;
    //get form data
    const selectedStudents = Array.from(document.getElementById("studentsSelectAssign").selectedOptions).map(option => option.value);
    console.log("Selected Students to assign:", selectedStudents);

    // try to loging for error return an error message
    console.log("Assigning students to classroom:", classroomId);
    try {
        // get current classroom data
        const classroom = await pb.collection('classroom').getOne(classroomId);

        // merge current students with new selected students
        const updatedStudents = Array.from(new Set([...classroom.students, ...selectedStudents]));

        // update classroom with new students list
        const data = {
            "students": updatedStudents
        };
        const record = await pb.collection('classroom').update(classroomId, data);
        pushNotification("Succesfully Assigned Students!");

        // reload classroom details page
        classroomDetails(classroomId);

    } catch (e) {
        console.error(e);
        pushNotification("ERROR: " + JSON.stringify(e.response.data));
    }
}

///////
// EVENT: USER: CLICK SUBMIT STUDENT/TEACHER DETAILS
async function putDetails(id, collection) {

    if(collection === 'student' || collection === 'teacher') {
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
                "state": state,
                "parent_1": document.getElementById("parentSelect1Detail")?.value ?? '',
                "parent_2": document.getElementById("parentSelect2Detail")?.value ?? ''
            };
            
            const record = await pb.collection(collection).update(id, data);
            pushNotification("Succesfully Updated Entry!");

        } catch (e) {
            console.error(e);
            pushNotification("ERROR: " + JSON.stringify(e.response.data));
        }
    } else if(collection === 'classroom') {
        //get form data
        const name = document.getElementById('inputClassroomName')?.value || '';
        const teacher = document.getElementById('classroomTeacherSelectDetail')?.value || '';
        const room = document.getElementById('inputClassroomRoom')?.value || '';
        const level = document.getElementById('inputClassroomLevel')?.value || '';
        const fee = document.getElementById('inputClassroomFee')?.value || 0;

        // try to loging for error return an error message
        try {
            const data = {
                "name": name,
                "teacher": teacher,
                "room": room,
                "level": level,
                "fee": parseFloat(fee)
            };
            const record = await pb.collection('classroom').update(id, data);
            pushNotification("Succesfully Updated Classroom Entry!");
        } catch (e) {
            console.error(e);
            pushNotification("ERROR: " + JSON.stringify(e.response.data));
        }
    }
    
}

///////
// EVENT: CLICK DELETE STUDENT
function deleteStudentModal(studentId, name) {
    if (!confirm(`Are you sure you want to delete student: ${name}?`)) return;
    deleteStudent(studentId);
}

///////
// EVENT: DELETE STUDENT
async function deleteStudent(studentId) {
    try {
        const authData = await pb.collection('student').delete(studentId);
        pushNotification("Succesfully deleted Student!");
    } catch(ex) {
        pushNotification(ex)
    }
}

///////
// EVENT: CLICK DELETE TEACHER
function deleteTeacherModal(teacherId, name) {
    if (!confirm(`Are you sure you want to delete teacher: ${name}?`)) return;
    deleteTeacher(teacherId);
}

///////
//EVENT: DELETE TEACHER
async function deleteTeacher(teacherId) {
    try {
        const authData = await pb.collection('teacher').delete(teacherId);
        pushNotification("Succesfully deleted Teacher!");
    } catch(ex) {
        pushNotification(ex)
    }
}

///////
// EVENT: CLICK DELETE CUSTOMER
function deleteCustomerModal(customerId, name) {
    if (!confirm(`Are you sure you want to delete customer: ${name}?`)) return;
    deleteCustomer(customerId);
}

///////
//EVENT: DELETE CUSTOMER
async function deleteCustomer(customerId) {
    try {
        const authData = await pb.collection('customer').delete(customerId);
        pushNotification("Succesfully deleted Customer!");
    } catch(ex) {
        pushNotification(ex)
    }
}

///////
// EVENT: CLICK ASSIGNMENT
function showAssignment(index) {
    // Accept either a numeric index or a full preview id like 'assignment-preview-<id>'
    const previewPrefix = 'assignment-preview-';
    const allPreviews = document.querySelectorAll('[id^="assignment-preview-"]');
    allPreviews.forEach(el => el.classList.add('d-none'));

    if (typeof index === 'string' && index.startsWith(previewPrefix)) {
        const el = document.getElementById(index);
        if (el) el.classList.remove('d-none');
        // toggle active class on list items by matching data-preview-id
        document.querySelectorAll('#assignmentList .list-group-item').forEach(li => {
            li.classList.toggle('active', li.dataset && li.dataset.previewId === index);
        });
    } else {
        // numeric index fallback
        const numeric = parseInt(index, 10);
        const el = document.getElementById(previewPrefix + numeric);
        if (el) el.classList.remove('d-none');
        document.querySelectorAll('#assignmentList .list-group-item').forEach(el => el.classList.remove('active'));
        const listItems = document.querySelectorAll('#assignmentList .list-group-item');
        if (listItems[numeric]) listItems[numeric].classList.add('active');
    }
}

// Delete a class report (index.js scope)
async function deleteClassReport(reportId, classroomId, dateISO) {
    if (!confirm('Delete this report?')) return;
    try {
        await pb.collection('class_report').delete(reportId);
        pushNotification('Report deleted');
        // refresh calendar and reports
        drawClassroomCalendar(classroomId, (new Date()).getFullYear());
        if (dateISO) handleClassroomDateClick(new Date(dateISO), classroomId);
    } catch (e) {
        console.error(e);
        alert('Failed to delete report');
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
// EVENT: USER: CLICK NEW TEACHER
async function createNewTeacher() {
    const firstName = document.forms["new_teacher_form"]["teacherFirstName"].value;
    const lastName = document.forms["new_teacher_form"]["teacherLastName"].value;
    const email = document.forms["new_teacher_form"]["teacherEmail"].value;
    const phone = document.forms["new_teacher_form"]["teacherPhone"].value || '';
    const birthdate = document.forms["new_teacher_form"]["teacherBirthdate"].value || '';

    try {
        const data = {
            "first_name": firstName,
            "last_name": lastName,
            "birthdate": birthdate,
            "phone_number": phone,
            "email": email
        };
        const record = await pb.collection('teacher').create(data);
        pushNotification('Successfully created New Teacher!');
    } catch (e) {
        pushNotification("ERROR: " + JSON.stringify(e.response?.data || e.toString()));
    }
}

///////
// EVENT: USER: CLICK NEW CLASSROOM
async function createNewClassroom() {
    const name = document.forms["new_classroom_form"]["classroomName"].value;
    const teacher = document.getElementById('classroomTeacher')?.value || '';
    const room = document.forms["new_classroom_form"]["classroomRoom"].value || '';
    try {
        const data = {
            "name": name,
            "teacher": teacher,
            "room": room
        };
        const record = await pb.collection('classroom').create(data);
        pushNotification('Successfully created New Classroom!');
    } catch (e) {
        pushNotification("ERROR: " + JSON.stringify(e.response?.data || e.toString()));
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
    const nav = window.localStorage.getItem('nav') || 'dashboard';
    window.localStorage.setItem('language', window.localStorage.getItem('language') || 'en');
    dashboardNavActive(nav)

    try {
        const mainDashboard = document.getElementById("UI_MAIN");
        mainDashboard.innerHTML = '';
        const dashboard = await httpPromise('GET', 'https://aggal-book.ddns.net/_dist/dashboard?wd=' + nav + '&language=' + getLanguage(), null);
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
            const loginHTML = await httpPromise('GET', 'https://aggal-book.ddns.net/_dist/login', null);
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
    const classrooms = await pb.collection("classroom").getFullList({
        expand: "students"
    });

    classrooms.forEach(async(element) => {
        element.expand.students.forEach((el) => {
            const fnLinkString = pb.authStore.model['auth_type'] !== "student" ? `<a href="javascript:studentDetails('${el['id']}');" >${el['first_name']}</a>` : el['first_name']
            const lnLinkString = pb.authStore.model['auth_type'] !== "student" ? `<a href="javascript:studentDetails('${el['id']}');" >${el['last_name']}</a>` : el['last_name']
            document.getElementById("tbodyStudents").innerHTML += `<tr>\
                <td>${fnLinkString}</td>\
                <td>${lnLinkString}</td>\
                <td>${((new Date()).getFullYear() - new Date(el['birthdate']).getFullYear())}</td>\
                <td>${el['phone_number']}</td>\
                <td><a href="javascript:classroomDetails('${element['id']}');sidebarNavActive('classrooms');">${element['name']}</a></td>
                <td><button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteStudentModal('${el['id']}', '${el['first_name']} ${el['last_name']}')">Delete</button></td>
            </tr>`
        });
    });

    loadAllParentsForSelect();

    $(document).ready(function () {
        var table = $('#dataTable').DataTable({
            lengthChange: true,
            buttons: ['copy', 'excel', 'pdf', 'colvis'],
            language: {
                url: 'json/dataTables_' + (getLanguage() === 'en' ? 'en' : 'el') + '.json'
            }
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
// EVENT: CTRL: LOAD ALL STUDENTS FOR ASSIGN
async function loadAllStudentsForAssign() {
    console.log("Loading Students for Assign...");
    // fetch all students records at once via getFullList
    const records = await pb.collection('student').getFullList({
        sort: '-created',
    });

    // fetch all students in classrooms and filter them out
    const assignedStudentsRecords = await pb.collection('classroom').getFullList({
        sort: '-created',
    });

    const assignedStudentsIds = [];
    assignedStudentsRecords.forEach(classroom => {
        classroom.students.forEach(studentId => {
            assignedStudentsIds.push(studentId);
        });
    });

    // populate only unassigned students
    records.forEach(element => {
        if (!assignedStudentsIds.includes(element.id)) {
            document.getElementById("studentsSelectAssign").innerHTML += `<option value="${element.id}">${element.id}: ${element.first_name} ${element.last_name}</option>`;
        }
    });

}

///////
// EVENT: CTRL: LOAD ALL TEACHERS
async function loadAllTeachers() {
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
            <td><button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteTeacherModal('${element.id}', '${element.first_name} ${element.last_name}')">Delete</button></td>
        </tr>`
    });

    $(document).ready(function () {
        var table = $('#dataTable').DataTable({
            lengthChange: true,
            buttons: ['copy', 'excel', 'pdf', 'colvis'],
            language: {
                url: 'json/dataTables_' + (getLanguage() === 'en' ? 'en' : 'el') + '.json'
            }
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
            <td>${element.id}</td>\
            <td><a href="javascript:customerDetails('${element.id}');" >${element.first_name}</a></td>\
            <td><a href="javascript:customerDetails('${element.id}');" >${element.last_name}</a></td>\
            <td>${element.email}</td>\
            <td>${element.phone_number}</td>\
            <td><button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteCustomerModal('${element.id}', '${element.first_name} ${element.last_name}')">Delete</button></td>
        </tr>`
    }
    );

    document.getElementById("totalFee").innerText = '€0.00'; // Placeholder for total fee calculation
    document.getElementById("paidAmount").innerText = '€0.00'; // Placeholder for paid amount calculation
    document.getElementById("unpaidAmount").innerText = '€0.00'; // Placeholder for outstanding amount calculation

    $(document).ready(function () {
        var table = $('#dataTable').DataTable({
            lengthChange: true,
            buttons: ['copy', 'excel', 'pdf', 'colvis'],
            language: {
                url: 'json/dataTables_' + (getLanguage() === 'en' ? 'en' : 'el') + '.json'
            }
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
            dataTable.addColumn({ type: 'number', id: 'Sessions' });
            dataTable.addColumn({ type: 'string', role: 'hours' });
            dataTable.addColumn({ type: 'string', role: 'clarssroom' });

            // Step 1: Pre-fill all days of the year with 0
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                dataTable.addRow([new Date(d), 0, '', '']);
            }
            
            // for each weekday that we need to mark in the calendar 
            schedule.forEach((session) => {
                console.log("Processing session for day:", session['hours']);
                const sessionDates = getWeekdayDatesInYear(session["day"], year);
                //console.log("Session dates for", session["day"]);
                for (let i = 0; i < 12; i++) {
                    sessionDates[i.toString()].forEach((date) => {
                        dataTable.addRow([
                            new Date(year, i, date, 0, 0, 0, 0),
                            session["hours"].length,
                            JSON.stringify(session['hours']),
                            session["classroom_name"]
                        ]);
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
                    colors: ['#e0f2f1', '#26a4d6']
                },
                title: getLanguage() === 'en' ? 'Teacher Calendar' : 'Ημερολόγιο Δασκάλου',
                calendar: {
                    cellSize: 15,
                }
            };

            chart.draw(dataTable, options);
             // CLICK HANDLER
            google.visualization.events.addListener(chart, 'select', function () {

                const selection = chart.getSelection();

                if (!selection || selection.length === 0) {
                    return;
                }

                if (selection[0].row == null) {
                    return;
                }

                const clickedDate = dataTable.getValue(selection[0].row, 0);
                const sessions = dataTable.getValue(selection[0].row, 1);
                const hours = dataTable.getValue(selection[0].row, 2);
                const classroom = dataTable.getValue(selection[0].row, 3);
                
                if(sessions !== 0) handleDateClick(clickedDate, sessions, hours, classroom);
            });

        });
}

function handleDateClick(date, sessions, hours, classroom) {
    google.charts.load("current", {packages:["timeline"]}).then(function() {
        var container = document.getElementById('example5.2');
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: 'string', id: 'Room' });
        dataTable.addColumn({ type: 'date', id: 'Start' });
        dataTable.addColumn({ type: 'date', id: 'End' });

        const parsedHours = JSON.parse(hours);

        console.log("Parsed Hours:", parsedHours);

        parsedHours.forEach(hourRange => {
            const dayStart = new Date(date);
            const hxDayStart = new Date(date);
            hxDayStart.setHours(8, 0, 0, 0); // 08:00:00.000
            dayStart.setHours(parseInt(hourRange.split('-')[0].split(':')[0]), 0, 0, 0);

            const endDate = new Date(date);
            const hxDayEnd = new Date(date);
            endDate.setHours(parseInt(hourRange.split('-')[1].split(':')[0]), 0, 0);
            hxDayEnd.setHours(23, 59, 59, 999); // 23:59:59.999

            dataTable.addRows([
                [ classroom, dayStart, endDate ]
            ]);

            var options = {
                timeline: { singleColor: 'rgb(13, 134, 155)' },
                title: 'Teacher Timeline',
                hAxis: {
                    minValue: hxDayStart,   // 00:00
                    maxValue: hxDayEnd, // 23:59
                    format: 'HH:mm'
                }
            };

            chart.draw(dataTable, options);
        });
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
        console.log("ele:", element)
        const teacher = element.expand?.teacher;

        const teacherCell = teacher
            ? `<a href="javascript:teacherDetails('${teacher.id}');sidebarNavActive('teachers');">
                ${teacher.first_name} ${teacher.last_name}
            </a>`
            : `<span class="text-muted">No teacher assigned</span>`;

            document.getElementById("tbodyClassrooms").innerHTML += `
                <tr>
                    <td>
                        <a href="javascript:classroomDetails('${element.id}');">
                            ${element.name}
                        </a>
                    </td>
                    <td>${teacherCell}</td>
                    <td>${element.level}</td>
                    <td>${element.room}</td>
                    <td>${element.fee}</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteClassroom('${element.id}','${element.name}')">Delete</button>
                    </td>
                </tr>
            `;
    });

    $(document).ready(function () {
        var table = $('#dataTable').DataTable({
            lengthChange: true,
            buttons: ['copy', 'excel', 'pdf', 'colvis'],
            language: {
                url: 'json/dataTables_' + (getLanguage() === 'en' ? 'en' : 'el') + '.json'
            }
        });
    });
}

// UTIL
async function dashboardNavActive(nav) {
    console.log("Navigating to:", nav);
    try {
        const mainDashboard = document.getElementById("UI_MAIN");
        mainDashboard.innerHTML = '';
        const dashboard = await httpPromise('GET', 'https://aggal-book.ddns.net/_dist/dashboard?wd=' + nav + '&language=' + getLanguage(), null);
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

// DRAW CLASSROOM CALENDAR AND HANDLE REPORTS
async function drawClassroomCalendar(classroomId, year) {
    google.charts.load('current', { packages: ['calendar'] }).then(async () => {
        const dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: 'date', id: 'Date' });
        dataTable.addColumn({ type: 'number', id: 'Reports' });

        // Prefill all days with 0
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            dataTable.addRow([new Date(d), 0]);
        }

        // fetch all reports for this classroom
        let reports = [];
        try {
            reports = await pb.collection('class_report').getFullList({ filter: `classroom = "${classroomId}"` });
        } catch (e) { console.error('Failed to load class_report records', e); }

        // aggregate by date (YYYY-MM-DD)
        const counts = {};
        reports.forEach(r => {
            if (!r.date) return;
            const d = new Date(r.date);
            const key = d.toISOString().slice(0,10);
            counts[key] = (counts[key] || 0) + 1;
        });

        // add rows for dates with reports (Google Calendar will color them)
        Object.keys(counts).forEach(k => {
            const parts = k.split('-');
            const yr = parseInt(parts[0],10);
            const mo = parseInt(parts[1],10)-1;
            const day = parseInt(parts[2],10);
            dataTable.addRow([new Date(yr, mo, day), counts[k]]);
        });

        const chart = new google.visualization.Calendar(document.getElementById('classroom_calendar'));
        const options = {
            title: getLanguage() === 'en' ? 'Classroom Reports' : 'Αναφορές Τάξης',
            calendar: { cellSize: 15 },
            colorAxis: { colors: ['#f0f4c3', '#8bc34a'] }
        };

        chart.draw(dataTable, options);

        google.visualization.events.addListener(chart, 'select', function () {
            const selection = chart.getSelection();
            if (!selection || selection.length === 0) return;
            if (selection[0].row == null) return;
            const clickedDate = dataTable.getValue(selection[0].row, 0);
            handleClassroomDateClick(clickedDate, classroomId);
        });
    });
}


async function handleClassroomDateClick(dateObj, classroomId) {
    const dateISO = dateObj.toLocaleDateString();
    // Extract LOCAL date parts
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const day = dateObj.getDate();

    // Build proper UTC boundaries
    const start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

    //otherwise the 
    const filterStr = `
        classroom = "${classroomId}" &&
        date >= "${start.toISOString().replace("T", " ")}" &&
        date <= "${end.toISOString().replace("T", " ")}"
    `;
    // fetch reports for classroom and filter by date
    let reports = [];
    try {
        const all = await pb.collection('class_report').getFullList({ filter: filterStr });
        reports = all;
    } catch (e) { console.error('Failed to fetch reports for date', e); }


    const container = document.getElementById('classroom_reports');
    container.innerHTML = '';

    if (reports.length > 0) {
        reports.forEach(r => {
            const card = document.createElement('div');
            card.className = 'card mb-2';
            card.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">${dateISO} - ${escapeHtml(r.title || '(untitled)')}</h5>
                        <div>
                            <button class="btn btn-sm btn-outline-primary me-1"
                                data-report-id="${r.id}"
                                data-classroom-id="${classroomId}"
                                data-report-date="${r.date || ''}"
                                onclick="openClassReportModalFromElem(this)">Edit</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteClassReport('${r.id}','${classroomId}','${dateISO}')">Delete</button>
                        </div>
                    </div>
                    <div class="card-text mt-2">${r.report_body || ''}</div>
                </div>
            `;
            container.appendChild(card);
        });
    } else {
        // show create form prompt
        container.innerHTML = `
            <div class="card p-3">
                <div class="mb-2">No reports for <strong>${dateISO}</strong>.</div>
                <button class="btn btn-primary" id="createReportBtn">Create report for ${dateISO}</button>
            </div>
        `;
        document.getElementById('createReportBtn').addEventListener('click', function () {
            openClassReportModal(null, classroomId, new Date(dateISO).toISOString().split("T")[0]);
        });
    }
}

// Modal + Quill handling for class reports
let classReportQuill = null;
function openClassReportModal(reportId, classroomId, dateISO) {
    console.log("Opening modal for reportId:", reportId, "classroomId:", classroomId, "date:", dateISO);
    const modalEl = document.getElementById('classReportModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    
    // populate modal fields; if reportId null, create new
    document.getElementById('classReport_id').value = reportId || '';
    document.getElementById('classReport_classroom').value = classroomId;
    document.getElementById('classReport_date').value = dateISO;

    if (reportId) {
        // load record
        pb.collection('class_report').getOne(reportId).then(r => {
            document.getElementById('classReport_title').value = r.title || '';
            document.getElementById('classReport_date').value = r.date ? (new Date(r.date)).toISOString().slice(0,10) : '';
            setTimeout(() => {
                if (!classReportQuill) classReportQuill = new Quill('#classReport_editor', { theme: 'snow' });
                try {
                    const editorRoot = classReportQuill.root; // .ql-editor
                    const currentH = editorRoot.clientHeight || editorRoot.scrollHeight || 200;
                    editorRoot.style.minHeight = (currentH + 100) + 'px';
                    editorRoot.dataset.heightIncreased = '1';
                } catch (e) { /* ignore */ }
                classReportQuill.root.innerHTML = r.report_body || '';
            }, 100);
        }).catch(e => { console.error(e); });
    } else {
        document.getElementById('classReport_title').value = '';
        setTimeout(() => {
            if (!classReportQuill) classReportQuill = new Quill('#classReport_editor', { theme: 'snow' });
            try {
                const editorRoot = classReportQuill.root; // .ql-editor
                const currentH = editorRoot.clientHeight || editorRoot.scrollHeight || 200;
                editorRoot.style.minHeight = (currentH + 100) + 'px';
                editorRoot.dataset.heightIncreased = '1';
            } catch (e) { /* ignore */ }
            classReportQuill.root.innerHTML = '';
        }, 100);
    }
}

function openClassReportModalFromElem(el) {
    if (!el || !el.dataset) return;
    const reportId = el.dataset.reportId || null;
    const classroomId = el.dataset.classroomId || el.dataset.classroom || null;
    const rawDate = el.dataset.reportDate || el.dataset.date || '';
    let dateISO = '';
    try {
        if (rawDate) dateISO = (new Date(rawDate)).toISOString().slice(0,10);
    } catch (e) { dateISO = rawDate; }
    openClassReportModal(reportId, classroomId, dateISO);
}

async function saveClassReport() {
    console.log("Saving report...");
    const id = document.getElementById('classReport_id').value || null;
    const classroom = document.getElementById('classReport_classroom').value;
    const title = document.getElementById('classReport_title').value || '';
    const date = document.getElementById('classReport_date').value || '';
    const body = classReportQuill ? classReportQuill.root.innerHTML : document.getElementById('classReport_editor')?.innerHTML || '';

    try {
        if (id) {
            await pb.collection('class_report').update(id, { title: title, date: date, report_body: body, classroom: classroom });
            pushNotification('Report updated');
        } else {
            await pb.collection('class_report').create({ title: title, date: date, report_body: body, classroom: classroom });
            pushNotification('Report created');
        }
        // hide modal
        const modalEl = document.getElementById('classReportModal');
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        try { modal.hide(); } catch (e) { /* ignore */ }
        // refresh calendar and reports
        const cid = classroom;
        drawClassroomCalendar(cid, (new Date()).getFullYear());
        // open reports for the saved date
        if (date) handleClassroomDateClick(new Date(date), cid);
    } catch (e) {
        console.error(e);
        alert('Failed to save report');
    }
}

function getLanguage() {
    const lang = window.localStorage.getItem('language') || 'en';
    return lang;
}

function changeLanguage(lang) {
    window.localStorage.setItem('language', lang);
    window.location.reload();
}

function insertTableRow(tableId, classroomid) {
    var table = document.getElementById(tableId)
    var row = table.insertRow(table.length)
    var c1 = row.insertCell(0)
    var c2 = row.insertCell(1)
    var c3 = row.insertCell(2)
    var c4 = row.insertCell(3)
    var c5 = row.insertCell(4)
    var c6 = row.insertCell(5)
    c1.innerHTML = `<input type="text" class="form-control w-15" value="${classroomid}"/>`
    c2.innerHTML = '<input type="checkbox"class="hour-checkbox"data-day="Monday"><input type="text" class="form-control w-15" value="00:00-00:00"></input>'
    c3.innerHTML = '<input type="checkbox"class="hour-checkbox"data-day="Tuesday"><input type="text" class="form-control w-15" value="00:00-00:00"></input>'
    c4.innerHTML = '<input type="checkbox"class="hour-checkbox"data-day="Wednesday"><input type="text" class="form-control w-15" value="00:00-00:00"></input>'
    c5.innerHTML = '<input type="checkbox"class="hour-checkbox"data-day="Thursday"><input type="text" class="form-control w-15" value="00:00-00:00"></input>'
    c6.innerHTML = '<input type="checkbox"class="hour-checkbox"data-day="Friday"><input type="text" class="form-control w-15" value="00:00-00:00"></input>'
    
}