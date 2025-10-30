// Louise Bruwer


//Step 1: Variables

var name = document.getElementById("nameField");
var surname = document.getElementById("surnameField");
var email = document.getElementById("emailField");
var number = document.getElementById("cellNumField");
var date = document.getElementById("dateField");
var password1 = document.getElementById("passField1");
var password2 = document.getElementById("passField2");
var button = document.getElementById("formSubmit");

var validName: false;
var validSurname: false;
var validEmail: false;
var validCellNum: false;
var validDate: false;
var validPass1: false;
var validPass2: false;

//Step 2: Button-onclick

if (name.value.trim() === ""){
	validName = false;
	document.getElementById("ErrorMessage").textContent = "Make sure all form fields are filled in and valid"
}
else
{
	validName = true;
}


if (surname.value.trim() === ""){
	validSurname = false;
	document.getElementById("ErrorMessage").textContent = "Make sure all form fields are filled in and valid"
}
else
{
	validSurname = true;
}


if (email.value.trim() === ""){
	validEmail = false;
	document.getElementById("ErrorMessage").textContent = "Make sure all form fields are filled in and valid"
}
else
{
	validEmail = true;
}


if (number.value.trim() === ""){
	validCellNum = false;
	document.getElementById("ErrorMessage").textContent = "Make sure all form fields are filled in and valid"
}
else
{
	validCellNum = true;
}


if (password1.value.trim() === ""){
	validPass1 = false;
	document.getElementById("ErrorMessage").textContent = "Make sure all form fields are filled in and valid"
}
else
{
	validPass1 = true;
}


if (password2.value.trim() === ""){
	validPass2 = false;
	document.getElementById("ErrorMessage").textContent = "Make sure all form fields are filled in and valid"
}
else
{
	validPass2 = true;
}


if (date.value.trim() === ""){
	validDate = false;
	document.getElementById("ErrorMessage").textContent = "Make sure all form fields are filled in and valid"
}
else
{
	validDate = true;
}

//Step 3: onblur (Name)

name.onblur = function(){
	if (console.log(name.length) > 1){
		validName = true;
	}
	else
	{
		validName = false;
	}
}

//Step 4: onblur (Surname)

surname.onblur = function(){
	if (console.log(surname.length) > 1){
		validSurname = true;
	}
	else
	{
		validName = false;
	}
}

//Step 5: onblur (Email)

email.onblur = function(){
	if (email.value.includes("@") && email.value.includes(".")){
		validEmail = true;
	}
	else
	{
		validEmail = false;
	}
}

//Step 6: onblur (Phone Number)

number.onblur = function(){
	if (number.length === 10 && number[0] === "0" && number[1] !== "0"){
		validCellNum = true
	}
	else
	{
		validCellNum = false;
	}
}

//Step 7: onblur (Pass1)

password1.onblur = function() {
	if(console.log(password1.length) >= 8){
		validPass1 = true;
	}
	else
	{
		validPass1 = false;
	}
}

//Step 8: onblur (Pass2)

password2.onblur = function(){
	if (password2.value === validPass1 && validPass1.value !== ""){
		validPass2 = true;
	}
	else
	{
		validPass2 = false;
	}
}

//Step 9: onblur (Date)

date.onblur = function(){
	var selectedDate = new Date(date.value);
	var currentDate = new Date();
	var ageLimitDate = new Date(currentDate.getFullYear() - 13, currentDate.getMonth(), currentDate.getDate());

	if (date.value === ""){
		validDate = false;
	}

	if ((currentDate - ageLimitDate) >= "13"){
		validDate = true;
	}
	else
	{
		validDate = false;
	}
}