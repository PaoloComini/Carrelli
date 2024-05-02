function endpoint(app, connpool) {

    app.post("/api/persona", (req, res) => {
        var errors = []
        /* controllo dati inseriti
        if (!req.body.Nome) {
            errors.push("No description specified");
        }
        if (!req.body.Cognome) {
            errors.push("No description specified");
        }
        if (!req.body.Password) {
            errors.push("No description specified");
        }
        if (!req.body.Email) {
            errors.push("No description specified");
        }
        
        if (errors.length) {
            res.status(400).json({ "error": errors.join(",") });
            return;
        }
    ]*/
        var data = {
            Nome: req.body.Nome,
            Cognome: req.body.cognome,
            Password: req.body.Password,
            Email: req.body.Email,
            
        }

        var sql = 'INSERT INTO Persona (Nome,Cognome,Password,Email) VALUES (?,?,?,?)'
        var params = [data.Nome, data.Cognome,data.Password,data.Email]
        connpool.query(sql, params, (error, results) => {
            if (error) {
                res.status(400).json({ "error": error.message })
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": this.insertID
            })
            console.log(results)
        });

    })



    app.get("/api/persona", (req, res, next) => {
        var sql = "select * from persona"
        var params = []
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
          });
    });


    app.get("/api/persona/:id", (req, res) => {
        var sql = "select * from persona where IDPersona = ?"
        var params = [req.params.id]
        connpool.query(sql, params, (err, rows) => {
            if (err) {
              res.status(400).json({"error":err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":rows[0]
            })
          });
    });


    app.put("/api/persona/:id", (req, res) => {
        var data = {
            Nome: req.body.Nome,
            Cognome: req.body.cognome,
            Password: req.body.Password,
            Email: req.body.Email,
        }
        
        connpool.execute(
            `UPDATE persona set 
               description = COALESCE(?,description), 
               status = COALESCE(?,status) 
               WHERE idpersona = ?`,
            [data.Nome, data.Cognome,data.Password,data.Email, req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                console.log(result )
                res.json({
                    message: "success",
                    data: data,
                    changes: result.affectedRows
                })
        });
    })



    app.delete("/api/persona/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM task WHERE IDPersona = ?',
            [req.params.id],
            function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                res.json({"message":"deleted", changes: result.affectedRows})
        });
    })
}








module.exports = endpoint;