// Documentations for all functions found in the 
// PocketBase JSVM Docs 
// Link included in README.md for references
//
// https://pocketbase.io/jsvm/interfaces/echo.Context.html

//////////

//////////////
// TEMPLATE
//////////////

// GET LOGIN
routerAdd("GET", "/_dist/login", (c) => {
    //generate templates
    const html = $template.loadFiles(
        `${__hooks}/views/login/layout.html`
    ).render()

    return c.html(200, html);
});

// GET DASHBOARD
//  
//  @param httpContext - echo.Context []
routerAdd("GET", "/_dist/dashboard", (httpContext) => {
    // the view to be returned for the dashboard  will come from the query param 'wd' for 'working directory'
    const workinDirectory = httpContext.request.url.query().get("wd")

    const notifications = []
    let records = $app.findAllRecords("notification");

    records.forEach(element => {
        notifications.push({
            "id": element.id,
            "title": element.get("title"),  
            "body_text": element.get("body_text"),
            "created": element.get("created"),
            "read": element.get("read")
        })
    });
    const notificationsCount = notifications.filter(n => n.read === false).length;
    console.log("NOTIFICATIONS COUNT: "+notificationsCount);
    console.log("NOTIFICATIONS: "+JSON.stringify(notifications));

    httpContext.response.header().set("Hx-Trigger", "loginAccept")
    // wrapped in try watch for any internal problem so that nothing get returned to client
    try {
        //generate templates base on working directory path
        const data = {}
        data["sb_"+workinDirectory] = "active"; // sillyhack to set "active" sidebar item based on working directory

        const date = new Date(notifications[0]?.created ?? ""); //this will probably crash

        data["created"] = date.toDateString();
        data["body_text"] = notifications[0]?.body_text ?? "";
        data["title"] = notifications[0]?.title ?? "";

        const html = $template.loadFiles(
            `${__hooks}/views/${workinDirectory}/layout.html`,
            `${__hooks}/views/dashboard/navbar.html`,
            `${__hooks}/views/dashboard/sidebar.html`,
        ).render(data);

        const html2 = html.replaceAll("\&gt\;", ">").replaceAll("\&lt\;", "<").replaceAll("\&amp\;", "&"); // THIS IS ILLEGAL BUT WORKS FOR NOW

        // Once generated return the HTML contents
        return httpContext.html(200, html2);
    } catch(e) {
        console.log(e);
        return httpContext.html(404, '<h1>Sorry! page Not Found</h1>');
    }
}, $apis.requireAuth("users"));

// GET STUDENT DETAILS
//  
//  @param httpContext - echo.Context []
routerAdd("GET", "/_dist/student/details", (httpContext) => {
    
    // the view to be returned for the dashboard  will come from the query param 'wd' for 'working directory'
    const studentsId = httpContext.request.url.query().get("id");
    const record = $app.findRecordById("student", studentsId);
    const birthdate = new Date(record.get("birthdate").string().replace(" ", 'T'));
    const birthdateStr = birthdate.getFullYear() +'-'+ ('0' + (birthdate.getMonth()+1)).slice(-2) +'-'+ birthdate.getDate();
    // wrapped in try watch for any internal problem so that nothing get returned to client
    try {
        //generate templates base on working directory path
        const html = $template.loadFiles(
            `${__hooks}/views/details.html`
        ).render({
            "id": studentsId,
            "col": "student",
            "first_name": record.get("first_name"),
            "last_name": record.get("last_name"),
            "phone1": record.get("phone_number"),
            "birth_date": birthdateStr,
            "phone2": record.get("phone_number_2"),
            "address": record.get("address"),
            "city": record.get("city"),
            "state": record.get("state"),
            "postal_code": record.get("postal_code"),
            "email": record.email(),
            "sb_student": "active",
            "student_bool": "true",
            "parent1_first_name": JSON.parse(record.get("parent_1"))["first_name"],
            "parent1_last_name": JSON.parse(record.get("parent_1"))["last_name"],
            "parent1_phone": JSON.parse(record.get("parent_1"))["phone"],
            "parent1_email": JSON.parse(record.get("parent_1"))["email"],
            "parent2_first_name": JSON.parse(record.get("parent_2"))["first_name"],
            "parent2_last_name": JSON.parse(record.get("parent_2"))["last_name"],
            "parent2_phone": JSON.parse(record.get("parent_2"))["phone"],
            "parent2_email": JSON.parse(record.get("parent_2"))["email"]
        });
        // Once generated return the HTML contents
        return httpContext.html(200, html);
    } catch(e) {
        console.log(e);
        return httpContext.html(404, '<h1>Sorry! page Not Found</h1>');
    }
}, $apis.requireAuth("users"));



// GET TEACHER DETAILS
//  
//  @param httpContext - echo.Context []
//
//  * teacher. schedule:
//
// [
//   {
//     "classroom": "luy7iz275helf7y",
//     "day": "Monday",
//     "hour": "16:00-18:00"
//   },
//   {
//     "classroom": "2ea6ez2029afeiy",
//     "day": "Monday",
//     "hour": "18:00-20:00"
//   }
//   {
//     "classroom": "luy7iz275helf7y",
//     "day": "Tuesday",
//     "hour": "16:00-18:00"
//   }
// ]
routerAdd("GET", "/_dist/teacher/details", (httpContext) => {
    
    // the view to be returned for the dashboard  will come from the query param 'wd' for 'working directory'
    const teachersId = httpContext.request.url.query().get("id");
    const record = $app.findRecordById("teacher", teachersId);

    const scheduleArray = JSON.parse(record.get("schedule"))
    const birthdate= new Date(record.get("birthdate").string().replace(" ", 'T'));
    const birthdateStr = birthdate.getFullYear() +'-'+ ('0' + (birthdate.getMonth()+1)).slice(-2) +'-'+ birthdate.getDate();
    const scheduleMonday = scheduleArray.filter((v) => v.day === "Monday").map((v) => v.hour).join("| ");
    const scheduleTuesday = scheduleArray.filter((v) => v.day === "Tuesday").map((v) => v.hour).join("| ");
    const scheduleWednesday = scheduleArray.filter((v) => v.day === "Wednesday").map((v) => v.hour).join("| ");
    const scheduleThursday = scheduleArray.filter((v) => v.day === "Thursday").map((v) => v.hour).join("| ");
    const scheduleFriday = scheduleArray.filter((v) => v.day === "Friday").map((v) => v.hour).join("| ");
    const scheduleSaturday = scheduleArray.filter((v) => v.day === "Saturday").map((v) => v.hour).join("| ");
    const scheduleSunday = scheduleArray.filter((v) => v.day === "Sunday").map((v) => v.hour).join("| ");

    // wrapped in try watch for any internal problem so that nothing get returned to client
    try {
        //generate templates base on working directory path
        const html = $template.loadFiles(
            `${__hooks}/views/details.html`
        ).render({
            "id": teachersId,
            "col": "teacher",
            "first_name": record.get("first_name"),
            "last_name": record.get("last_name"),
            "birth_date": birthdateStr,
            "phone1": record.get("phone_number"),
            "phone2": record.get("phone_number_2"),
            "address": record.get("address"),
            "city": record.get("city"),
            "state": record.get("state"),
            "postal_code": record.get("postal_code"),
            "email": record.email(),
            "schedule_monday": scheduleMonday,
            "schedule_tuesday": scheduleTuesday,
            "schedule_wednesday": scheduleWednesday,
            "schedule_thursday": scheduleThursday,
            "schedule_friday": scheduleFriday,
            "schedule_saturday": scheduleSaturday,
            "schedule_sunday": scheduleSunday,
            "sb_student": "active"
        });
        // Once generated return the HTML contents
        return httpContext.html(200, html);
    } catch(e) {
        console.log(e);
        return httpContext.html(404, '<h1>Sorry! page Not Found</h1>');
    }
}, $apis.requireAuth("users"));

// GET CLASSROOM DETAILS
//  
//  @param httpContext - echo.Context []
routerAdd("GET", "/_dist/classroom/details", (httpContext) => {
    
    // the view to be returned for the dashboard  will come from the query param 'wd' for 'working directory'
    const classroomId = httpContext.request.url.query().get("id");
    const record = $app.findRecordById("classroom", classroomId);
    const studentsArray = $app.findRecordsByIds("student", record.get("students"));
    console.log("STUDENTS ARRAY: "+studentsArray);

    // wrapped in try watch for any internal problem so that nothing get returned to client
    try {
        //generate templates base on working directory path
        const html = $template.loadFiles(
            `${__hooks}/views/details.html`
        ).render({
            "id": classroomId,
            "col": "classroom",
            "students":studentsArray,
            "sb_classroom": "active",
            "classroom_bool": "true"
        });
        // Once generated return the HTML contents
        return httpContext.html(200, html);
    } catch(e) {
        console.log("error"+e);
        return httpContext.html(404, '<h1>Sorry! page Not Found</h1>');
    }
}, $apis.requireAuth("users"));
