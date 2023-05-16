// We're creating a class that's globally accessible since it extends
// the js Error class. Extending means it inherits all the properties of the Error class
// super() calls the parent constructor right above it. 
// JavaScript requires us to call super in the child constructor, 
// so that’s obligatory. The parent constructor sets the message property.
// The parent constructor also sets the name property to "Error" by default,
// so then we reset it with this.name after in each class that we extend it with
class CustomAPIError extends Error{
    constructor(message){ // this says to constuct our new class with an additional property called "message"
        super(message) // This says to make our new classes property of "message" inherit the original classes "message" value
    }
}

export default CustomAPIError