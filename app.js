const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlerbars = require('express-handlebars');
const app = express();
const urlencondeParser = bodyParser.urlencoded({ extended: false });
const sql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306
});


sql.query("use comercio");

app.engine("handlebars", handlerbars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use("/style", express.static('style'));
app.use("/js", express.static('js'));
app.use("/img", express.static('img'));



app.get("/", function (req, res) {
    res.render('index');
});



app.get("/inserir", function (req, res) {
    res.render("inserir");
});

app.get("/select/:id?", function (req, res) {
    if (!req.params.id) {
        sql.query("select * from produtos", function (err, results, fields) {
            res.render('select', { data: results });
        });
    }
});

app.post("/controllerForm", urlencondeParser, function (req, res) {
    sql.query("insert into produtos values (?,?,?,?,?,?,?)", [req.body.id, req.body.name, req.body.qnt, req.body.preco, req.body.marca, req.body.datafab, req.body.dataval]);
    res.render("controllerForm");
});

app.get('/deletar/:id', function (req, res) {
    sql.query("delete from produtos where id=?", [req.params.id]);
    res.render('deletar');
});

app.get('/update/:id', function (req, res) {
    sql.query("select * from produtos where id=?", [req.params.id], function (err, results, fields) {
        res.render('update', { id: req.params.id, name: results[0].nome, qnt: results[0].qnt, marca: results[0].marca, preco: results[0].preco, datafab: results[0].datafab, datavenci: results[0].datavenci });
    });

});

app.post("/controllerUpdate", urlencondeParser, function (req, res) {
    sql.query("update produtos set nome=?, qnt=?, preco=?, marca=?, datafab=?, datavenci=? where id=?", [req.body.nome, req.body.qnt, req.body.preco, req.body.marca, req.body.datafab, req.body.datavenci, req.body.id]);
    res.send("Dados atualizados");
});


app.listen(3000, function (req, res) {
    console.log("Servidor está rodando!");
});