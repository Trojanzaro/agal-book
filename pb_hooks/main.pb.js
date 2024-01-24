// routerAdd("GET", "/hello/:name", (c) => {

//     // const admin = c.get("admin")      // empty if not authenticated as admin
//     // const record = c.get("authRecord") // empty if not authenticated as regular auth record

//     // // alternatively, you can also read the auth state form the cached request info
//     // const info = $apis.requestInfo(c);
//     // const admin = info.admin;      // empty if not authenticated as admin
//     // const record = info.authRecord; // empty if not authenticated as regular auth record

//     // const isGuest = !admin && !record

//     let name = c.pathParam("name")
//     let template  = '<h1>HELLO!: </h1>' + name + ', <br/>Nice to meet ya!<br/><br/>Are you a bAAAAAAAAAAAAaaaaaadddd: ' + name
//     console.log(template)

//     return c.html(200, template)
// }, /* optional middlewares */)


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

//GET DASHBOARD
routerAdd("GET", "/_dist/dashboard", (c) => {
    

    //generate templates
    const html = $template.loadFiles(
        `${__hooks}/views/dashboard/layout.html`
    ).render()

    return c.html(200, html);
}, $apis.requireRecordAuth("users"));


//////////////
// API
//////////////


//GET DASHBOARD
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