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
    
    // wrapped in try watch for any internal problem so that nothing get returned to client
    try {
        //generate templates base on working directory path
        const html = $template.loadFiles(
            `${__hooks}/views/${workinDirectory}/layout.html`
        ).render()

        // Once generated return the HTML contents
        return httpContext.html(200, html);
    } catch(e) {
        return httpContext.html(404, '<h1>Sorry! page Not Found</h1>');
    }
}, $apis.requireRecordAuth("users"));


//////////////
// API
//////////////


//GET STUDENTS API
routerAdd("GET", "/_coll/students/records", (c) => {
    let returnString = []
    const result = arrayOf(new DynamicModel({
        // describe the shape of the data (used also as initial values)
        "id":     "",
        "first_name": "",
        "last_name":"",
        "birthdate": "",
        "phone_number":"",
        "roles":  [], // serialized json db arrays are decoded as plain arrays
    }))
    $app.dao().db()
        .newQuery("SELECT * FROM student LIMIT 100")
        .all(result) // throw an error on db failure

    for(let i=0; i<result.length; i++) {
        returnString = [returnString, 
        "<tr>",
            "<td>",result[i].first_name,"</td>",
            "<td>",result[i].last_name,"</td>",
            "<td>",result[i].birthdate,"</td>",
            "<td>",result[i].phone_number,"</td>",
        "</tr>"
        ].join("")
    }
    return c.html(200, returnString);
}, $apis.requireRecordAuth("users"));

//GET TEACHERS API
routerAdd("GET", "/_coll/teachers/records", (c) => {
    let returnString = []
    const result = arrayOf(new DynamicModel({
        // describe the shape of the data (used also as initial values)
        "id":     "",
        "first_name": "",
        "last_name":"",
        "birthdate": "",
        "phone_number":"",
        "roles":  [], // serialized json db arrays are decoded as plain arrays
    }))
    $app.dao().db()
        .newQuery("SELECT * FROM teacher LIMIT 100")
        .all(result) // throw an error on db failure

    for(let i=0; i<result.length; i++) {
        returnString = [returnString, 
        "<tr>",
            "<td>",result[i].first_name,"</td>",
            "<td>",result[i].last_name,"</td>",
            "<td>",result[i].birthdate,"</td>",
            "<td>",result[i].phone_number,"</td>",
        "</tr>"
        ].join("")
    }
    return c.html(200, returnString);
}, $apis.requireRecordAuth("users"));