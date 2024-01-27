# agal-book
A brutally simple CMS system with Go based backend and a frontend written in HTML JavaScript, CSS (bootstrap) htmx
+ [Pocketbase](https://pocketbase.io/), lightweight-**BaaS**: auth inc. [Oauth2](https://datatracker.ietf.org/doc/html/rfc6749).
+ [htmx](https://htmx.org/) : -> HTML, CSS, JavaScript [Bootstarp 5](https://getbootstrap.com/docs/5.3/getting-started/introduction/).



## Idea
The idea is that a simple and small - medium size application should at have some basic tools to allow for a user experience that involves:


+ CURD operations on a give *data model* <br/>including but not limited to:<br/>
- [x] Auth: User authentication to apply RBAC rule on Tables
- [ ] Tables: Data Model, allowing us to `CREATE, UPDATE, READ, DELETE` tables/lists/[collections](https://pocketbase.io/docs/collections/) (for our case)
- [ ] SDK/Tooling/development: creating a basic documentation that will contain the schema/flow for developing a simple MVC web-application with good ol' HTML


## Installation


### Pocketbase
Contained in the project directory is that main **requirements** for pocketbase
``` shell
./
 /pocketbase # - pocketbase binary, to be replaced with latest version of pocketbase binary
/pb_data # - copntainsstores your application data, uploaded files, etc. (in .gitignore)
 /pb_migrations # - contains JS migration files with your collection changes (can be safely committed in your repository).
 /pb_hooks # contains the JS/Go code that can run on pocketbases bin as a backend
You can even write custom migration scripts. For more info check the JS migrations [docs](https://pocketbase.io/docs/js-migrations).
```


For the installation process you need to:


1. **Clone** the repository locally to your local machine
```shell
$ git clone https://github.com/Trojanzaro/agal-book.git
$ cd agal-book
```
In this folder you can edit and change any file, modifying the `./index.html` will be modifying the **main entry point** <br /><br /> Basically the main .html file from where you can run your application, serve you index.html

2. **Download** PocketBase from their official [GitHub Releases page](https://github.com/pocketbase/pocketbase/releases) (make sure you get the correct **bin**). <br /> <br />You extract from the `pocketbase_**ver**.zip` the `pocketbase` executable<br /> this is the Go written single executable that runs the entire backend, from Authentication/Authorization,Database,File upload/Server Side Code
```shell
 #!/example:

 pocketbase_0.21.1_linux_amd64.zip/
 /README.md
 /LICENSE.md
 /pocketbase # <-- The pocketbase executable! The file we need

```


3. **Installing** pocketbase


Simply **copy** and **REPLACE** the newly downloaded/extracted `pocketbase` executable to the main project folder `./`
```shell
 # drwxr-xr-x 2 usr usr 4096 Ιαν 17 23:06 dist
 # -rw-r--r-- 1 usr usr 2947 Ιαν 23 23:11 index.html
 # drwxr-xr-x 2 usr usr 4096 Ιαν 23 23:08 js
 # -rw-r--r-- 1 usr usr 1497 Ιαν 23 04:31 LICENSE
 # -rw-r--r-- 1 usr usr 90212 Ιαν 23 04:20 login_logo.jpg
 # -rw-r--r-- 1 usr usr 37227 Ιαν 19 05:01 logo.png
 # drwxr-xr-x 3 usr usr 4096 Ιαν 27 00:32 pb_data
 # drwxr-xr-x 3 usr usr 4096 Ιαν 22 21:34 pb_hooks
 # drwxr-xr-x 2 usr usr 4096 Ιαν 23 19:14 pb_migrations


 -rwxr-xr-x 1 usr usr 47833088 Ιαν 16 11:02 pocketbase


# -rw-r--r-- 1 usr usr 3046 Ιαν 27 02:14 README.md
 # -rw-r--r-- 1 usr usr 15116 Ιαν 19 05:12 user_profile.png
```


4. **Setup** Your admin account. <br/>In following the instruction from the official [pocketbase documentation on installation](https://pocketbase.io/docs/#:~:text=Once%20you%27ve%20extracted,pocketbase%20%5Bcommand%5D%20%2D%2Dhelp)
it mentions that there is no need for Administrator setup.<br/> THe command  to run the back end is `./pocketbase server --dev`<br/>
```shell
$ cd agal-book
$ pwd
/home/usr/agal-book
$ ./pocketbase serve --dev # --dev flag for debug logs
```
**HOWEVER**, Given that the circumstances require that a administrator needs to delete, update or create a new admin accoun , you can still you se the `./pocketbase admin create, ./pockebase admin update ./pocketbase admin delete` for more infoamrtion 
You could find all available commands and their options by running `./pocketbase --help` or `./pocketbase [command] --help`


## UI/Ux/Ud


Information about the User Interface/experience/design/development


## HTML, CSS, JS
- [ ] [Bootstarp 5](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [ ] JavaScript: Model, controller,etc
- [ ] htmx: State Management


## GitFlow


<picture>
<img src="https://raw.githubusercontent.com/Trojanzaro/agal-book/doc-img-ex/git_flow.drawio.svg"/>
</picture>
