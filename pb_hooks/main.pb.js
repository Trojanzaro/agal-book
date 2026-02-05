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
    
    //get notifications
    const notifications = []
    let records = $app.findAllRecords("notification");

    const notifCategories = ["info", "warning", "alert"];
    const notifBadges = ["badge rounded-pill bg-primary", "badge rounded-pill bg-warning text-dark", "badge rounded-pill bg-danger"];
    records.forEach(element => {
        
        notifications.push({
            "id": element.id,
            "title": element.get("title"),  
            "body_text": element.get("body_text"),
            "created": element.get("created"),
            "read": element.get("read"),
            "type": element.get("type"),
            "type_b": notifBadges[notifCategories.indexOf(element.get("type"))]
        })
    });

    notifications.sort((a, b) => {
        return new Date(b.created) - new Date(a.created);
    });

    // wrapped in try watch for any internal problem so that nothing get returned to client
    try {
        // retrieve all the localization strings
        const lang = httpContext.request.url.query().get("language") || "en";
        const localizationRecords = $app.findAllRecords("local_strings");

        const localizationMap = {};
        localizationRecords.forEach(r => {
            localizationMap[r.get("string_id")] = r.get(lang + "_text");
        });

        //generate templates base on working directory path
        const data = {}
        data["sb_"+workinDirectory] = "active"; // sillyhack to set "active" sidebar item based on working directory

        notifications.forEach((notif, index) => {
            data["notifications"] = notifications;
        });

        const html = $template.loadFiles(
            `${__hooks}/views/${workinDirectory}/layout.html`,
            `${__hooks}/views/dashboard/navbar.html`,
            `${__hooks}/views/dashboard/sidebar.html`,
        ).render({...data, ...localizationMap});

        // Once generated return the HTML contents
        return httpContext.html(200, html);
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
    const birthdateStr = birthdate.getFullYear() +'-'+ ('0' + (birthdate.getMonth()+1)).slice(-2) +'-'+ String(birthdate.getDate()).padStart(2,'0');

    // retrieve all the localization strings
    const lang = httpContext.request.url.query().get("language") || "en";
    const localizationRecords = $app.findAllRecords("local_strings");

    const localizationMap = {};
        localizationRecords.forEach(r => {
        localizationMap[r.get("string_id")] = r.get(lang + "_text");
    });


    let renderValues = {};
    // generate html template
    renderValues = {
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
        "student_bool": "true"
    };

    if(record.get("parent_1") !== ""){
        //get the parent1 details
        const parent1 = $app.findRecordById("customer", record.get("parent_1"));
        //add values to render table
        renderValues["parent1_first_name"] = parent1.get("first_name");
        renderValues["parent1_last_name"] = parent1.get("last_name");
        renderValues["parent1_phone"] = parent1.get("phone_number");
        renderValues["parent1_email"] = parent1.email();
        renderValues["parent1_address"] = parent1.get("address");
        renderValues["parent1_id"] = parent1.id;
    } 
    if(record.get("parent_2") !== ""){
        //get the parent2 details
        const parent2 = $app.findRecordById("customer", record.get("parent_2"));
        //add values to render table
        renderValues["parent2_first_name"] = parent2.get("first_name");
        renderValues["parent2_last_name"] = parent2.get("last_name");
        renderValues["parent2_phone"] = parent2.get("phone_number");
        renderValues["parent2_email"] = parent2.email();
        renderValues["parent2_address"] = parent2.get("address");
        renderValues["parent2_id"] = parent2.id;
    }

    // wrapped in try watch for any internal problem so that nothing get returned to client
    try {
        //generate templates base on working directory path
        
        const html = $template.loadFiles(
            `${__hooks}/views/details.html`
        ).render({...renderValues, ...localizationMap});
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
//     "classroom": "3o2ktfriv7jyeps",
//     "day": "Tuesday",
//     "hours": [
//       "16:00",
//       "19:00"
//     ]
//   },
//   {
//     "classroom": "3o2ktfriv7jyeps",
//     "day": "Thursday",
//     "hours": [
//       "18:00",
//       "19:00"
//     ]
//   }
// ]
routerAdd("GET", "/_dist/teacher/details", (httpContext) => {
    
    // the view to be returned for the dashboard  will come from the query param 'wd' for 'working directory'
    const teachersId = httpContext.request.url.query().get("id");
    const record = $app.findRecordById("teacher", teachersId);

    const scheduleArray = JSON.parse(record.get("schedule")) || [];
    const birthdate= new Date(record.get("birthdate").string().replace(" ", 'T'));
    const birthdateStr = birthdate.getFullYear() +'-'+ ('0' + (birthdate.getMonth()+1)).slice(-2) +'-'+ String(birthdate.getDate()).padStart(2,'0');


    // retrieve all the localization strings
    const lang = httpContext.request.url.query().get("language") || "en";
    const localizationRecords = $app.findAllRecords("local_strings");

    const localizationMap = {};
        localizationRecords.forEach(r => {
        localizationMap[r.get("string_id")] = r.get(lang + "_text");
    });

    scheduleArray.forEach((session) => {
        const classroomRecord = $app.findRecordById("classroom", session["classroom"]);
        session["classroom_name"] = classroomRecord.get("name");
        session["classroom_id"] = session["classroom"]
    });

    console.log("scheduleArray", JSON.stringify(scheduleArray));
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
            "schedule": JSON.stringify(scheduleArray),
            "sb_student": "active",
            ...localizationMap
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

    // teacher with dummy data in case of error
    const dummyCollection = $app.findCollectionByNameOrId("teacher");

    let teacherRecord = new Record(dummyCollection);

    try {
        teacherRecord = $app.findRecordById("teacher", record.get("teacher"));
    } catch(e) {   
        console.log("error"+e);
        teacherRecord.set("first_name", "N/A");
        teacherRecord.set("last_name", "N/A");
    }
    console.log("teacherRecord", teacherRecord);
    const assignments = $app.findRecordsByFilter("assignment","classroom='"+classroomId+"'");

    // retrieve all the localization strings
    const lang = httpContext.request.url.query().get("language") || "en";
    const localizationRecords = $app.findAllRecords("local_strings");

    const localizationMap = {};
        localizationRecords.forEach(r => {
        localizationMap[r.get("string_id")] = r.get(lang + "_text");
    });

    // wrapped in try watch for any internal problem so that nothing get returned to client
    try {
        //generate templates base on working directory path
        const html = $template.loadFiles(
            `${__hooks}/views/details.html`
        ).render({
            "id": classroomId,
            "classroom_name": record.get("name"),
            "assigned_teacher": teacherRecord.get("first_name")+" "+teacherRecord.get("last_name"),
            "assigned_teacher_id": teacherRecord.id,
            "room": record.get("room"),
            "col": "classroom",
            "students":studentsArray,
            "assignments": assignments,
            "sb_classroom": "active",
            "classroom_bool": "true",
            "classroom_id": classroomId,
            "level": record.get("level"),
            "fee": record.get("fee"),
            ...localizationMap
        });
        // Once generated return the HTML contents
        return httpContext.html(200, html);
    } catch(e) {
        console.log("error"+e);
        return httpContext.html(404, '<h1>Sorry! page Not Found</h1>');
    }
}, $apis.requireAuth("users"));

// GET STUDENTPROFILE
//  
//  @param httpContext - echo.Context []
routerAdd("GET", "/_dist/student/profile", (httpContext) => {
    
    // the view to be returned for the dashboard  will come from the query param 'wd' for 'working directory'
    const classroomId = httpContext.request.url.query().get("id");
    const record = $app.findRecordById("classroom", classroomId);
    const studentsArray = $app.findRecordsByIds("student", record.get("students"));

    // teacher with dummy data in case of error
    const dummyCollection = $app.findCollectionByNameOrId("teacher");

    let teacherRecord = new Record(dummyCollection);

    try {
        teacherRecord = $app.findRecordById("teacher", record.get("teacher"));
    } catch(e) {   
        console.log("error"+e);
        teacherRecord.set("first_name", "N/A");
        teacherRecord.set("last_name", "N/A");
    }
    console.log("teacherRecord", teacherRecord);
    const assignments = $app.findRecordsByFilter("assignment","classroom='"+classroomId+"'");

    // retrieve all the localization strings
    const lang = httpContext.request.url.query().get("language") || "en";
    const localizationRecords = $app.findAllRecords("local_strings");

    const localizationMap = {};
        localizationRecords.forEach(r => {
        localizationMap[r.get("string_id")] = r.get(lang + "_text");
    });

    // wrapped in try watch for any internal problem so that nothing get returned to client
    try {
        //generate templates base on working directory path
        const html = $template.loadFiles(
            `${__hooks}/views/details.html`
        ).render({
            "id": classroomId,
            "classroom_name": record.get("name"),
            "assigned_teacher": teacherRecord.get("first_name")+" "+teacherRecord.get("last_name"),
            "assigned_teacher_id": teacherRecord.id,
            "room": record.get("room"),
            "col": "classroom",
            "students":studentsArray,
            "assignments": assignments,
            "sb_classroom": "active",
            "classroom_bool": "true",
            "classroom_id": classroomId,
            "level": record.get("level"),
            "fee": record.get("fee"),
            ...localizationMap
        });
        // Once generated return the HTML contents
        return httpContext.html(200, html);
    } catch(e) {
        console.log("error"+e);
        return httpContext.html(404, '<h1>Sorry! page Not Found</h1>');
    }
}, $apis.requireAuth("users"));

//////////
// router get assignment file
routerAdd("GET", "/_dist/assignment/file", (httpContext) => {
    
    // the view to be returned for the dashboard  will come from the query param 'wd' for 'working directory'
    const assignmentId = httpContext.request.url.query().get("id");
    const record = $app.findRecordById("assignment", assignmentId);

    const fileName = record.get("attachment");
    const fileKey = record.baseFilesPath() + "/" + record.get("attachment");
    const fullPath = "pb_data/storage/" + fileKey;
    
    let fsys, reader, content;

    try {
          fsys = $app.newFilesystem();

        // READ AS BYTES (not reader)
        const bytes = $os.readFile(fullPath);

        httpContext.response.header().set(
            "Content-Disposition",
            `inline; filename="${fileName}"`
        );

        httpContext.response.header().set(
            "Content-Type",
            "application/octet-stream"
        );

        // Write bytes
        httpContext.response.write(bytes);
        return;
    } finally {
        reader?.close();
        fsys?.close();
    }
});

//////////
