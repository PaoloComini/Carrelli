function endpoint(app, connpool) {

    app.post("/api/Carrello", (req, res) => {
        var errors = []
      //  controllo dati inseriti
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
            description: req.body.description,
            status: req.body.status,
        }

        var sql = 'INSERT INTO Carrello (IdCarrello, NumPosti) VALUES (?,?)'
        var params = [IDCarrello]
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



    app.get("/api/Carrello", (req, res, next) => {
        var sql = "select * from carrello"
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


    app.get("/api/Carrello/:id", (req, res) => {
        var sql = "select * from Carrello where IdCarrello = ?"
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


    app.put("/api/Carrello/:id", (req, res) => {
        var data = {
            description: req.body.description,
            status: req.body.status,
        }
        connpool.execute(
            `UPDATE carrello set 
               description = COALESCE(?,description), 
               status = COALESCE(?,status) 
               WHERE task_id = ?`,
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



    app.delete("/api/Carrello/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM carrello WHERE IdCarrello = ?',
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