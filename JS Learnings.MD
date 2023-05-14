# JS Learnings
## Imports & Exports
### Export
- you can export any variable, function with 
``` js
"export { blah }"
```
- you can import that variable into another file with 
``` js
"import {blah}"
```

### Export default
- You only get one of these per file and because it's the only one, the name doesn't matter. Its the default import so it doesn't need to be specifiedtreated like a variable. You can export it with 
```js
"export default blah"
```
- You can import it with 
``` js
"import blah"
```
- So no { } are required around the thing because it's the ONLY one default and thus name doesn't matter


## Index.js files
index.js files are specially read by the reac.js language such that when you import something from a folder, if no file is specified it will automatically look for the index.js file name

## ESD6
When using node.js, need to specify the ".js" part of the file name when importing files. Not when importing libraries though

## import 'express-async-errors'
this library comes with built in magic functionality where any "throw Error" in our server will automatically look for the last app.use middleware and by default will pass in the "thrown Errors" to this middleware.
This means we don't need to have any
``` js
    try {
    } catch (error) {
        next(error) //next means leave the loop and go to the next part of the code
    }
```
blocks in our controllers. Instead, if any Error happens in the server OR if we do "throw" an Error with something like
``` js
    throw new Error("please provide all values")
```
the express-async-errors will route it to that last app.use(middleware) that we setup in the server.js file

## Error Default Class
By default, the Error class of js takes the first argument
and assigns it to the "message" property.
``` js
throw new Error("please provide all values")
```
so the value of Error.message = "please provide all values" now.

## Extending Classes
You can inherit the properties of a class with this method:
``` js
class CustomAPIError extends Error{
    constructor(message){ // this says to constuct our new class with an additional property called "message"
        super(message) // This says to make our new classes property of "message" inherit the original classes "message" value
    }
}
```
We're creating a class that's globally accessible since it extends the js Error class. Extending means it inherits all the properties of the Error class
super() calls the parent constructor right above it. 
JavaScript requires us to call super in the child constructor,  so that’s obligatory. The parent constructor sets the message property.
The parent constructor also sets the name property to "Error" by default, so then we reset it with this.name after in each class that we extend it with

## Mongoose Model Methods
Mongoose comes with tons of handy api methods that are available for any Model you create such as "Create", "FindOne", "FindById", etc. 
These are all different pre-defined methods for how to interact with the db for a given request
They also come with responses. Either json formatted data you can assign to an object or an error.

## Mongoose Custom Model Methods
You can also add custom methods to a model by defining them like this in the model file
``` js
UserSchema.methods.createJWT = function () {
    console.log(this)
    return jwt.sign({userId:this._id}, process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}
```
Then you can make you can call this from the controller to perform some additional action

## Running Server & Client
The "scripts" part of package.json file defines what npm commands are available and what they do. Usually to run a command you need to type
``` bash
npm run <command>
```
However the "start" command is a special one that just needs "npm start"
You can use the library called "connectivity" to embed commands within the "npm start" commands such that invoking it executes other commands defined in the script. It would look like this for example
``` json
  "scripts": {
    "server": "nodemon server --ignore client", //don't restart server if client restarts
    "client": "npm start --prefix client", // run this from in the client directory
    "start": "concurrently --kill-others-on-fail \"npm run server\" \"npm run client\"" //if anything running fails, stop everything
  },
```
## Server API access
By default, our APIs to the DB are only accessible by an application running on the server that's hosting them. So our front end on port 3000 can't access the APIs running on our server on port 5001.

At a basic level this is fair since you'd only want a user logged into the application to be able to get/change data. But to let the front end application access the API's we need to add them with a Proxy. Same is true for any other servers we have running as part of the application (maybe a backend server populating the database)

If you want to allow other places to access the APIs, you'd probably want to do it with some sort of authentication built into the requests so you know it's still not available to anyone (see someone elses data)

## Proxying
You can setup a proxy in the package.json of a server or client. This will give it an alternative server to route things to/from if there route specified does not exist. 

So on the client, we proxy to the server so that when we request data to the api, it will fail to find the route on the cleint (sicne we of course didn't set it up) and then will figure out to route it to the server to that route

This only works during devleopment. In production you need to figure out with the hosting platofrm how to connect the 2 servers together.

## State in React
Its not persisted between page refreshes. Instead, we need to save the state to Local Storage and re-grab it from there on each refresh.

This is what allows us to keep a user logged in after refreshing or probably even after leaving the site completely and coming back within the time that we maintain the state in the local storage (won't be forever). In our case we set the JWT_LIFETIME to be 1d.

## Async + Await
### Async functions
Async functions are needed when you are doing things that can take time and you don't want the code in the function to go in series. So by adding the code to an async function, you add it to the event loop of JS so that it will execute but JS can continue to read through other parts of the code next while it waits for the response

The async keyword before a function has two effects:
- Makes it always return a promise.
- Allows await to be used in it.

## Await Expression
Await expressions make promise-returning functions behave as though they're synchronous by suspending execution until the returned promise is fulfilled or rejected. The resolved value of the promise is treated as the return value of the await expression. 

Let’s emphasize: await literally suspends the function execution until the promise settles, and then resumes it with the promise result. That doesn’t cost any CPU resources, because the JavaScript engine can do other jobs in the meantime: execute other scripts, handle events, etc.

The await keyword before a promise makes JavaScript wait until that promise settles, and then:
- If it’s an error, an exception is generated — same as if throw error were called at that very place.
- Otherwise, it returns the result.

### Combined
When an sync funciton is called, it gets control of the event loop, since it's called. This is a synchronous action. Foo will run through it's lines at that point synchronously. If it finishes everything, control is then returned back to where foo was called from. However, its likely that if we're using an async function, it's because there's some async action we intended to do with it.

Here's an example event sequence from an async function with await promises:
1. In foo, if an Await command is hit, progress through foo is then suspended and control is yielded back to the function that called foo until the await command returns a response.
2. Some time later, when first promise from this await has either been fulfilled or rejected, control moves back into foo.
3. Progress continues, and the second await expression is evaluated. Again, progress through foo is suspended and control is yielded.
4. Some time later, when the second promise has either been fulfilled or rejected, control re-enters foo. Control moves to the return expression (if any). The default return value of undefined is returned as the resolution value of the current promise.
``` js
async function foo(url) {
  let v;
  try {
    v = await downloadData(url);
  } catch (e) {
    v = await downloadFallbackData(url);
  }
  return processDataInWorker(v);
}
foo(url);
```

## Try / Catch
This gives a method to handle rejections on await promises by allowing the async function to throw an error in the catch.

If a promise resolves normally, then await promise returns the result. But in the case of a rejection, it throws the error, just as if there were a throw statement at that line.
This code:
``` js
async function f() {
  await Promise.reject(new Error("Whoops!"));
}
```
…is the same as this:
``` js
async function f() {
  throw new Error("Whoops!");
}
```
In real situations, the promise may take some time before it rejects. In that case there will be a delay before await throws an error. We can catch that error using try..catch, the same way as a regular throw:
``` js
async function f() {

  try {
    let response = await fetch('http://no-such-url');
  } catch(err) {
    alert(err); // TypeError: failed to fetch
  }
}
f();
```
In the case of an error, the control jumps to the catch block. We can also wrap multiple lines:
``` js
async function f() {

  try {
    let response = await fetch('/no-user-here');
    let user = await response.json();
  } catch(err) {
    // catches errors both in fetch and response.json
    alert(err);
  }
}
f();
```
If we don’t have try..catch, then the promise generated by the call of the async function f() becomes rejected. We can append .catch to handle it:
``` js
async function f() {
  let response = await fetch('http://no-such-url');
}
// f() becomes a rejected promise
f().catch(alert); // TypeError: failed to fetch // (*)
```
If we forget to add .catch there, then we get an unhandled promise error (viewable in the console). We can catch such errors using a global unhandledrejection event handler as described in the chapter [Error handling with promises](https://javascript.info/promise-error-handling).

##NavLink vs Link
Navlink is used to create links which allow to navigate to different URLs without reloading the page. NavLink is a special version of the Link that will also add styling attributes to the rendered element when it matches the current URL.

##[JWT Bearer Auth](https://jwt.io/introduction)
To make an API endpoint restricted to only authorized users, we used JSON auth tokens. This works by checking in the response from an endpoint that the json web token is in the Authorization Header field. If there is no token in the response, we throw an AuthError.

### During Testing
1. We add a Test to the Login/Register endpoints to add the token globally to the token variable
2. The endpoints are configured to check for the authoriation token according to the token type/structure we setup for them. In our case we use "Bearer Token" --> {{token}}
3. Now when we use any endpoint in PM, the token that we had previously used the login/register endpoint is stored in the global token variable that each endpoint is using to define the token for it's call. 

### From Web App requests
The JWT is originally generated by a function we setup in a custom method in the Model for that database collection such that it's returned in the response when that method is called. The token is added to the Authorization header of our requests in the appContext via an Interceptor. The axios interceptor is like a middlewear that is activated each time axios is called to send a request and return a response. We add the token in the specified format of Bearer {token} to the headers.authorization element. In this way, the request can be checked in our controller for a valid authorization header value before it sends it to the database. This is actually done in our Auth.js middleware which we attach to whichever controllers we want to have this authentication check performed (not login or register since point is that they're not logged in yet)

The check that's performed in the auth.js file is
1. The token is of a format/value that could be generated from our JWT secret
2. The token was generated within the JWT_Lifetime
If either check fails, then a 401 response is returned and we can take an action like display the error or log the user out on the front end

## Axios Interceptors
Allow us to set common things to all request and responses made in axios. This includes a base url, a header to add to all requests and an action based on a given response (logout for unathenticated errors)

## Building New Functionality
When making new functionality for the app, you need to add it in both the front end and the back end. Here's the recommended order of operations to do this with:
Backend:
1. Create the model
2. Create the routes
3. Create/Update the functions in the controller
4. Test errors and responses in Postman
5. Add the first level variable from the response to the appContext state variables
App Context:
1. For each action that should happen on the page, add a begin and success action
2. For each begin/success action, add a function in the reducer
3. For each action, add a function in teh appContext and export it.
Front End:
1. Add a blank page for it on the front end
2. Add a blank componenet for each element of the page
3. 

## CSS Styling Components
With Wrappers, or any CSS, you can include variables in the styling code so that you can do things like make the color of something a variable. For example, like this. In the js for the component you'd do this:
``` js
import Wrapper from '../assets/wrappers/StatItem';

const StatItem = ({ count, title, icon, color, bcg }) => {
    return (
        <Wrapper color={color} bcg={bcg}>
            <header>
                <span className="count">{count}</span>
                <span className="icon">{icon}</span>
            </header>
            <h5 className='title'>{title}</h5>
        </Wrapper>
    )
}
```
then in the Wrapper, it would look like this:
```js
import styled from 'styled-components'

const Wrapper = styled.article`
  padding: 2rem;
  background: var(--white);
  border-radius: var(--borderRadius);
  border-bottom: 5px solid ${(props) => props.color};
  .icon {
    width: 70px;
    height: 60px;
    background: ${(props) => props.bcg};
    svg {
      font-size: 2rem;
      color: ${(props) => props.color};
    }
  }
`
export default Wrapper
```

## Req.query
The req.query is automatically populated by axios with the data that is sent as parameters in the url. So for example, this request will have this req.query data:
```js
let url = `/bets?betSource=${searchSource}&eventCategory=${searchCategory}&oddsMaker=${searchOddsMaker}&pick=${searchPick}&betStatus=${searchStatus}&sort=${sort}`
const response = await authFetch.get(url);
```
```json
{
   "betSource": "all",
   "eventCategory": "MLB",
   "oddsMaker": "all",
   "pick": "all",
   "betStatus": "all",
   "sort": "newest",
   "search": "as"
 }
```
