require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();
const mongoose = require("mongoose");
const session = require('express-session');
const passport =require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('flash')
const fileUpload = require('fileupload').createFileUpload('/uploadHandler');
const Busboy = require('busboy')
const fs = require('fs');
const multer = require('multer');
const upld = multer();
const Grid = require('gridfs-stream');
const { GridFsStorage } = require('multer-gridfs-storage');
const { log } = require('console');

let gfs;
let register_error;
let username = "Default";
let user_description = "I'm a professional illustrator from San Francisc";
let user_about = "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.";
let user_role = "Illustrator & UI/UX Designer";
let user_role_details = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
let user_dob = "1 May 1995";
let user_age = "30";
let user_website = "www.example.com";
let user_phone = "+123 456 7890";
let user_city = "New York, USA";
let user_degree = "Masters";
let user_em = "email@example.com";
let user_freelance = "Available";
let user_skills_breif = "Officiis eligendi itaque labore et dolorum mollitia officiis optio vero. Quisquam sunt adipisci omnis et ut. Nulla accusantium dolor incidunt officia tempore. Et eius omnis. Cupiditate ut dicta maxime officiis quidem quia. Sed et consectetur qui quia repellendus itaque neque. Aliquid amet quidem ut quaerat cupiditate. Ab et eum qui repellendus omnis culpa magni laudantium dolores.";
let user_skills_tech = "HTML_100 CSS_90 JAVASCRIPT_75 PHP_80 WORDPRESS/CMS_80 PHOTOSHOP_90";
let user_project_description = "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.";
let user_clients = "232";
let user_projects = "521";
let user_hours = "1463";
let user_team = "15";
let user_address ="Portland par 127,Orlando, FL";
let user_school = "Rochester Institute of Technology, Rochester, NY";
let user_school_year = "2015 - 2016";
let user_school_about = "Qui deserunt veniam. Et sed aliquam labore tempore sed quisquam iusto autem sit. Ea vero voluptatum qui ut dignissimos deleniti nerada porti sand markend";
let user_college = "Rochester Institute of Technology, Rochester, NY";
let user_college_year = "2017 - 2019";
let user_college_about = "Quia nobis sequi est occaecati aut. Repudiandae et iusto quae reiciendis et quis Eius vel ratione eius unde vitae rerum voluptates asperiores voluptatem Earum molestiae consequatur neque etlon sader mart dila";
let user_college_degree = "Bachelor of Fine Arts & Graphic Design";
let user_field = "Senior graphic design specialist";
let user_field_year = "2019 - Present";
let user_field_address = "Experion, New York, NY";
let user_field_description = "Lead in the design, development, and implementation of the graphic, layout, and production communication materials.Delegate tasks to the 7 members of the design team and provide counsel on all aspects of the project.Supervise the assessment of all graphic materials in order to ensure quality and accuracy of the design.Oversee the efficient use of production project budgets ranging from $2,000 - $25,000";
let user_aoi = "Graphic design specialist";
let user_aoi_year = "2017 - 2019";
let user_aoi_description = "Lead in the design, development, and implementation of the graphic, layout, and production communication materials.Delegate tasks to the 7 members of the design team and provide counsel on all aspects of the project.Supervise the assessment of all graphic materials in order to ensure quality and accuracy of the design.Oversee the efficient use of production project budgets ranging from $2,000 - $25,000";
let user_location = "Madurai";
let user_contact_email = "info@example.com";
let user_contact = "+1 5589 55488 55s";
let user_twitter = "https://www.twitter.com";
let user_facebook = "https://www.facebook.com";
let user_instagram = "https://www.instagram.com";
let user_linkedin = "https://www.linked.in";
let logged_in = false;
let usern = 'default';
let curr_id = "0";
let curr_name = "none";

mongoose.connect(process.env.Mongo_DB_SERVER, { useNewURLParser : true });
const conn = mongoose.createConnection(process.env.Mongo_DB_SERVER, { useNewURLParser : true });
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});
const registerSchema = new mongoose.Schema({
    "username": String,
    "password": String,
    "googleId": String
});
registerSchema.plugin(passportLocalMongoose);
registerSchema.plugin(findOrCreate);

const composeSchema = new mongoose.Schema({
    id: String,
    usern: String,
    name : String,
    description: String,
    about: String,
    role: String,
    role_details: String,
    dob: String,
    age: String,
    website: String,
    phone: String,
    city: String,
    degree: String,
    em: String,
    freelance: String,
    skills_brief: String,
    skills_tech: String,
    project_description: String,
    clients: String,
    projects: String,
    hours: String,
    team: String,
    address: String,
    school: String,
    school_year: String,
    school_about: String,
    college: String,
    college_year: String,
    college_about: String,
    college_degree: String,
    field: String,
    field_year: String,
    field_address: String,
    field_description: String,
    aoi: String,
    aoi_year: String,
    aoi_description: String,
    location: String,
    contact_email: String,
    contact: String,
    user_twitter: String,
    user_facebook: String,
    user_instagram: String,
    user_linkedin: String
});

const imageSchema = new mongoose.Schema({
    image: String
});

const Account = mongoose.model("account",registerSchema);
const User = mongoose.model("user",composeSchema);

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');
app.use(bodyParser. text({type: '/'}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(fileUpload.middleware);
app.use(session({
    secret: 'Little Secret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

passport.use(Account.createStrategy());
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    User.findOne({ 'email': email }, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'));
  
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      }
      return done(null, user);
    });
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
});
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/home",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    Account.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/assets/img');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});
  
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}
  
const uplod = multer({
  storage: Storage,
  limits: { fileSize: 100000000 }, // Maximum file size
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("file");

const fileSchema = new mongoose.Schema({
    id: String,
    filename: String,
    username: String,
    contentType: String,
    length: Number,
    uploadDate: { type: Date, default: Date.now },
    metadata: Object,
    md5: String
});
  
const File = mongoose.model('File', fileSchema);

async function load(n){
    const found_Accounts2 = await User.findOne({id : n});
    if(found_Accounts2 !== null){
            username = found_Accounts2.name;
            user_description = found_Accounts2.description;
            user_about = found_Accounts2.about;
            user_role = found_Accounts2.role;
            user_role_details = found_Accounts2.role_details;
            user_dob = found_Accounts2.dob;
            user_Age = found_Accounts2.age;
            user_website = found_Accounts2.website;
            user_phone = found_Accounts2.phone;
            user_city = found_Accounts2.city;
            user_degree = found_Accounts2.degree;
            user_em = found_Accounts2.em;
            user_freelance = found_Accounts2.freelance;
            user_skills_breif = found_Accounts2.skills_brief;
            user_skills_tech = found_Accounts2.skills_tech;
            user_project_description = found_Accounts2.project_description;
            user_clients = found_Accounts2.clients;
            user_projects = found_Accounts2.projects;
            user_hours = found_Accounts2.hours;
            user_team = found_Accounts2.team;
            user_address = found_Accounts2.address;
            user_school = found_Accounts2.school;
            user_school_year = found_Accounts2.school_year;
            user_school_about = found_Accounts2.school_about;
            user_college = found_Accounts2.college;
            user_college_year = found_Accounts2.college_year;
            user_college_about = found_Accounts2.college_about;
            user_college_degree = found_Accounts2.college_degree;
            user_field = found_Accounts2.field;
            user_field_year = found_Accounts2.field_year;
            user_field_address = found_Accounts2.field_address;
            user_field_description = found_Accounts2.field_description;
            user_aoi = found_Accounts2.aoi;
            user_aoi_year = found_Accounts2.aoi_year
            user_aoi_description = found_Accounts2.aoi_description;
            user_location = found_Accounts2.location;
            user_contact_email = found_Accounts2.contact_email;
            user_contact = found_Accounts2.contact;
            user_twitter = found_Accounts2.user_twitter;
            user_facebook = found_Accounts2.user_facebook;
            user_instagram = found_Accounts2.user_instagram;
            user_linkedin = found_Accounts2.user_linkedin;
    }
}
  
async function load_username(n){
    const found_Accounts2 = await User.findOne({usern : n});
    if(found_Accounts2 !== null){
            username = found_Accounts2.name;
            user_description = found_Accounts2.description;
            user_about = found_Accounts2.about;
            user_role = found_Accounts2.role;
            user_role_details = found_Accounts2.role_details;
            user_dob = found_Accounts2.dob;
            user_Age = found_Accounts2.age;
            user_website = found_Accounts2.website;
            user_phone = found_Accounts2.phone;
            user_city = found_Accounts2.city;
            user_degree = found_Accounts2.degree;
            user_em = found_Accounts2.em;
            user_freelance = found_Accounts2.freelance;
            user_skills_breif = found_Accounts2.skills_brief;
            user_skills_tech = found_Accounts2.skills_tech;
            user_project_description = found_Accounts2.project_description;
            user_clients = found_Accounts2.clients;
            user_projects = found_Accounts2.projects;
            user_hours = found_Accounts2.hours;
            user_team = found_Accounts2.team;
            user_address = found_Accounts2.address;
            user_school = found_Accounts2.school;
            user_school_year = found_Accounts2.school_year;
            user_school_about = found_Accounts2.school_about;
            user_college = found_Accounts2.college;
            user_college_year = found_Accounts2.college_year;
            user_college_about = found_Accounts2.college_about;
            user_college_degree = found_Accounts2.college_degree;
            user_field = found_Accounts2.field;
            user_field_year = found_Accounts2.field_year;
            user_field_address = found_Accounts2.field_address;
            user_field_description = found_Accounts2.field_description;
            user_aoi = found_Accounts2.aoi;
            user_aoi_year = found_Accounts2.aoi_year
            user_aoi_description = found_Accounts2.aoi_description;
            user_location = found_Accounts2.location;
            user_contact_email = found_Accounts2.contact_email;
            user_contact = found_Accounts2.contact;
            user_twitter = found_Accounts2.user_twitter;
            user_facebook = found_Accounts2.user_facebook;
            user_instagram = found_Accounts2.user_instagram;
            user_linkedin = found_Accounts2.user_linkedin;
    }
}

async function load_username2(n){
    const found_Accounts2 = await User.findOne({id : n});
    if(found_Accounts2 !== null){
            username = found_Accounts2.name;
            user_description = found_Accounts2.description;
            user_about = found_Accounts2.about;
            user_role = found_Accounts2.role;
            user_role_details = found_Accounts2.role_details;
            user_dob = found_Accounts2.dob;
            user_Age = found_Accounts2.age;
            user_website = found_Accounts2.website;
            user_phone = found_Accounts2.phone;
            user_city = found_Accounts2.city;
            user_degree = found_Accounts2.degree;
            user_em = found_Accounts2.em;
            user_freelance = found_Accounts2.freelance;
            user_skills_breif = found_Accounts2.skills_brief;
            user_skills_tech = found_Accounts2.skills_tech;
            user_project_description = found_Accounts2.project_description;
            user_clients = found_Accounts2.clients;
            user_projects = found_Accounts2.projects;
            user_hours = found_Accounts2.hours;
            user_team = found_Accounts2.team;
            user_address = found_Accounts2.address;
            user_school = found_Accounts2.school;
            user_school_year = found_Accounts2.school_year;
            user_school_about = found_Accounts2.school_about;
            user_college = found_Accounts2.college;
            user_college_year = found_Accounts2.college_year;
            user_college_about = found_Accounts2.college_about;
            user_college_degree = found_Accounts2.college_degree;
            user_field = found_Accounts2.field;
            user_field_year = found_Accounts2.field_year;
            user_field_address = found_Accounts2.field_address;
            user_field_description = found_Accounts2.field_description;
            user_aoi = found_Accounts2.aoi;
            user_aoi_year = found_Accounts2.aoi_year
            user_aoi_description = found_Accounts2.aoi_description;
            user_location = found_Accounts2.location;
            user_contact_email = found_Accounts2.contact_email;
            user_contact = found_Accounts2.contact;
            user_twitter = found_Accounts2.user_twitter;
            user_facebook = found_Accounts2.user_facebook;
            user_instagram = found_Accounts2.user_instagram;
            user_linkedin = found_Accounts2.user_linkedin;
    }
}

app.get('/check',(req, res) => {
    const check = async () => {
        const check_details = await User.findOne({id : curr_id});
        if(check_details !== null){
            load(curr_id)
            res.redirect('/home');
        } else {
            res.redirect('/create');
        }
    }
    check();
}) 

const default_details = () => {
    username = "Default";
    user_description = "I'm a professional illustrator from San Francisc";
    user_about = "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.";
    user_role = "Illustrator & UI/UX Designer";
    user_role_details = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    user_dob = "1 May 1995";
    user_age = "30";
    user_website = "www.example.com";
    user_phone = "+123 456 7890";
    user_city = "New York, USA";
    user_degree = "Masters";
    user_em = "email@example.com";
    user_freelance = "Available";
    user_skills_breif = "Officiis eligendi itaque labore et dolorum mollitia officiis optio vero. Quisquam sunt adipisci omnis et ut. Nulla accusantium dolor incidunt officia tempore. Et eius omnis. Cupiditate ut dicta maxime officiis quidem quia. Sed et consectetur qui quia repellendus itaque neque. Aliquid amet quidem ut quaerat cupiditate. Ab et eum qui repellendus omnis culpa magni laudantium dolores.";
    user_skills_tech = "HTML_100 CSS_90 JAVASCRIPT_75 PHP_80 WORDPRESS/CMS_80 PHOTOSHOP_90";
    user_project_description = "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.";
    user_clients = "232";
    user_projects = "521";
    user_hours = "1463";
    user_team = "15";
    user_address ="Portland par 127,Orlando, FL";
    user_school = "Rochester Institute of Technology, Rochester, NY";
    user_school_year = "2015 - 2016";
    user_school_about = "Qui deserunt veniam. Et sed aliquam labore tempore sed quisquam iusto autem sit. Ea vero voluptatum qui ut dignissimos deleniti nerada porti sand markend";
    user_college = "Rochester Institute of Technology, Rochester, NY";
    user_college_year = "2017 - 2019";
    user_college_about = "Quia nobis sequi est occaecati aut. Repudiandae et iusto quae reiciendis et quis Eius vel ratione eius unde vitae rerum voluptates asperiores voluptatem Earum molestiae consequatur neque etlon sader mart dila";
    user_college_degree = "Bachelor of Fine Arts & Graphic Design";
    user_field = "Senior graphic design specialist";
    user_field_year = "2019 - Present";
    user_field_address = "Experion, New York, NY";
    user_field_description = "Lead in the design, development, and implementation of the graphic, layout, and production communication materials.Delegate tasks to the 7 members of the design team and provide counsel on all aspects of the project.Supervise the assessment of all graphic materials in order to ensure quality and accuracy of the design.Oversee the efficient use of production project budgets ranging from $2,000 - $25,000";
    user_aoi = "Graphic design specialist";
    user_aoi_year = "2017 - 2019";
    user_aoi_description = "Lead in the design, development, and implementation of the graphic, layout, and production communication materials.Delegate tasks to the 7 members of the design team and provide counsel on all aspects of the project.Supervise the assessment of all graphic materials in order to ensure quality and accuracy of the design.Oversee the efficient use of production project budgets ranging from $2,000 - $25,000";
    user_location = "Madurai";
    user_contact_email = "info@example.com";
    user_contact = "+1 5589 55488 55s";
    user_twitter = "https://www.twitter.com";
    user_facebook = "https://www.facebook.com";
    user_instagram = "https://www.instagram.com";
    user_linkedin = "https://www.linked.in";
    logged_in = false;
    usern = 'default';
}
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/allow',
    failureRedirect: '/error',
    failureFlash: true
  })
);

app.get('/error',(req, res)=>{
    res.render("index",{error:"Invalid Username or Password"});
})

app.get('/registererror',(req, res)=>{
    res.render("register",{information:"Username already exists"});
})

app.get("/auth/google",
  passport.authenticate('google', { scope: ['profile'] })
);

app.get("/auth/google/home", 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    default_details();
    res.redirect('/allow');
  });

app.get('/logout',(req,res)=>{
    req.logout(function() {
        default_details();
        res.redirect('/allow');
    });
})

app.get('/allow',function(req,res){
    if(req.isAuthenticated()){
        curr_name = "none";
        if(req.user.username != null) {
            curr_name = req.user.username;
        }
        curr_id = req.user.id + "";
        logged_in = true;
        res.redirect('/check')
    } else{
        default_details();
        res.redirect('/');
    }
})

app.post("/reg_compose",function(req,res){
    Account.register({username : req.body.username},req.body.password,function(err, user) {
        if (err) {
            console.log(err);
            res.redirect('/registererror');
        } else {
            usern = req.body.username;
            passport.authenticate("local")(req, res, function(){
                default_details();
                res.redirect("/allow");
            });
        }
    });
});

app.post("/compose",uplod,async function(req,res){
    // console.log(req.body);
    // console.log(curr_id);
    username = req.body.name
    const name = req.body.name;
    user_description = req.body.user_description;
    user_about = req.body.user_about;
    user_role = req.body.user_role;
    user_role_details = req.body.user_roleDetails;
    user_dob = req.body.user_dob;
    user_Age = req.body.user_age;
    user_website = req.body.user_website;
    user_phone = req.body.user_phone;
    user_city = req.body.user_city;
    user_degree = req.body.user_degree;
    user_em = req.body.user_email;
    user_freelance = req.body.user_freelance;
    user_skills_breif = req.body.user_skills_breif;
    user_skills_tech = req.body.user_skills_tech;
    user_project_description = req.body.user_project_description;
    user_clients = req.body.user_clients;
    user_projects = req.body.user_projects;
    user_hours = req.body.user_hours;
    user_team = req.body.user_team;
    user_address = req.body.user_address
    user_school = req.body.user_school
    user_school_year = req.body.user_school_year
    user_school_about = req.body.user_school_about;
    user_college = req.body.user_college;
    user_college_year = req.body.user_college_year;
    user_college_about = req.body.user_college_about;
    user_college_degree = req.body.user_college_degree;
    user_field = req.body.user_field;
    user_field_year = req.body.user_field_year;
    user_field_address = req.body.user_field_address;
    user_field_description = req.body.user_field_description;
    user_aoi = req.body.user_aoi
    user_aoi_year = req.body.user_aoi_year
    user_aoi_description = req.body.user_aoi_description;
    user_location = req.body.user_location;
    user_contact_email = req.body.user_contact_email;
    user_contact = req.body.user_contact;
    user_twitter = req.body.user_twitter;
    user_facebook = req.body.user_facebook;
    user_instagram = req.body.user_instagram;
    user_linkedin = req.body.user_linkedin;
    try {
        if (!req.file) {
          throw new Error('No file uploaded');
        }
        async function crea(){
        await File.create({
          id: curr_id,
          filename: req.file.originalname,
          username: curr_name,
          mimetype: req.file.mimetype,
          size: req.file.size,
          metadata: req.file.data,
          md5: req.file.md5
        });
        }
        crea();
      } catch (err) {
        console.error("THis is error " + err);
        res.status(500).json({
          success: false,
          error: err.message
        });
      }
    const comp = new User({
        id: curr_id,
        usern: curr_name,
        name : name,
        description: user_description,
        about: user_about,
        role: user_role,
        role_details: user_role_details,
        dob: user_dob,
        age: user_Age,
        website: user_website,
        phone: user_phone,
        city: user_city,
        degree: user_degree,
        em: user_em,
        freelance: user_freelance,
        skills_brief: user_skills_breif,
        skills_tech: user_skills_tech,
        project_description: user_project_description,
        clients: user_clients,
        projects: user_projects,
        hours: user_hours,
        team: user_team,
        address: user_address,
        school: user_school,
        school_year: user_school_year,
        school_about: user_school_about,
        college: user_college,
        college_year: user_college_year,
        college_about: user_college_about,
        college_degree: user_college_degree,
        field: user_field,
        field_year: user_field_year,
        field_address: user_field_address,
        field_description: user_field_description,
        aoi: user_aoi,
        aoi_year: user_aoi_year,
        aoi_description: user_aoi_description,
        location: user_location,
        contact_email: user_contact_email,
        contact: user_contact,
        user_twitter : user_twitter,
        user_facebook : user_facebook,
        user_instagram : user_instagram,
        user_linkedin : user_linkedin
    })
    await comp.save();
    res.redirect("/logout");
})

app.get('/user/:username/home',function(req,res){
    res.render("home",{
        home: "user/" + req.params.username + "/home",
        about: "user/" + req.params.username + "/about",
        resume: "user/" + req.params.username + "/resume",
        contact: "user/" + req.params.username + "/contact",
        user_twitter: user_twitter,
        user_facebook: user_facebook,
        user_instagram: user_instagram,
        user_linkedin: user_linkedin,
        username : username,
        user_des: user_about
    });
});
app.get('/home',function(req,res){
    if(req.isAuthenticated()){
        res.render("home",{
            home: "/home",
            about: "/about",
            resume: "/resume",
            contact: "/contact",
            user_twitter: user_twitter,
            user_facebook: user_facebook,
            user_instagram: user_instagram,
            user_linkedin: user_linkedin,
            username : username,
            user_des: user_about
        });
    } else{
        default_details();
        res.redirect('/');
    }

});

app.get("/",function(req,res){
    if(req.isAuthenticated()){
        res.redirect('/home');
    } else{
        res.render("index",{error:""});
    }
});

async function return_url(){
    const image_details = await File.findOne({username:curr_name});
    if(image_details != null){
        return "assets/img/" + image_details.filename;
    }
    else {
        const image_details2 = await File.findOne({id:curr_name});
        if(image_details2 != null){
            return "assets/img/" + image_details2.filename;
        } else {
            return "assets/img/about.jpg"
        }
    }
}

app.get('/about',async function(req,res){
    const img_url = await return_url();
    const arr = user_skills_tech.split(" ");
    const arr1 = [];
    const arr2 = [];
    for(let i=0;i<arr.length/2;i++){
        arr1.push(arr[i]);
    }
    for(let i=arr.length/2;i<arr.length;i++){
        arr2.push(arr[i]);
    }
    res.render("about",{
        image_url: img_url,
        home: "/home",
        about: "/about",
        resume: "/resume",
        contact: "/contact",
        user_twitter: user_twitter,
        user_facebook: user_facebook,
        user_instagram: user_instagram,
        user_linkedin: user_linkedin,
        user_about: user_about,
        user_role: user_role,
        user_role_details: user_role_details,
        user_dob: user_dob,
        user_website: user_website,
        user_phone: user_phone,
        user_city: user_city,
        user_age: user_age,
        user_degree: user_degree,
        user_em: user_em,
        user_freelance: user_freelance,
        user_skills_breif: user_skills_breif,
        user_skills_tech: arr1,
        user_skills_tech2: arr2,
        user_project_description: user_project_description,
        user_clients: user_clients,
        user_projects: user_projects,
        user_hours: user_hours,
        user_team: user_team
    });
})
app.get('/user/:username/about',async function(req,res){
    const img_url = await return_url();
    const arr = user_skills_tech.split(" ");
    const arr1 = [];
    const arr2 = [];
    for(let i=0;i<arr.length/2;i++){
        arr1.push(arr[i]);
    }
    for(let i=arr.length/2;i<arr.length;i++){
        arr2.push(arr[i]);
    }
    res.render("about",{
        image_url: img_url,
        home: "user/" + req.params.username + "/home",
        about: "user/" + req.params.username + "/about",
        resume: "user/" + req.params.username + "/resume",
        contact: "user/" + req.params.username + "/contact",
        user_twitter: user_twitter,
        user_facebook: user_facebook,
        user_instagram: user_instagram,
        user_linkedin: user_linkedin,
        user_about: user_about,
        user_role: user_role,
        user_role_details: user_role_details,
        user_dob: user_dob,
        user_website: user_website,
        user_phone: user_phone,
        user_city: user_city,
        user_age: user_age,
        user_degree: user_degree,
        user_em: user_em,
        user_freelance: user_freelance,
        user_skills_breif: user_skills_breif,
        user_skills_tech: arr1,
        user_skills_tech2: arr2,
        user_project_description: user_project_description,
        user_clients: user_clients,
        user_projects: user_projects,
        user_hours: user_hours,
        user_team: user_team
    });
})

app.get('/resume',function(req,res){
    res.render("resume",{
        home: "/home",
        about: "/about",
        resume: "/resume",
        contact: "/contact",
        user_twitter: user_twitter,
        user_facebook: user_facebook,
        user_instagram: user_instagram,
        user_linkedin: user_linkedin,
        user_about: user_about,
        user_name: username,
        user_description: user_description,
        user_address: user_address,
        user_phone: user_phone,
        user_email: user_em,
        user_school: user_school,
        user_school_year: user_school_year,
        user_school_about: user_school_about,
        user_college: user_college,
        user_college_year: user_college_year,
        user_college_degree: user_college_degree,
        user_college_about: user_college_about,
        user_field: user_field,
        user_field_year: user_field_year,
        user_field_address: user_field_address,
        user_field_description: user_field_description.split("."),
        user_aoi: user_aoi,
        user_aoi_year: user_field_year,
        user_aoi_description: user_aoi_description.split(".")
    });
})

app.get('/user/:username/resume',function(req,res){
    res.render("resume",{
        home: "user/" + req.params.username + "/home",
        about: "user/" + req.params.username + "/about",
        resume: "user/" + req.params.username + "/resume",
        contact: "user/" + req.params.username + "/contact",
        user_twitter: user_twitter,
        user_facebook: user_facebook,
        user_instagram: user_instagram,
        user_linkedin: user_linkedin,
        user_about: user_about,
        user_name: username,
        user_description: user_description,
        user_address: user_address,
        user_phone: user_phone,
        user_email: user_em,
        user_school: user_school,
        user_school_year: user_school_year,
        user_school_about: user_school_about,
        user_college: user_college,
        user_college_year: user_college_year,
        user_college_degree: user_college_degree,
        user_college_about: user_college_about,
        user_field: user_field,
        user_field_year: user_field_year,
        user_field_address: user_field_address,
        user_field_description: user_field_description.split("."),
        user_aoi: user_aoi,
        user_aoi_year: user_field_year,
        user_aoi_description: user_aoi_description.split(".")
    });
})

app.get("/register",function(req,res){
    res.render("register",{information : ""});
})

app.get('/create',function(req,res){
    if(req.isAuthenticated() && logged_in){
        res.render("create");
    } else {
        res.redirect("/");
    }
})

app.get('/contact',(req,res)=>{
    res.render("contact",{
        home: "/home",
        about: "/about",
        resume: "/resume",
        contact: "/contact",
        user_twitter: user_twitter,
        user_facebook: user_facebook,
        user_instagram: user_instagram,
        user_linkedin: user_linkedin,
        user_description: user_about,
        iframe: "https://maps.google.com/maps?q=" + user_location + "&t=&z=10&ie=UTF8&iwloc=&output=embed",
        user_location: user_location,
        user_email: user_em,
        user_phone: user_phone
    });
})

app.get('/user/:username/contact',(req,res)=>{
    res.render("contact",{
        home: "user/" + req.params.username + "/home",
        about: "user/" + req.params.username + "/about",
        resume: "user/" + req.params.username + "/resume",
        contact: "user/" + req.params.username + "/contact",
        user_twitter: user_twitter,
        user_facebook: user_facebook,
        user_instagram: user_instagram,
        user_linkedin: user_linkedin,
        user_description: user_about,
        iframe: "https://maps.google.com/maps?q=" + user_location + "&t=&z=10&ie=UTF8&iwloc=&output=embed",
        user_location: user_location,
        user_email: user_em,
        user_phone: user_phone
    });
})

app.listen(8001,function(){
    console.log("Server is running at port 8001");
});

app.get('/:username', (req, res) => {
    if(usern !== req.params.username && logged_in){
        logged_in = false;
    }
    async function find_account(){
        curr_name = req.params.username;
        const found_Accounts2 = await User.findOne({usern : req.params.username});
        if(found_Accounts2 == null){
            const found_Accounts3 = await User.findOne({id : req.params.username});
            if(found_Accounts3 != null){
                await load_username2(req.params.username);
                res.redirect("user/" + req.params.username + '/home');
            } else {
                res.redirect("/");
            }
        }
        else {
            await load_username(req.params.username);
            res.redirect("user/" + req.params.username + '/home');
        }
    }
    find_account();
})