function endpoint(app, connpool) {

    app.post("/api/Prenotazione", (req, res) => {
        var errors = []
        
        if (!req.body.IDCarrello || req.body.IDCarrello === "") {
            errors.push("Nessun ID inserito");
        }
        
        if (errors.length) {
            res.status(400).json({ "error": errors.join(",") });
            return;
        }
        
        var data = {
            Data: req.body.Data,
            IDPersona: req.body.IDPersona,
            IDCarrello: req.body.IDCarrello,
        }

        var sql = 'INSERT INTO Prenotazione (Data, IDPersona, IDCarrello) VALUES (?, ?, ?)';
        var params = [data.Data, data.IDPersona, data.IDCarrello]
        connpool.query(sql, params, (error, results) => {
            if (error) {
                res.status(400).json({ "error": error.message })
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": results.insertId
            })
            console.log(results)
        });

    })

    app.get("/api/Prenotazione", (req, res) => {
        var sql = "select * from Prenotazione"
        connpool.query(sql, (err, rows) => {
            if (err) {
                res.status(400).json({"error": err.message});
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
    });

    app.get("/api/Prenotazione/:IDPrenotazione", (req, res) => {
        var sql = "select * from Prenotazione where IDPrenotazione = ?"
        var params = [req.params.IDPrenotazione]
        connpool.query(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({"error": err.message});
                return;
            }
            res.json({
                "message": "success",
                "data": rows[0]
            })
        });
    });

    app.put("/api/Prenotazione/:IDPrenotazione", (req, res) => {
        var data = {
            IDPersona: req.body.IDPersona,
            Data: req.body.Data,
            IDCarrello: req.body.IDCarrello,
        }
        connpool.query(
            `UPDATE Prenotazione set 
               IDPersona = ?, 
               Data = ?,
               IDCarrello = ? 
               WHERE IDPrenotazione = ?`,
            [data.IDPersona, data.Data, data.IDCarrello, req.params.IDPrenotazione],
            function (err, result) {
                if (err) {
                    res.status(400).json({"error": err.message})
                    return;
                }
                res.json({
                    message: "success",
                    data: data,
                    changes: result.affectedRows
                })
            });
    });

    app.delete("/api/Prenotazione/:IDPrenotazione", (req, res) => {
        connpool.query(
            'DELETE FROM Prenotazione WHERE IDPrenotazione = ?',
            [req.params.IDPrenotazione],
            function (err, result) {
                if (err) {
                    res.status(400).json({"error": err.message})
                    return;
                }
                res.json({"message": "deleted", changes: result.affectedRows})
            });
    });

}

module.exports = endpoint;
