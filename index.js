//declaring constants for the functions
const   http = require('http'), //HTTP server
        path = require('path'),
        express = require('express'), //Handling HTTP requests & routing
        fs = require('fs'), //File system functionalities
        xmlParse = require('xslt-processor').xmlParse, //XML handling
        xsltProcess = require('xslt-processor').xsltProcess, //XSLT handling
        router = express(), //Init our router
        xml2js = require('xml2js'),
        server = http.createServer(router); //Init our server
        
        router.use(express.static(path.resolve(__dirname,'views')));
        router.use(express.urlencoded({extended: true}));
        router.use(express.json());

//turning xml to json
function XMLtoJSON(filename, cb){
    let filepath = path.normalize(path.join(__dirname, filename));
    fs.readFile(filepath, 'utf8', function(err, xmlStr){
        if (err) throw (err);
        xml2js.parseString(xmlStr, {}, cb);
    });
};

//turning json to xml
function JSONtoXML(filename, obj, cb){
    let filepath = path.normalize(path.join(__dirname, filename));
    let builder = new xml2js.Builder();
    let xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);
};

//info from xml and xsl from what html does
router.get('/get/html', function(req, res) {

    res.writeHead(200, {'Content-Type' : 'text/html'});

    let xml = fs.readFileSync('menu.xml', 'utf8'),
        xsl = fs.readFileSync('menu.xsl', 'utf8');

    xml = xmlParse(xml);
    xsl = xmlParse(xsl);

    let html = xsltProcess(xml, xsl);

    res.end(html.toString());
});

//function for submit button, wich adds information to the xml
router.post('/post/json', function(req, res){
    function appendJSON(obj){
        console.log(obj);
        XMLtoJSON('menu.xml', function(err, result) {
            if (err) throw (err);
            result.menu.category[obj.sec_n].item.push({'listing': obj.listing, 'price': obj.price});
            console.log(JSON.stringify(result, null, " "));
            JSONtoXML('menu.xml', result, function(err){
                if (err) console.log(err);
            });
        });
    };

    appendJSON(req.body);

    res.redirect('back');
});

//delete button, which delete information from xml 
router.post('/post/delete', function (req,res) {
    function deleteJSON(obj) {
        console.log(obj);
        XMLtoJSON('menu.xml', function(err, result){
            if (err) throw (err);

            delete result.menu.category[obj.section].item[obj.entree];

            JSONtoXML('menu.xml', result, function(err){
                if (err) console.log(err);
            });
        });
    };

    deleteJSON(req.body);

    res.redirect('back');
})

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    const addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port)
});