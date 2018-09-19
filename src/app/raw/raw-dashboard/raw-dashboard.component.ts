import { Component, OnInit } from '@angular/core';

import { NavbarComponent } from '../../nav/navbar/navbar.component';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ResponseContentType } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';

@Component({
  selector: 'app-raw-dashboard',
  templateUrl: './raw-dashboard.component.html',
  styleUrls: ['./raw-dashboard.component.css']
})
export class RawDashboardComponent implements OnInit {

    baseStr:string = "student1/";
    display='none';
    displayImage="";
    currentSection : string = "login";
    fileName: any;
    searchString: string;
    refStudent = firebase.database().ref('student1');
    currentStudent: any;
    editStudent: boolean = false;
    students: any;
    studs: any;
    gender1: string = "Male";
newStudentForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl(''),
    mobno: new FormControl(''),
    amobno: new FormControl(''),
    dob: new FormControl('', Validators.required),
    gender: new FormControl(''),
    uname: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    paddress: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl(''),
    key: new FormControl('')
    
});

    // Admission form controls and variables
    courses: any;
    subCourses: Array<any>;
    categories: any;
    admissionForm: FormGroup = new FormGroup({
        course: new FormControl('', Validators.required),
        subCourse: new FormControl('', Validators.required),
        category: new FormControl('', Validators.required),
        admissionDate: new FormControl('', Validators.required),
        fees: new FormControl('', Validators.required),
        enrollNum: new FormControl('1')
    });
    // End of Admission form controls and variables
    
    // Payment Form
        showNewPayment: boolean = false;
    payments: any;
        paymentForm: FormGroup = new FormGroup({
            paymentDate: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required),
            paymentMode: new FormControl('', Validators.required)
        });
    // End Payment Form controls
    // Login Form
    loginForm: FormGroup = new FormGroup({
        userName: new FormControl('', Validators.required),
        adminPassword: new FormControl('', Validators.required)
    });
    // End Login Form
    // Results Form
        results =[];
        currentImage: any;
        resultForm: FormGroup = new FormGroup({
            semester : new FormControl('', Validators.required),
            imageUrl: new FormControl('', Validators.required),
            resultDate: new FormControl('', Validators.required)
        });
    // End Result Form ctrls
    ngOnInit() {  
        this.refStudent.on('value', resp => {
            this.students = snapshotToArray(resp);
            this.studs = this.students;
            console.log(this.students);
        });
        
        
    }
    loginAdmin()
    {
        
        if(this.loginForm.controls.userName.value == "admin" && this.loginForm.controls.adminPassword.value == "admin123")
        {
            this.currentSection = "student";
        }
        else
        {
            alert("Invalid Username / Password")
        }
    }
    logout()
    {
        this.loginForm.reset();
        this.paymentForm.reset();
        this.currentSection = "login";
        firebase.auth().signOut();
    }
    viewImage(img)
    {
        this.display='block';
        this.displayImage = img;
    }
    closeModal()
    {
        this.display = 'none';
    }
    downloadFile(url)
    {
        var storageRef = firebase.storage().refFromURL(url);
        console.log("gandhar download");
        
        console.log(storageRef);
    }
    deleteResult(index)
    {
        this.results.splice(index,1);
        var refstr = this.baseStr + this.currentStudent.key + "/results";
        firebase.database().ref(refstr).set(this.results);
    }
    uploadResult()
    {
        var sem = this.resultForm.controls.semester.value;
        var rdate = this.resultForm.controls.resultDate.value;
        var results = this.results;
        console.log(this.resultForm.value);
        var refstr = this.baseStr + this.currentStudent.key;
        var refstr1 = refstr;
        refstr += "/" + this.resultForm.controls.semester.value;
        
        var metadata: any = {}
        metadata.name = this.resultForm.controls.semester.value;
        var uploadTask = firebase.storage().ref(refstr).put(this.currentImage,metadata);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot:any) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        },
        error => {
            
        },
        () => {
            
                 uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                     console.log(sem);
                     
                //this.resultForm.controls.imageUrl = downloadURL;
                refstr1 += "/results";
                console.log(refstr1);
                var u:any = {}
                u.semester = sem;
                u.imageUrl = downloadURL;
                u.resultDate = rdate;
                     var foundFlag:boolean = false;
                results.filter(x => {
                    if(x.semester == sem)
                    {
                        foundFlag = true;
                        x.semester = sem;
                        x.imageUrl = downloadURL;
                        x.resultDate = rdate;
                    }
                });     
                if(!foundFlag)
                    results.push(u);
                firebase.database().ref(refstr1).set(results);
                
  });
        });
        this.resultForm.reset();
    }
    
    admit()
    {
        //console.log(this.admissionForm.value);
        var strref = this.baseStr + this.currentStudent.key + "/admission";
        console.log(strref);
        
        var str = this.baseStr + "lastEnrollment/";
        firebase.database().ref("lastEnrollment/").once('value', resp => {
            //console.log(resp.val());
            var enr:any = resp.val();
            var arr = enr.enum.split("/");
            var num = arr[2];
            var nn = arr[0] + "/" + arr[1] + "/" + (parseInt(num) + 1);
            console.log(nn);
            var e = nn;
            
            this.admissionForm.controls.enrollNum.setValue(e);
            console.log(this.admissionForm.value);
            //alert("here");
            firebase.database().ref(strref).update(this.admissionForm.value);
            alert("Admitted successfully");
            firebase.database().ref("lastEnrollment/").set(e);
            this.currentSection = "student";
            });
    }
    
    changeCourse(e)
    {
        console.log(e.target);
        this.courses.filter(val => {
            if(val.catname === e.target.value)
                this.subCourses = val.subCategory;
        });
        console.log(this.admissionForm.controls.course.value);
    }
    
    changeSubCourse(e)
    {
        console.log(e.target.value);
        this.subCourses.filter(val => {
            console.log(val.subcatname);
            if(val.subcatname === e.target.value)
                this.categories = val.list;
        });
    }
    
uploadStudentImage(key)
{
    // upload the image to firebase storage
    console.log(key);
    var str = this.baseStr + key;
    var uploadTask = firebase.storage().ref(this.baseStr).put(this.fileName);
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
        //this.newStudentForm.controls.imageUrl.setValue(downloadURL);
             var v:any = {}
             v.key = downloadURL;
        firebase.database().ref(str).update(v);
  });
    });
}
onFileChange(event)
{
    console.log(event.target.files[0]);
    // should be cleaned before leaving the page
    this.currentImage = event.target.files[0];
}
cancel(){
    this.currentSection = "student";
    this.newStudentForm.reset();
    this.admissionForm.reset();
    this.paymentForm.reset();
    this.resultForm.reset();
    this.currentImage = null;
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
            var str = this.baseStr + this.newStudentForm.controls.key.value;
            //str += ""
            firebase.database().ref(str).update(this.newStudentForm.value);
            this.currentSection = "student";
        }
    
}
editStudentData(stu)
{
    this.editStudent = true;
    this.currentSection = "newStudent";
    this.newStudentForm.patchValue(stu);
    this.currentStudent = stu;
}

paymentInfo(stu)
{
    
    this.currentSection = "payments";
    this.currentStudent = stu;
    if(stu.payment != null)
        this.payments = stu.payment;
    else
        this.payments=[];
    console.log(stu.payment);
}
resultInfo(stu)
{
    this.currentSection = "results";
    this.currentStudent = stu;
    if(stu.results != null)
    {
        this.results = stu.results;
    }
    else
        this.results = [];
}
    addPayment()
    {
        var refstr = this.baseStr + this.currentStudent.key + "/payment";
        this.payments.push(this.paymentForm.value);
        firebase.database().ref(refstr).set(this.payments);
        this.paymentForm.reset();
        //alert("done");
    }
    removePayment(index)
    {
        var refstr = this.baseStr + this.currentStudent.key + "/payment";
        console.log(this.payments);
        this.payments.splice(index,1);
        console.log(this.payments);
        firebase.database().ref(refstr).set(this.payments);
    }
admitStudent(stu)
{
    this.currentSection = "admissions";
    this.currentStudent = stu;
    console.log(stu);
    firebase.database().ref("courses/").on('value', resp => {
            this.courses = snapshotToArray(resp);
            var refstr = this.baseStr + stu.key + "/admission";
            console.log(refstr);
            firebase.database().ref(refstr).on('value',resp => {
            console.log(resp.val());
            if(resp.val() != null && resp.val() != "")
            {
                // set the values for dropdowns
                var admission = resp.val();
                this.setSubCourse(admission);
                this.setCategory(admission);
                this.admissionForm.setValue(admission);
                //alert("loading fields");
                
                //this.spinnerService.hide();
                //this.admissionForm.controls.course.setValue(admission.course); 
                //this.admissionForm.controls.subCourse.setValue(admission.subCourse);
                //this.admissionForm.controls.category.setValue(admission.category);
                //console.log(this.admissionForm.controls.course.value);
            }
    });
    });
    
    
    
    
}
    setSubCourse(admission)
    {
        this.courses.filter(val => {
            if(val.catname === admission.course)
                {
                    this.subCourses = val.subCategory;
                    console.log(this.subCourses);
                    //this.admissionForm.controls.subCourse.setValue(admission.subCourse);
                     
                }
        });
    }
    
    setCategory(admission)
    {
        this.subCourses.filter(val => {
            if(val.subcatname === admission.subCourse)
            {
                this.categories = val.list;
                
                console.log(this.admissionForm.controls.category.value);
            }
        });
    }
createFirebaseUser()
{
    // create a auth user in firebase
    var str = this.newStudentForm.controls.uname.value;
    str += "@gmail.com";
    firebase.auth().createUserWithEmailAndPassword(str, this.newStudentForm.controls.password.value).then(res => {
        // create an entry in db under students section
        console.log(res.user.uid);
        var key1 = res.user.uid;
        //console.log(key);
        var refStr = this.baseStr + key1;
        
        //var enr = this.generateEnrollmentNum();
        //this.newStudentForm.controls.enrollNum.setValue(enr);
        firebase.database().ref(refStr).update(this.newStudentForm.value);
        alert("Student Created Successfully");
        this.currentSection = "student";
        /*
        if(this.fileName != null)
        {
            this.uploadStudentImage(key);
        }
        */
        
        
    }, err => {
        alert("Unable to create a user. Probably the username already exists");
    });
}

generateEnrollmentNum()
{
    var str = this.baseStr + "lastEnrollment/";
    firebase.database().ref("lastEnrollment/").once('value', resp => {
        //console.log(resp.val());
        var enr:any = resp.val();
        var arr = enr.enum.split("/");
        var num = arr[2];
        var nn = arr[0] + "/" + arr[1] + "/" + (parseInt(num) + 1);
        console.log(nn);
        return nn;
    });
}
changeGender()
{
    if(this.gender1 == "Male")
    this.gender1 = "Female";
    else
        this.gender1 = "Male";
}
constructor(private http:HttpClient) { 
    //this.currentSection = "student";
     //console.log(this.generateEnrollmentNum());
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
