import firebaseConfig from "./firebaseConfig";

import {initializeApp, onLog} from 'firebase/app';

import {getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc} from 'firebase/firestore';

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
		console.log(snapshot);
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