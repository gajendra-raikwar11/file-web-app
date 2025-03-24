const express=require("express")
const app=express()
const path=require("path")
const fs=require("fs")

app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))

app.get("/",function(req,res){

    var arr=[];
    fs.readdir(`./files`,function(err,files){
        files.forEach(function(file){
          var ans=fs.readFileSync(`./files/${file}`,"utf-8")
          arr.push({tittle:file,data:ans})
        })
        res.render("about",{files:arr})
    })
})


app.get('/read/:filename', (req, res) => {
    const addEXt = req.params.filename;
    fs.readFile(`./files/${addEXt}`,'utf-8' ,(err,files) => {
        if (err) return console.log(err);
        else res.render('read', {filestitle:req.params.filename, filedata: files});
    })
})

app.get('/remove/:rmname', (req, res) => {
    const rmfilename = req.params.rmname;
    fs.unlink(`./files/${rmfilename}`, err => {
        if(err) console.log(err);
        res.redirect('/')
    })
})
app.post("/create",function(req,res){
   fs.writeFile(`./files/ ${req.body.title.split(' ').join('')}.txt` ,req.body.data,function(err){
    res.redirect("/")
   });
})

app.get('/edit/:filename', (req, res) => {
    const filename = req.params.filename;
    fs.readFile(`./files/${filename}`, 'utf-8', (err, fileContent) => {
        if (err) {
            console.log(err);
            res.status(404).send('File not found');
        } else {
            res.render('edit', { filename: filename, filedata: fileContent });
        }
    });
});

app.post('/update/:filename', (req, res) => {
    const filename = req.params.filename;
    const newData = req.body.content;
    fs.writeFile(`./files/${filename}`, newData, err => {
        if (err) {
            console.log(err);
            res.status(500).send('Error updating file');
        } else {
            res.redirect(`/read/${filename}`);
        }
    });
});

app.listen(3000,function(){
    console.log("running....");
})