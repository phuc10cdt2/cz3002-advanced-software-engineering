exports.respond = function(res, page, code, data) {
    res.format({
        html: function(){
            res.render(page.name, page.data);
        },
        json: function(){
            res.status(code).send(data);
        }
    });
}