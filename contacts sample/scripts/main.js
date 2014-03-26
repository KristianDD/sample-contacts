document.addEventListener("deviceready", onDeviceReady, false);

//Activate :active state
document.addEventListener("touchstart", function() {
}, false);

function onDeviceReady() {
	navigator.splashscreen.hide();
    var app = new Application();
	app.run();
}

function Application() {
}

Application.prototype = {
 
	run : function() {
		var that = this,
		buttonCreateContact = document.getElementById("createContactButton"),
		buttonFindContact = document.getElementById("findContactButton"),
		buttonCloneContact = document.getElementById("cloneContactButton");
        
		buttonCreateContact.addEventListener("click", function(){that.createContact.call(that)});
		buttonFindContact.addEventListener("click",  function(){that.findContact.call(that)});
		buttonCloneContact.addEventListener("click",  function(){that.cloneContact.call(that)});
	},
    
	setResults : function(value) {
		if (!value) {
			document.getElementById("result").innerHTML = "";
		}
		else {
			document.getElementById("result").innerHTML += value;
		}
	},
             
	clearResults : function() {
		document.getElementById("results").innerHTML = "";
	},

 
	createContact : function() {
        var that = this;
		that.setResults();
                 
		// This code will create a new contact, even if
		// you have already run this code. It will lose its reference
		// to the original contact, and retrieve a reference to a new one.
		// When you click the Delete Contact button, the code will delete only
		// the one contact referred to by the variable contact.
                 
		that.contact = navigator.contacts.create();
		var name = new ContactName();
		name.givenName = "John";
		name.familyName = "Smith";
		that.contact.name = name;
 
		// Create a single address for the contact.
		var addresses = [1];               
		var address = new ContactAddress();
		address.type = "Home";
		address.streetAddress = "12345 Smith St.";
		address.locality = "Smithville";
		address.region = "CA";
		address.postalCode = "99999";
		address.country = "United States of America";
		addresses[0] = address;
		that.contact.addresses = addresses;
   
		// Create three phone numbers for the contact.
		var phoneNumbers = [3];
		phoneNumbers[0] = new ContactField('work', '212-555-1212', false);
		phoneNumbers[1] = new ContactField('mobile', '530-555-1212', false);
		phoneNumbers[2] = new ContactField('home', '718-555-1212', true); // the preferred number
		that.contact.phoneNumbers = phoneNumbers;
                 
		// Create two emails for the contact.
		var emails = [2];
		emails[0] = new ContactField('home', 'john.smith@smith.com', false);
		emails[1] = new ContactField('work', 'john.smith@work.com', true);
		that.contact.emails = emails;
		that.contact.save( function(){that.onSaveSuccess.apply(that,arguments)},  function(){that.onSaveError.apply(that,arguments)});
	},
     
	onSaveSuccess : function(contact) {
        var that = this;
		that.setResults(
			"Contact saved successfully. Look in Address Book to view the contact:<br/>" +
			contact.name.givenName + " " + contact.name.familyName);
	},
 
	onSaveError : function(contactError) {
        var that = this;
		that.setResults("Save error = " + contactError.code);
	},
             
	findContact : function() {
		// Find all contacts containing the name Smith.
		// Once you have clicked the Create Contact button,
		// your contacts should contain at least one contact named Smith.
        var that = this,
            options = new ContactFindOptions();
		// Search for the name Smith, allowing multiple matches.
		var fields = ["displayName","name"];
		options.filter = "John";
		options.multiple = true;
		navigator.contacts.find(fields, function(){that.onFindSuccess.apply(that,arguments)}, function(){that.onFindFailure.apply(that,arguments)}, options);
	},
 
	onFindSuccess : function(contacts) {
        var that = this;
        
		that.setResults();
		// Display the results.
		that.setResults("Found " + contacts.length + " contact" + (contacts.length === 1 ? "." : "s."));
		for (var i = 0; i < contacts.length; i++) {
			var contact = contacts[i];
            var result = "<br/>Found: ";
            if(contact){
                if(contact.name && contact.name.givenName){
                    result += contact.name.givenName + " ";
                }
                if(contact.name && contact.name.familyName){
                    result += contact.name.familyName  + " ";    
                }
                if(contact.id){
                    result +="(id = " + contact.id + ")";
                }
            }
			that.setResults(result);
		}
	},
             
	onFindFailure : function(contactError) {
        var that = this;
        
		that.setResults("Find error = " + contactError.code);
	},
 
	cloneContact : function() {
        var that = this;
		that.setResults();
                 
		if (!that.contact) {
			that.setResults(
				"Contact hasn't yet been set." +
				"</br>Click 'Create New Contact' first.");
		}
		else {
			var clone = that.contact.clone();
			clone.name.givenName = "Jane";
			clone.emails[0].value = "jane.smith@smith.com";
                 
			that.setResults("Cloned contact:<br/>" +
					   "Name: " + clone.name.givenName + " " + clone.name.familyName + "<br/>" +
					   "Email: " + clone.emails[0].value + "<br/>" +
					   "Address: " + clone.addresses[0].streetAddress + "<br/>" +
					   "<br/>" +
					   "Note that the clone hasn't been saved, and won't appear in your address book."
			);                   
		}
	},
    
	contact:null
}