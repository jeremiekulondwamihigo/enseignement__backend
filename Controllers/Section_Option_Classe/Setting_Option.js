const model_Option = require("../../Models/Model_Option")
const { isEmpty, generateString } = require("../../Fonctions/Static_Function")
const AsyncLib = require("async")
const Model_Etablissement = require("../../Models/Model_Etablissement")

module.exports = {
    Add_Option : (req, res)=>{
        const { option, code_Section, id } = req.body
        try {
            if(isEmpty(option) || isEmpty(code_Section)){
                return res.status(200).json({
                    "message":"Veuillez renseigner les champs",
                    "error":true
                })
            }
            const valeur_id = generateString(7);
            const optionTrim = option.trim();

            AsyncLib.waterfall([
                function(done){
                    model_Option.findOne({
                        option : optionTrim
                    }).then( optionFound =>{
                        if(optionFound){
                            return res.status(200).json({
                                "message":"L'option "+optionFound.option+" existe déjà",
                                "error":true
                            })
                        }else{
                            done(null, optionFound)
                        }
                    })
                }, function(optionFound, done){
                    model_Option.findOne({code_Option : valeur_id}).then( optionCodeFound =>{
                        if(optionCodeFound){
                            return res.status(200).json({
                                "message":"Veuillez relancer l'enregistrement",
                                "error": "info"
                            })
                        }else{
                            model_Option.create({ id, option : optionTrim, code_Option : valeur_id, code_Section }).then((response)=>{
                                done(response)
                            })
                        }
                    })
                }
            ], function(response){
                if(response){
                    return res.status(200).json({
                        "message":"Enregistrement effectué",
                        "error":"success"
                    })
                }else{
                    return res.status(200).json({
                        "message":"Erreur d'enregistrement",
                        "error":true
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }
    },
    Modification_Option  : (request, response)=>{
        try {
            console.log(request.body)
            const { _id, option_modification } = request.body;
            if(isEmpty(option_modification) || isEmpty(_id)){
                return response.status(200).json({
                    "message":"Erreur de modification",
                    "error":true
                })
            }
            AsyncLib.waterfall([
                function(done){
                    model_Option.findOneAndUpdate(
                        { 
                        _id : _id 
                    }, {
                        $set : {
                            option : option_modification
                        }
                    }, null, (error, result)=>{
                        if(error) throw error
                        else{done(result)}
                    }
                    )
                }
            ], function(result){
                if(result){
                    return response.status(200).json({
                        "message":"Opération effectuée",
                        "error":"success"
                    })
                }else{
                    return response.status(200).json({
                        "message":"Erreur d'enregistrement",
                        "error":true
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }
    },
    read_Option : (req, res)=>{
        try {
            model_Option.find({}).then((response)=>{
                return res.send(response.reverse());
            })
        } catch (error) {
            console.log(error)
        }
    },
    Read_Option_Etablissement : (req, res)=>{
        try{

            const { id } = req.params

           AsyncLib.waterfall([
            function(done){
                model_Option.find({})
                .then(option=>{
                    if(option){
                        done(option)
                    }
                })
            },
            function(option, done){
                Model_Etablissement.findById({_id : id})
                .then(etablissement=>{
                    if(etablissement){
                        let table = []
                        const { code_option} = etablissement
                        for(let i=0; i < code_option.length; i++){
                            let valeur = option.filter(option => option.code_Option == code_option[i])
                            if(valeur){
                                table.push(valeur)
                            }
                        }
                        done(table)
                        
                    }
                })
            }
           ], function(table){
            if(table){
                return res.status(200).json(table)
            }
           })
        }catch(error){
            console.log(error)
        }
        
    }
}