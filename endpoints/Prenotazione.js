function endpoint(app, connpool) {

    app.post("/api/Prenotazione", (req, res) => {
        var errors = []
        // controllo dati inseriti
        if (!req.body.description) {
            errors.push("No description specified");
        }
        if (req.body.status === "") {
            errors.push("No status specified");
        }
        
        if (errors.length) {
            res.status(400).json({ "error": errors.join(",") });
            return;
        }
        var data = {
            IDPersona: req.body.status,
            Data: req.body.status,
            IDCarrello: req.body.status,
        }

        var sql = 'INSERT INTO Prenotazione (IDPersona, IDCarrello, Data) VALUES (?, ?, ?)';
        var params = [data.IDPersona, data.IDCarrello, data.Data]
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



    app.get("/api/Prenotazione", (req, res, next) => {
        var sql = "select * from Prenotazione"
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


    app.get("/api/Prenotazione/:IDPrenotazione", (req, res) => {
        var sql = "select * from Prenotazione where IDPrenotazione = ?"
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


    app.put("/api/Prenotazione/:IDPrenotazione", (req, res) => {
        var data = {
            description: req.body.description,
            status: req.body.status,
        }
        connpool.execute(
            `UPDATE Prenotazione set 
               description = COALESCE(?,description), 
               status = COALESCE(?,status) 
               WHERE IDPrenotaziome = ?`,
            [data.description, data.status, req.params.id],
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



    app.delete("/api/Prenotazione/:IDPrenotazione", (req, res) => {
        connpool.execute(
            'DELETE FROM Prenotazione WHERE IDPrenotazione = ?',
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