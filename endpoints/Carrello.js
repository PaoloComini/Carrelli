function endpoint(app, connpool) {

    app.post("/api/Carrello", (req, res) => {
        var errors = []
      //  controllo dati inseriti
        if (!req.body.NumComputer
        
        ) {
            errors.push("No NumPosti specified");
        }

        if (errors.length) {
            res.status(400).json({ "error": errors.join(",") });
            return;
        }
        var data = {
            NumComputer: req.body.NumComputer,
        }

        var sql = 'INSERT INTO Carrello (NumComputer) VALUES (?)'
        var params = [data.NumComputer]
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
            "NumComputer": req.body.NumComputer  
        }
        console.log(data.NumComputer)
        connpool.execute(
            `UPDATE carrello 
            SET NumComputer = COALESCE(?, NumComputer)
            WHERE IDCarrello = ?
            `,
            [data.NumComputer,req.params.id],
            function (err, result) {
                if (err){
                     
                    console.log("errore")
                    res.status(400).json({"error": err.message})
                    return;
                }
                console.log("success")
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