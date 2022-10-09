const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});

const itemsSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!",
});
const item2 = new Item({
  name: "Hit the + button to add new item.",
});
const item3 = new Item({
  name: "<-- Hit checbox to delete item.",
});
const item4=new Item({
  name:"If you wanna create new list put list name as a parameter to url."
})

const defaultItems = [item1, item2, item3,item4];

const listSchema = {
  name:String,
  items :[itemsSchema]
};

const List=mongoose.model("List",listSchema);



app.get("/", function (req, res) {
  
  Item.find({}, function (err, items) {
    if (err) console.log(err);
   
    if(items.length === 0){

   Item.insertMany(defaultItems, function (err) {
  if (err) console.log(err);
  console.log("Default items were insertted to database");
});
   
  res.redirect("/");
 }
  else {
    res.render("list", {
      listTitle: "Today",
      newItemList: items,
    });
}
  });
});



app.get("/deneme/items",function(req,res){
  Item.find({},function(err,items){
    if(err) console.log();
    res.send(items);
  })
});


app.get("/:customListName",function(req,res){
const customListName=_.capitalize(req.params.customListName);
 List.findOne({name: customListName },function(err,list){
  if(err)
  console.log(err);
  
  if(!list){
    
    const list=new List({
      name:customListName,
      items: defaultItems
     }) ;
     list.save();
     res.redirect(`/${customListName}`);
  }
  else{
    res.render("list", {
      listTitle: customListName,
      newItemList: list.items,
    });
  }
  
  }) 
});
 

app.post("/", function (req, res) {
  const itemName = req.body.newItem ;
  const listName=req.body.list; 
  const item = new Item({
  name:itemName,
});
if(listName==="Today"){
  item.save();
  res.redirect("/");
}else{
    List.findOne({name: listName },function(err,list){
    if(err)
    console.log(err);
    list.items.push(item);
    list.save();
    res.redirect(`/${listName}`)
     });
   }
});



app.post("/delete",function(req,res){
  const item=req.body.checkbox ;
  const customListName=req.body.listName;
if(customListName==="Today"){
  Item.deleteOne({_id:item},function(err){
    if(err) console.log(err);
  })
  res.redirect("/");
}else {
List.findOneAndUpdate({name:customListName},{$pull:{items:{_id:item}}}, function(err,list){
  if(err) console.log(err);
 
    res.redirect(`/${customListName}`);

    })
  }
});




app.listen("3000", function () {
  console.log("server started at 3000");
});
