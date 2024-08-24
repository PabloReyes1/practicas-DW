const db = require('../config/db.config');
const Prueba = db.Prueba;

exports.create = (req, res) => {
    let prueba = {};
    try{
        prueba.name = req.body.name;
        prueba.description = req.body.name;

        Prueba.create(prueba).then(result => {

            res.status(200).json({
                message: "Prueba creada con exico con el id = " + result.id,
                prueba: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}

exports.retrieveAllPrueba = (req, res) => {

        Prueba.findAll()
            .then(pruebasInfos => {
                res.status(200).json({
                    message: "Informacion completada al traer las Pruebas!!",
                    pruebas: pruebasInfos
                });
            })
            . catch(error => {

                console.log(error);

                res.status(500).json({
                    message: "Error!!",
                    error: error
                });
            });
}


exports.getPruebaById = (req, res) => {

    let pruebaId = req.params.id;
    Prueba.findByPK(pruebaId)
        .then(prueba =>{
            res.status(200).json({
                message: "Informacion de prueba por ID completada. Id = " + pruebaId,
                pruebas: prueba
            });
        }) 
        . catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error!",
                error: error
            });
        });

}

exports.updateById = async (req, res) => {
    try{
        let pruebaId = req.params.id;
        let prueba = await Prueba.findByPk(customerId);
    
        if(!prueba){
            // return a response to client
            res.status(404).json({
                message: "No se encuentra ningun registro con el siguiente ID = " + pruebaId,
                prueba: "",
                error: "404"
            });
        } else {    
            // update new change to database
            let updatedObject = {
                name: req.body.name,
                description: req.body.description
            }
            let result = await Pruieba.update(updatedObject, {returning: true, where: {id: pruebaId}});
            
            // return the response to client
            if(!result) {
                res.status(500).json({
                    message: "Error -> No se pudo actualizar el ID = " + req.params.id,
                    error: "No se pudo actualizar",
                });
            }

            res.status(200).json({
                message: "Actualuzacion completa con el registro id = " + pruebaId,
                prueba: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> No se pudo actualizar el ID = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let pruebaId = req.params.id;
        let prueba = await Prueba.findByPk(pruebaId);

        if(!prueba){
            res.status(404).json({
                message: "No existe un registro con id = " + pruebaId,
                error: "404",
            });
        } else {
            await prueba.destroy();
            res.status(200).json({
                message: "Se borro el registro con id = " + pruebaId,
                prueba: prueba,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> No se puede borrar el registro con id = " + req.params.id,
            error: error.message,
        });
    }
}