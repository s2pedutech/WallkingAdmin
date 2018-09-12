import { Component, OnInit } from '@angular/core';

import { NavbarComponent } from '../../nav/navbar/navbar.component';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as firebase from 'firebase';

@Component({
  selector: 'app-raw-dashboard',
  templateUrl: './raw-dashboard.component.html',
  styleUrls: ['./raw-dashboard.component.css']
})
export class RawDashboardComponent implements OnInit {

    currentSection : string;
    fileName: any;
    searchString: string;
    refStudent = firebase.database().ref('student1');
    editStudent: boolean = false;
    students: any;
    studs: any;
    gender1: string = "Male";
newStudentForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl(''),
    mobno: new FormControl(''),
    amobno: new FormControl(''),
    dob: new FormControl(''),
    gender: new FormControl(''),
    uname: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    paddress: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl(''),
    key: new FormControl(''),
    imageUrl: new FormControl('')
    
});
uploadStudentImage(key)
{
    // upload the image to firebase storage
    console.log(key);
    var str = "student1/" + key;
    var uploadTask = firebase.storage().ref('student1/').put(this.fileName);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot:any) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Uploaded: " + progress + "%" );
    },
    () => {
        console.log("Unable to upload file on fb");
    },
    () => {
         uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
         console.log('File available at => ', downloadURL);
        this.newStudentForm.controls.imageUrl.setValue(downloadURL);
        firebase.database().ref(str).update(this.newStudentForm.value);
  });
    });
}
onFileChange(event)
{
    this.fileName = event.target.files[0];
    
}
cancel(){
    this.currentSection = "student";
    this.newStudentForm.reset();
}
saveStudent()
{
    console.log(this.newStudentForm.value);
    if(!this.editStudent)
    {
        
        this.createFirebaseUser();
    }
    else
        {
            var str = "student1/" + this.newStudentForm.controls.key.value;
            firebase.database().ref(str).update(this.newStudentForm.value);
        }
}
editStudentData(stu)
{
    this.editStudent = true;
    this.currentSection = "newStudent";
    this.newStudentForm.setValue(stu);
}
createFirebaseUser()
{
    // create a auth user in firebase
    var str = this.newStudentForm.controls.uname.value;
    str += "@gmail.com";
    firebase.auth().createUserWithEmailAndPassword(str, this.newStudentForm.controls.password.value).then(res => {
        // create an entry in db under students section
        var refStr = "student1/";
        
        var key = firebase.database().ref('student1/').push(this.newStudentForm.value);
        
        if(this.fileName != null)
        {
            this.uploadStudentImage(key);
        }
        
        
    }, err => {
        alert("Unable to create a user. Probably the username already exists");
    });
}

changeGender()
{
    if(this.gender1 == "Male")
    this.gender1 = "Female";
    else
        this.gender1 = "Male";
}
constructor() { 
    this.currentSection = "student";
}

addNewStudent()
{
    this.currentSection = 'newStudent';
}
searchStudent()
{
        //console.log(this.searchString);
        this.studs = this.students.filter(x => {
            return x.name.toLowerCase().includes(this.searchString.toLowerCase());
         });
    }
    showStudentsSection()
    {
        this.currentSection = "student";
    }
    showAdmissionsSection()
    {
        this.currentSection = "admissions";
    }
    
    showPaymentsSection()
    {
        this.currentSection = "payments";
    }
    
    showResultsSection()
    {
        this.currentSection = "results";
    }
  ngOnInit() {
      
    this.refStudent.once('value', resp => {
        this.students = snapshotToArray(resp);
        this.studs = this.students;
        console.log(this.students);
    });
      
  
  }

}

const snapshotToArray = snapshot => {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};
