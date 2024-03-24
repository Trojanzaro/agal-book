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
    const workinDirectory = httpContext.queryParam("wd")
    httpContext.response().header().set("Hx-Trigger", "loginAccept")
    // wrapped in try watch for any internal problem so that nothing get returned to client
    try {
        //generate templates base on working directory path
        const data = {}
        data["sb_"+workinDirectory] = "active";

        const html = $template.loadFiles(
            `${__hooks}/views/${workinDirectory}/layout.html`,
            `${__hooks}/views/dashboard/navbar.html`,
            `${__hooks}/views/dashboard/sidebar.html`,
        ).render(data);
        console.log(html)
        // Once generated return the HTML contents
        return httpContext.html(200, html);
    } catch(e) {
        console.log(e)
        return httpContext.html(404, '<h1>Sorry! page Not Found</h1>');
    }
}, $apis.requireRecordAuth("users"));

// GET STUDENT DETAILS
//  
//  @param httpContext - echo.Context []
routerAdd("GET", "/_dist/details", (httpContext) => {
    
    // the view to be returned for the dashboard  will come from the query param 'wd' for 'working directory'
    const studentsId = httpContext.queryParam("id");
    console.log("id", studentsId)
    const record = $app.dao().findRecordById("student", studentsId);
    console.log(record.get("first_name"))
    // wrapped in try watch for any internal problem so that nothing get returned to client
    try {
        //generate templates base on working directory path
        const html = $template.loadFiles(
            `${__hooks}/views/students/details.html`
        ).render({
            "first_name": record.get("first_name"),
            "last_name": record.get("last_name"),
            "phone1": record.get("phone_number"),
            "phone2": record.get("phone_number_2"),
            "address": record.get("address"),
            "city": record.get("city"),
            "state": record.get("state"),
            "postal_code": record.get("postal_code"),
            "email": record.email(),
            "sb_student": "active"
        });
        console.log(html)
        // Once generated return the HTML contents
        return httpContext.html(200, html);
    } catch(e) {
        console.log(e)
        return httpContext.html(404, '<h1>Sorry! page Not Found</h1>');
    }
}, $apis.requireRecordAuth("users"));