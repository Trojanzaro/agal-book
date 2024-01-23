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
}, $apis.requireRecordAuth("users", "admin"));