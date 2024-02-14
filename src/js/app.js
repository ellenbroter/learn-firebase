import firebaseConfig from "./firebaseConfig";

import {initializeApp, onLog} from 'firebase/app';

import {getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc} from 'firebase/firestore';
import {getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';

// INITIALIZE FIREBASE
initializeApp(firebaseConfig);

// CONNECT TO THE DATABASE ON FIREBASE
const database = getFirestore();

// CONNECT TO THE TRAINERS' COLLECTION
const trainersCollection = collection(database, 'trainers');

// ADD TRAINERS TO THE COLLECTION
const firstname = document.querySelector('.firstname')
const lastname = document.querySelector('.lastname')
const birthYear = document.querySelector('.birthyear')
const addTrainersForm = document.querySelector('.add-trainers-form')

addTrainersForm.addEventListener('submit', (e)=>{
	e.preventDefault();
	const newTrainer = {
		firstname: firstname.value,
		lastname: lastname.value,
		birthyear: birthYear.value
	}
	addDoc(trainersCollection, newTrainer)
	.then(()=> {
		console.log('Trainer has been added to the collection');
		addTrainersForm.reset();
	})
	.catch(err => console.log(err.message))
})


// DELETE DOCUMENTS FROM THE COLLECTION

const deleteID = document.querySelector('.delete-ID');
const deleteButton = document.querySelector('.delete-trainer-button');

deleteButton.addEventListener('click', (e)=>{
	e.preventDefault();
	const docToDelete = doc(database, 'trainers', deleteID.value);
	deleteDoc(docToDelete)
	.then(()=> {
		console.log('Trainer has been deleted from the collection');
		deleteID.value = '';
	})
	.catch(err => console.log(err.message))
})


// FETCHING TRAINERS FROM THE COLLECTION
onSnapshot(trainersCollection, (snapshot)=>{
	const trainersArray = [];
	snapshot.docs.forEach(doc => {
		trainersArray.push({id: doc.id, ...doc.data()})
	})
	console.log(trainersArray);
})


// UPDATE AN EXISTING DOCUMENT

const updateID = document.querySelector('.update-ID');
const updateButton = document.querySelector('.update-trainer-button');

updateButton.addEventListener('click', (e)=>{
	e.preventDefault();
	const docToUpdate = doc(database, 'trainers', updateID.value)
	updateDoc(docToUpdate, {
		firstname: 'updated firstname'
	})
	.then(()=>{
		console.log('Sucsessfully updated!');
		updateID.value = '';
	})
	.catch(err => console.log(err.message))
})



// PART 2 AUTTHENTICATION ----------------------------------------

// INITIALIZING THE AUTHENTICATION SERVICE
const authService = getAuth();

// SIGNING UP USERS
const email = document.querySelector('.email')
const password = document.querySelector('.password')
const signUpButton = document.querySelector('.sign-up-button')

const signUpUsers = ()=>{
	const userEmail = email.value;
	const userPassword = password.value;
	createUserWithEmailAndPassword(authService, userEmail, userPassword)
	.then((cred)=> {
		console.log('The account has been created successfully');
		console.log(cred);
	})
	.catch(err => console.log(err.message))
}

signUpButton.addEventListener('click', (e)=>{
	e.preventDefault();
	signUpUsers();
})


// SIGN OUT USERS

const signOutButton = document.querySelector('.sign-out-button');

const signOutUsers = ()=>{
	signOut(authService)
	.then(()=> console.log('You have successfully signed out'))
	.catch(err => console.log(err.message))
}

signOutButton.addEventListener('click', (e)=>{
	e.preventDefault();
	signOutUsers();
})


// LOGGING IN USERS
const signInButton = document.querySelector('.log-in-button')
const signInUsers = ()=>{
	const userEmail = email.value;
	const userPassword = password.value;
	signInWithEmailAndPassword(authService, userEmail, userPassword)
	.then(()=> {
		console.log('You have successfully logged in')
	})
	.catch(err => console.log(err.message))
}

signInButton.addEventListener('click', (e)=>{
	e.preventDefault();
	signInUsers()
})


// CHECK USERS AUTHENTICATION STATE
const checkUsersStatus = ()=>{
	const secretContent = document.querySelector('.secret-content');
	onAuthStateChanged(authService, user =>{
		if(user){
			secretContent.style.display = 'block';
		} else{
			secretContent.style.display = 'none';
		}
	})
}

checkUsersStatus();